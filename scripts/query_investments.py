from google.cloud import datastore
import json
import random
import argparse

def get_category_from_entity(entity):
    """Safely extracts the category from a Datastore entity."""
    if 'shallowReport' in entity and isinstance(entity['shallowReport'], dict):
        risk_assessment = entity['shallowReport'].get('riskAssessment', {})
        if isinstance(risk_assessment, dict):
            return risk_assessment.get('category')
    return None

def query_random(client, category, num):
    """Fetches random investments based on category."""
    query = client.query(kind='Investment')
    investments = list(query.fetch())
    
    if category is not None:
        candidates = [
            entity for entity in investments 
            if get_category_from_entity(entity) == str(category)
        ]
    else:
        candidates = investments
        
    if not candidates:
        print(f"No investments found with category {category}.")
        return

    num_to_select = min(num, len(candidates))
    selected_candidates = random.sample(candidates, num_to_select)
    
    print(f"Found {len(selected_candidates)} random investment(s):")
    print(json.dumps(selected_candidates, indent=2, ensure_ascii=False))

def query_highest_no_deep(client, num):
    """Fetches top market value investments in Category 1 without a deep report."""
    query = client.query(kind='Investment')
    query.add_filter('state', '!=', 'done_deep')
    investments = list(query.fetch())

    candidates = [
        entity for entity in investments
        if get_category_from_entity(entity) == '1'
    ]
    
    if not candidates:
        print("No Category 1 investments found that are awaiting a deep report.")
        return

    # Sort by marketValueNok descending
    candidates.sort(key=lambda x: x.get('marketValueNok', 0), reverse=True)
    
    num_to_select = min(num, len(candidates))
    selected_candidates = candidates[:num_to_select]
    
    print(f"Found {len(selected_candidates)} highest value investment(s) in Category 1 without a deep report:")
    print(json.dumps(selected_candidates, indent=2, ensure_ascii=False))

def show_stats(client):
    """Fetches and displays statistics about the 'state' field."""
    print("Fetching investment stats...")
    query = client.query(kind='Investment')
    query.projection = ['state']
    all_investments = list(query.fetch())

    stats = {
        'pending': 0,
        'in_progress_shallow': 0,
        'done_shallow': 0,
        'error_shallow': 0,
        'done_deep': 0,
        'other': 0
    }

    for entity in all_investments:
        state = entity.get('state', 'other')
        if state in stats:
            stats[state] += 1
        else:
            stats['other'] += 1
    
    total = len(all_investments)
    print("\nInvestment State Statistics:")
    print(f"  - Total Investments: {total}")
    print(f"  - Pending: {stats['pending']}")
    print(f"  - In Progress (Shallow): {stats['in_progress_shallow']}")
    print(f"  - Shallow Report Done: {stats['done_shallow']}")
    print(f"  - Deep Report Done: {stats['done_deep']}")
    print(f"  - Error (Shallow): {stats['error_shallow']}")
    if stats['other'] > 0:
        print(f"  - Other/Unknown: {stats['other']}")

def query_no_reports(client):
    """Finds investments missing both a shallow and a deep report field."""
    print("Fetching all investments to check for missing reports...")
    query = client.query(kind='Investment')
    all_investments = list(query.fetch())
    
    missing_both_reports_count = 0

    for entity in all_investments:
        if 'shallowReport' not in entity and 'deepReport' not in entity:
            missing_both_reports_count += 1
            
    print(f"\nFound {missing_both_reports_count} investments missing both a shallowReport and deepReport.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Query investments from Datastore.\n\n'
                    'Modes:\n'
                    '  stats (default):  Show statistics about the processing state of investments.\n'
                    '  random:           Fetch one or more random investments, optionally filtering by category.\n'
                    '  highest-no-deep:  Find the highest market value investments in Category 1 that are missing a deep report.\n'
                    '  no-reports:       List investments that are missing a shallow or deep report field.',
        formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument('mode', nargs='?', default='stats', choices=['stats', 'random', 'highest-no-deep', 'no-reports'], 
                        help='The query mode to execute. Defaults to "stats".')
    parser.add_argument('--cat', type=int, choices=[1, 2, 3, 4], 
                        help='Category to filter by for "random" mode.')
    parser.add_argument('--num', type=int, default=None, 
                        help='Number of investments to return. Defaults to 1 for "random" and 5 for "highest-no-deep".')

    args = parser.parse_args()
    
    client = datastore.Client(database='investment-reports')

    if args.mode == 'stats':
        show_stats(client)
    elif args.mode == 'random':
        num = args.num if args.num is not None else 1
        query_random(client, args.cat, num)
    elif args.mode == 'highest-no-deep':
        num = args.num if args.num is not None else 5
        query_highest_no_deep(client, num)
    elif args.mode == 'no-reports':
        query_no_reports(client)
