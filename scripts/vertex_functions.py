import os
from json import loads
from google import genai
from google.genai import types
from vertex_schema import load_schema_by_name
import multiprocessing
import queue

class TimeoutException(Exception):
    pass

def _vertex_call_wrapper(queue, model, contents, config):
    """Wrapper to run the blocking API call in a separate process."""
    try:
        if model == "gemini-2.5-pro":
            print(f"[{os.getpid()}] Starting Vertex AI call for model: {model}...")
        client = genai.Client(vertexai=True, project="oljefondvakt", location="global")
        
        # Determine if we should stream based on model
        if model == "gemini-2.5-pro":
            stream = client.models.generate_content_stream(model=model, contents=contents, config=config)
            full_response_list = []
            print(f"[{os.getpid()}] Streaming response:\n---")
            for chunk in stream:
                print(chunk.text, end="", flush=True)
                full_response_list.append(chunk.text)
            print("\n---")
            full_response = "".join(full_response_list)
            queue.put(loads(full_response))
        else:
            response = client.models.generate_content(model=model, contents=contents, config=config)
            queue.put(loads(response.text))
        
        if model == "gemini-2.5-pro":
            print(f"[{os.getpid()}] Vertex AI call finished successfully.")

    except Exception as e:
        error_message = f"Vertex AI call failed: {e}"
        if model == "gemini-2.5-pro":
            print(f"[{os.getpid()}] {error_message}")
        queue.put(error_message)

def load_pdf_bytes(pdf_path):
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"The file {pdf_path} was not found.")
    with open(pdf_path, "rb") as f:
        return f.read()

def load_prompt_template():
    prompt_path = os.path.join(os.path.dirname(__file__), 'prompt.txt')
    with open(prompt_path, 'r', encoding='utf-8') as f:
        return f.read()

def vertex_generate_shallow_report(ethical_guidelines_pdf_bytes, prompt, schema_filename):
  client = genai.Client(
      vertexai=True,
      project="oljefondvakt",
      location="global",
  )

  document1 = types.Part.from_bytes(
      data=ethical_guidelines_pdf_bytes,
      mime_type="application/pdf",
  )
  
  text1 = types.Part.from_text(text=prompt)

  model = "gemini-2.5-flash"
  contents = [
    types.Content(
      role="user",
      parts=[
        document1,
        text1
      ]
    )
  ]

  generate_content_config = types.GenerateContentConfig(
    temperature = 0,
    top_p = 1,
    seed = 0,
    max_output_tokens = 65535,
    response_mime_type = "application/json",
    response_schema = load_schema_by_name(schema_filename)

  )

  result_queue = multiprocessing.Queue()
  process = multiprocessing.Process(
      target=_vertex_call_wrapper,
      args=(result_queue, model, contents, generate_content_config)
  )
  
  process.start()
  process.join(timeout=120) # 2-minute timeout

  if process.is_alive():
      process.terminate()
      process.join()
      raise TimeoutException("Vertex AI call timed out")

  result = result_queue.get()
  if isinstance(result, Exception):
      raise result
      
  results = result
  
  # Post-process the results to clean up the guidelines
  for report in results:
      if 'riskAssessment' in report and 'guidelines' in report['riskAssessment']:
          cleaned_guidelines = [g.replace('\u00a7', '') for g in report['riskAssessment']['guidelines']]
          report['riskAssessment']['guidelines'] = cleaned_guidelines
          
  return results

def vertex_generate_deep_report(pdf_bytes, schema_filename):
    """Generates a structured deep report from a PDF using Vertex AI."""
    
    client = genai.Client(vertexai=True, project="oljefondvakt", location="global")

    pdf_part = types.Part.from_bytes(data=pdf_bytes, mime_type="application/pdf")
    prompt_part = types.Part.from_text(
        text="""Analyze the attached PDF document, which is a detailed risk assessment report. It will contain product-based and conduct-based risk as well as key geopolitical conflicts risk exposure.Extract all relevant information and structure it according to the provided JSON schema.

Key formatting instructions:
- For the `guidelines` field, use the format 'section.letter' (e.g., '4.e', '3.d').
- The `category` must be one of the following: "1", "2", "3", or "4".

All text must be in English."""
    )
    
    model = "gemini-2.5-pro"
    contents = [types.Content(role="user", parts=[pdf_part, prompt_part])]
    
    generate_content_config = types.GenerateContentConfig(
        temperature=0,
        response_mime_type="application/json",
        response_schema=load_schema_by_name(schema_filename)
    )

    result_queue = multiprocessing.Queue()
    process = multiprocessing.Process(
        target=_vertex_call_wrapper,
        args=(result_queue, model, contents, generate_content_config)
    )
    
    process.start()
    try:
        # Wait for the result to appear on the queue, with a timeout.
        result = result_queue.get(timeout=300)
    except queue.Empty:
        raise TimeoutException("Vertex AI call for deep report timed out")
    finally:
        # Always ensure the child process is terminated.
        if process.is_alive():
            process.terminate()
            process.join()

    if isinstance(result, str):
        raise Exception(result)
        
    return result

