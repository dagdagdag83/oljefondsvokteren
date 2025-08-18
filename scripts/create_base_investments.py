import csv
import json
import re

def create_base_investments():
    csv_file_path = 'scripts/EQ_2025_06_30_Industry.csv'
    json_file_path = 'scripts/investments.json'
    
    investments = []
    
    # Static definition of CSV headers
    header = [
        "industry", "region", "country", "name", "marketValueNok",
        "marketValueUsd", "voting", "ownership", "incorporationCountry"
    ]
    
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=';')
        next(csv_reader)  # Skip header row in the file
        
        for row in csv_reader:
            row_data = dict(zip(header, row))
            
            # Create a slug for the id
            company_id = re.sub(r'[^a-z0-9]+', '-', row_data.get('name', '').lower()).strip('-')

            investment = {
                'id': company_id,
                'industry': row_data.get('industry'),
                'region': row_data.get('region'),
                'country': row_data.get('country'),
                'name': row_data.get('name'),
                'marketValueNok': row_data.get('marketValueNok'),
                'marketValueUsd': row_data.get('marketValueUsd'),
                'voting': row_data.get('voting'),
                'ownership': row_data.get('ownership'),
                'incorporationCountry': row_data.get('incorporationCountry'),
                'shallowReport': {}
            }
            investments.append(investment)
            
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(investments, json_file, indent=4)

    print(f"Successfully created {json_file_path} with {len(investments)} entries.")

if __name__ == '__main__':
    create_base_investments()
