import json
import os
from google.cloud import datastore

def export_investments_to_json():
    """Fetches all investments from Datastore and exports them to a JSON file."""
    
    client = datastore.Client(database='investment-reports')
    
    # Query for all entities of kind 'Investment'
    query = client.query(kind='Investment')
    all_investments = list(query.fetch())
    
    if not all_investments:
        print("No investments found in Datastore to export.")
        return
        
    print(f"Found {len(all_investments)} investments to export.")
    
    # Define the output path relative to the script's location
    script_dir = os.path.dirname(__file__)
    output_path = os.path.join(script_dir, '..', 'frontend', 'public', 'data', 'investments_exported.json')
    
    # Ensure the output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Write the data to the JSON file
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_investments, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully exported all investments to {output_path}")

if __name__ == '__main__':
    export_investments_to_json()
