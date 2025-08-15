# syntax=docker/dockerfile:1.7
FROM python:3.13-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1

WORKDIR /app

RUN --mount=type=cache,target=/var/cache/apt \
	apt-get update && apt-get install -y --no-install-recommends \
		curl ca-certificates build-essential \
		&& rm -rf /var/lib/apt/lists/*

# Install uv (package manager) – adds to /root/.local/bin
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:${PATH}"

COPY pyproject.toml /app/pyproject.toml
COPY app /app/app
COPY investment_eval-SAMPLE.json /app/data/investments.json

# Resolve and install dependencies into an isolated .venv
RUN --mount=type=cache,target=/root/.cache/uv \
	uv sync --no-dev

# Cloud Run expects the server on $PORT
ENV PORT=8080

EXPOSE 8080

# Use the venv-installed gunicorn
CMD [".venv/bin/gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8080", "app.main:app"]


