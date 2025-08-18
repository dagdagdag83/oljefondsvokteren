import json
from vertex_functions import vertex_generate_shallow_report

def main():
    with open('./investments.json', 'r', encoding='utf-8') as f:
        investments = json.load(f)
    
    # Select the first 10 companies for the test
    test_companies = investments[:25]
    
    # Format the data as "NAME from COUNTRY"
    formatted_companies = [f"{company.get('name')} from {company.get('country')}" for company in test_companies]
    
    # Join the list into a single string for the prompt
    companies_data_string = "\n".join(formatted_companies)
    
    print("Sending the following data to Vertex AI:")
    print(companies_data_string)
    
    # Call the Vertex AI function
    results = vertex_generate_shallow_report(companies_data_string)
    
    print("\nReceived the following results:")
    print(json.dumps(results, indent=2))

if __name__ == '__main__':
    main()
