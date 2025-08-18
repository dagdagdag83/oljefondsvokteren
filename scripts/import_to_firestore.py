import json
from google.cloud import datastore

def import_investments_to_datastore():
    # Initialize Datastore client
    # The client will automatically use the credentials from GOOGLE_APPLICATION_CREDENTIALS
    client = datastore.Client(database='investment-reports')
    
    # Load the investments data
    with open('scripts/investments.json', 'r', encoding='utf-8') as f:
        investments = json.load(f)
        
    kind = 'Investment'
    
    batch = client.batch()
    batch.begin()
    
    for i, investment in enumerate(investments):
        # Add the state field
        investment['state'] = 'pending'
        
        # Create a key for the entity. We'll use the company 'id' for the key name.
        key = client.key(kind, investment['id'])
        entity = datastore.Entity(key=key)
        entity.update(investment)
        batch.put(entity)
        
        # Datastore batches also have a limit of 500 operations.
        if (i + 1) % 500 == 0:
            print(f"Committing batch of 500 entities...")
            batch.commit()
            batch = client.batch()
            batch.begin()
    
    # Commit any remaining entities
    print("Committing final batch...")
    batch.commit()
        
    print(f"Successfully imported {len(investments)} entities to Datastore.")

if __name__ == '__main__':
    import_investments_to_datastore()
