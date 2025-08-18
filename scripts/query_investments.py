from google.cloud import datastore
import json
import random

def find_high_priority_candidate():
    """Finds one random investment that is Category 1 and does not have a deep report."""
    client = datastore.Client(database='investment-reports')

    query = client.query(kind='Investment')
    query.add_filter('state', '!=', 'done_deep')
    
    all_pending_investments = list(query.fetch())
    
    # Filter for entities that are Category 1 in their shallow report
    candidates = [
        entity for entity in all_pending_investments 
        if 'shallowReport' in entity and 
           entity['shallowReport'].get('riskAssessment', {}).get('category') == '1'
    ]
    
    if not candidates:
        print("No Category 1 investments found that are awaiting a deep report.")
        return

    # Select one random candidate
    selected_candidate = random.choice(candidates)
    
    print("Found a high-priority candidate for deep report:")
    print(json.dumps(selected_candidate, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    find_high_priority_candidate()
