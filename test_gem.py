from google import genai
from google.genai import types
import base64

def generate():
  client = genai.Client(
      vertexai=True,
      project="PROJECT",
      location="global",
  )

  text1 = types.Part.from_text(text="""create a json response based on the linked report. make sure to generate an id, example \"aarti-industries-ltd\". DO NOT SKIP any required fields!""")

  model = "gemini-2.5-pro"
  contents = [
    types.Content(
      role="user",
      parts=[
        text1
      ]
    )
  ]

  generate_content_config = types.GenerateContentConfig(
    temperature = 0,
    top_p = 0.95,
    seed = 0,
    max_output_tokens = 65535,
    safety_settings = [types.SafetySetting(
      category="HARM_CATEGORY_HATE_SPEECH",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_HARASSMENT",
      threshold="OFF"
    )],
    response_mime_type = "application/json",
    response_schema = {"$schema":"http://json-schema.org/draft-07/schema#","title":"Investment","description":"Schema for an investment entry in the Oljefondsvokteren project.","type":"OBJECT","properties":{"id":{"type":"STRING"},"name":{"type":"STRING"},"country":{"type":"STRING"},"sector":{"type":"STRING"},"concerns":{"type":"STRING"},"guideline":{"type":"STRING"},"category":{"type":"INTEGER"},"rationale":{"type":"STRING"},"detailedReport":{"type":"OBJECT","properties":{"companyProfile":{"type":"OBJECT","properties":{"name":{"type":"STRING"},"ticker":{"type":"STRING"},"exchange":{"type":"STRING"},"headquarters":{"type":"STRING"},"founded":{"type":"INTEGER"},"sector":{"type":"STRING"},"businessDescription":{"type":"STRING"},"financials":{"type":"OBJECT","properties":{"revenue2024":{"type":"STRING"},"marketCapAug2025":{"type":"STRING"}},"required":["revenue2024","marketCapAug2025"]},"globalFootprint":{"type":"ARRAY","items":{"type":"OBJECT","properties":{"region":{"type":"STRING"},"locations":{"type":"STRING"}},"required":["region","locations"]}}},"required":["name","ticker","exchange","headquarters","founded","sector","businessDescription","financials","globalFootprint"]},"esgAssessmentSummary":{"type":"OBJECT","properties":{"finalRiskCategory":{"type":"STRING"},"executiveSummary":{"type":"STRING"},"summaryRiskTable":{"type":"ARRAY","items":{"type":"OBJECT","properties":{"criterion":{"type":"STRING"},"riskLevel":{"type":"STRING"}},"required":["criterion","riskLevel"]}}},"required":["finalRiskCategory","executiveSummary","summaryRiskTable"]},"detailedRiskAnalysis":{"type":"ARRAY","items":{"type":"OBJECT","properties":{"criterion":{"type":"STRING"},"riskLevel":{"type":"STRING"},"findings":{"type":"STRING"}},"required":["criterion","riskLevel","findings"]}},"productAnalysis":{"type":"OBJECT","properties":{"portfolioOverview":{"type":"STRING"},"dualUseNature":{"type":"STRING"},"productBasedExclusionAnalysis":{"type":"STRING"}},"required":["portfolioOverview","dualUseNature","productBasedExclusionAnalysis"]},"geopoliticalExposure":{"type":"OBJECT","properties":{"russiaUkraineConflict":{"type":"OBJECT","properties":{"stance":{"type":"STRING"},"actions":{"type":"STRING"}},"required":["stance","actions"]},"israeliPalestinianConflict":{"type":"OBJECT","properties":{"stance":{"type":"STRING"},"actions":{"type":"STRING"}},"required":["stance","actions"]},"inconsistentEthicalPostureAnalysis":{"type":"STRING"}},"required":["russiaUkraineConflict","israeliPalestinianConflict","inconsistentEthicalPostureAnalysis"]},"assessmentMetadata":{"type":"OBJECT","properties":{"reportTitle":{"type":"STRING"},"assessmentDate":{"type":"STRING","format":"date"},"assessedBy":{"type":"STRING"},"guidelineReference":{"type":"STRING"}},"required":["reportTitle","assessmentDate","assessedBy","guidelineReference"]}},"required":["companyProfile","esgAssessmentSummary","detailedRiskAnalysis","productAnalysis","geopoliticalExposure","assessmentMetadata"]}},"required":["id","name","country","sector","concerns","guideline","category","rationale","detailedReport"]},
    thinking_config=types.ThinkingConfig(
      thinking_budget=-1,
    ),
  )

  for chunk in client.models.generate_content_stream(
    model = model,
    contents = contents,
    config = generate_content_config,
    ):
    print(chunk.text, end="")

generate()