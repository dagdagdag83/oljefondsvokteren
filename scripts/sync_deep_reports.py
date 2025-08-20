import os
import json
from google.cloud import datastore
from vertex_functions import vertex_generate_deep_report, load_pdf_bytes

def get_investment_by_id(client, company_id):
    """Fetches a single investment entity from Datastore by its ID."""
    key = client.key('Investment', company_id)
    return client.get(key)

def update_investment(client, investment_entity):
    """Updates a single investment entity in Datastore."""
    client.put(investment_entity)

def sync_deep_reports():
    """
    Scans a directory for PDF reports, checks which ones are missing a deep report
    in Datastore, and generates them.
    """
    reports_dir = 'frontend/public/reports'
    client = datastore.Client(database='investment-reports')
    
    if not os.path.isdir(reports_dir):
        print(f"Error: Reports directory not found at '{reports_dir}'")
        return

    pdf_files = [f for f in os.listdir(reports_dir) if f.endswith('.pdf')]
    print(f"Found {len(pdf_files)} PDF files in '{reports_dir}'.")

    for pdf_file in pdf_files:
        company_id = os.path.splitext(pdf_file)[0]
        pdf_path = os.path.join(reports_dir, pdf_file)
        
        print(f"\n--- Processing: {company_id} ---")
        
        investment_entity = get_investment_by_id(client, company_id)

        if not investment_entity:
            print(f"Warning: No investment found for ID '{company_id}'. Skipping.")
            continue
            
        if investment_entity.get('state') == 'done_deep':
            print(f"Deep report already exists for '{company_id}'. Skipping.")
            continue

        print(f"Found existing investment for '{investment_entity.get('name', company_id)}'.")
        
        try:
            print(f"Generating deep report from {pdf_path}...")
            pdf_bytes = load_pdf_bytes(pdf_path)
            schema_filename = "full.schema.json"
            deep_report_data = vertex_generate_deep_report(pdf_bytes, schema_filename)
            print("Successfully generated and validated deep report data.")
            
            investment_entity['deepReport'] = deep_report_data
            investment_entity['state'] = 'done_deep'
            
            print("Updating entity in Datastore...")
            update_investment(client, investment_entity)
            print(f"Successfully updated Datastore for '{company_id}'.")

        except Exception as e:
            print(f"Error processing {company_id}: {e}")
            investment_entity['state'] = 'error_deep'
            update_investment(client, investment_entity)
            print(f"Marked '{company_id}' with state 'error_deep'.")

if __name__ == '__main__':
    sync_deep_reports()
