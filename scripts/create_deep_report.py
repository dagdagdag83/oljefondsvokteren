import argparse
import json
import os
from google.cloud import datastore
from vertex_functions import vertex_generate_deep_report, load_pdf_bytes

def get_investment_by_id(client, company_id):
    """Fetches a single investment entity from Datastore by its ID."""
    key = client.key('Investment', company_id)
    return client.get(key)

def update_investment(client, investment_entity):
    """Updates a single investment entity in Datastore."""
    client.put(investment_entity)

def main():
    parser = argparse.ArgumentParser(description="Generate a deep research report from a PDF and update Datastore.")
    parser.add_argument('pdf_path', type=str, help='The path to the PDF report file.')
    args = parser.parse_args()

    # --- 1. Get Company ID from filename ---
    company_id = os.path.splitext(os.path.basename(args.pdf_path))[0]
    print(f"Processing report for company ID: {company_id}")

    # --- 2. Fetch from Datastore ---
    client = datastore.Client(database='investment-reports')
    investment_entity = get_investment_by_id(client, company_id)

    if not investment_entity:
        print(f"Error: No investment found in Datastore with ID '{company_id}'.")
        return

    print(f"Found existing investment for '{investment_entity.get('name', company_id)}'.")

    # --- 3. Generate Deep Report from PDF ---
    pdf_bytes = load_pdf_bytes(args.pdf_path)
    schema_filename = "full.schema.json"
    
    print(f"Generating deep report from {args.pdf_path}...")
    try:
        deep_report_data = vertex_generate_deep_report(pdf_bytes, schema_filename)
        print("Successfully generated and validated deep report data.")
    except Exception as e:
        print(f"Error generating deep report: {e}")
        # Optionally, update state to error_deep here
        # investment_entity['state'] = 'error_deep'
        # update_investment(client, investment_entity)
        return

    # --- 4. Merge and Update Datastore ---
    investment_entity['deepReport'] = deep_report_data
    investment_entity['state'] = 'done_deep'
    
    print("Updating entity in Datastore...")
    update_investment(client, investment_entity)
    
    print(f"\nSuccessfully updated Datastore with deep report for '{company_id}'.")
    # print(json.dumps(deep_report_data, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
