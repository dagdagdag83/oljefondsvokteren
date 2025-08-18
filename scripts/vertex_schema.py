import os
import json

def load_schema_by_name(filename):
    """Loads a schema from the scripts directory and removes the '$schema' key."""
    schema_path = os.path.join(os.path.dirname(__file__), filename)
    with open(schema_path, 'r') as f:
        schema = json.load(f)
    # The Google GenAI library does not expect the '$schema' key
    if '$schema' in schema:
        del schema['$schema']
    return schema
