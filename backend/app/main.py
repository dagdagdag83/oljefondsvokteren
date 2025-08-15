import os
import json
import re
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI(title="Oljefondsvokteren API")


frontend_origin = os.getenv("FRONTEND_ORIGIN", "*")
allow_origins = [frontend_origin] if frontend_origin != "*" else ["*"]

app.add_middleware(
	CORSMiddleware,
	allow_origins=allow_origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.get("/")
def root():
	return {"service": "ofv-backend", "status": "ok"}


@app.get("/health")
def health():
	return {"status": "healthy"}


class CompanyEvaluation(BaseModel):
	id: str
	name: str
	country: str
	sector: str
	concerns: str
	guideline: str
	category: int
	rationale: str


class PagedCompanies(BaseModel):
	items: List[CompanyEvaluation]
	page: int
	page_size: int
	total: int


DATA_FILE_DEFAULT = "/app/data/investments.json"


def _slugify(value: str) -> str:
	value = value.strip().lower()
	value = re.sub(r"[^a-z0-9]+", "-", value)
	value = re.sub(r"-+", "-", value).strip("-")
	return value or "item"


def _load_dataset(path: str) -> List[CompanyEvaluation]:
	with open(path, "r", encoding="utf-8") as f:
		raw: List[Dict[str, Any]] = json.load(f)
	items: List[CompanyEvaluation] = []
	for row in raw:
		cid = _slugify(row.get("name", ""))
		items.append(CompanyEvaluation(
			id=cid,
			name=row.get("name", ""),
			country=row.get("country", "Unknown"),
			sector=row.get("sector", "Unknown"),
			concerns=row.get("concerns", ""),
			guideline=row.get("guideline", ""),
			category=int(row.get("category", 1)),
			rationale=row.get("rationale", ""),
		))
	return items


def _index_companies(items: List[CompanyEvaluation]) -> Dict[str, CompanyEvaluation]:
	return {c.id: c for c in items}


DATA_FILE = os.getenv("DATA_FILE", DATA_FILE_DEFAULT)
try:
	COMPANIES: List[CompanyEvaluation] = _load_dataset(DATA_FILE)
except Exception:
	COMPANIES = []
COMPANY_BY_ID: Dict[str, CompanyEvaluation] = _index_companies(COMPANIES)


@app.get("/companies", response_model=PagedCompanies)
def list_companies(
	q: Optional[str] = Query(None, description="Free text search in name, concerns, rationale"),
	country: Optional[str] = Query(None),
	sector: Optional[str] = Query(None),
	category: Optional[int] = Query(None, ge=1, le=4),
	page: int = Query(1, ge=1),
	page_size: int = Query(20, ge=1, le=200),
):
	items = COMPANIES
	if q:
		q_l = q.lower()
		items = [c for c in items if (
			q_l in c.name.lower() or q_l in c.concerns.lower() or q_l in c.rationale.lower()
		)]
	if country:
		items = [c for c in items if c.country.lower() == country.lower()]
	if sector:
		items = [c for c in items if c.sector.lower() == sector.lower()]
	if category is not None:
		items = [c for c in items if c.category == category]

	# Sort by category desc, then name asc
	items = sorted(items, key=lambda c: (-c.category, c.name.lower()))

	total = len(items)
	start = (page - 1) * page_size
	end = start + page_size
	page_items = items[start:end]
	return PagedCompanies(items=page_items, page=page, page_size=page_size, total=total)


@app.get("/companies/{company_id}", response_model=CompanyEvaluation)
def get_company(company_id: str):
	company = COMPANY_BY_ID.get(company_id)
	if not company:
		raise HTTPException(status_code=404, detail="Company not found")
	return company


@app.get("/stats")
def stats():
	by_category: Dict[int, int] = {}
	by_country: Dict[str, int] = {}
	by_sector: Dict[str, int] = {}
	for c in COMPANIES:
		by_category[c.category] = by_category.get(c.category, 0) + 1
		by_country[c.country] = by_country.get(c.country, 0) + 1
		by_sector[c.sector] = by_sector.get(c.sector, 0) + 1
	return {
		"total": len(COMPANIES),
		"by_category": by_category,
		"by_country": by_country,
		"by_sector": by_sector,
	}


