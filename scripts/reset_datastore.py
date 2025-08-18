import json
from google.cloud import datastore

def reset_datastore_entries():
    client = datastore.Client(database='investment-reports')
    
    # Load the base investments data
    with open('scripts/investments.json', 'r', encoding='utf-8') as f:
        base_investments = {item['id']: item for item in json.load(f)}
        
    # Query for entities that need resetting
    query = client.query(kind='Investment')
    query.add_filter('state', 'IN', ['in_progress_shallow', 'error_shallow'])
    entities_to_reset = list(query.fetch())
    
    if not entities_to_reset:
        print("No entries to reset.")
        return
        
    print(f"Found {len(entities_to_reset)} entries to reset.")
    
    batch = client.batch()
    batch.begin()
    
    for i, entity in enumerate(entities_to_reset):
        entity_id = entity.key.name
        if entity_id in base_investments:
            reset_data = base_investments[entity_id]
            reset_data['state'] = 'pending'
            
            key = client.key('Investment', entity_id)
            entity_to_update = datastore.Entity(key=key)
            entity_to_update.update(reset_data)
            batch.put(entity_to_update)
            
            if (i + 1) % 500 == 0:
                print("Committing batch...")
                batch.commit()
                batch = client.batch()
                batch.begin()
    
    print("Committing final batch...")
    batch.commit()
    
    print("Datastore reset complete.")

if __name__ == '__main__':
    reset_datastore_entries()
