import argparse
import threading
import queue
import json
from jsonschema import validate, ValidationError
from google.cloud import datastore
from vertex_functions import vertex_generate_shallow_report, load_pdf_bytes, load_prompt_template

class Config:
    COMPANIES_PER_PROMPT = 10
    NUM_THREADS = 10
    TOTAL_ITEMS_TO_PROCESS = 250 # Default value, can be overridden by cmd arg

def load_shallow_schema():
    """Loads the shallow report schema."""
    with open('scripts/shallow.schema.json', 'r') as f:
        return json.load(f)

def get_and_lock_pending_investments(client, limit, lock):
    """Fetches and locks a batch of investments that are in the 'pending' state."""
    with lock:
        query = client.query(kind='Investment')
        query.add_filter('state', '=', 'pending')
        # Fetch full entities
        investments = list(query.fetch(limit=limit))
        
        if investments:
            # Create a list of keys to fetch the full entities again
            keys = [client.key('Investment', inv['id']) for inv in investments]
            # Fetch the full entities to ensure we have all data (like deepReport)
            full_investments = client.get_multi(keys)

            for investment in full_investments:
                investment['state'] = 'in_progress_shallow'
            
            batch = client.batch()
            batch.begin()
            for investment in full_investments:
                key = client.key('Investment', investment['id'])
                entity = datastore.Entity(key=key)
                entity.update(investment)
                batch.put(entity)
            batch.commit()
            return full_investments
    return []

def update_investments(client, updated_investments, completed_count, lock):
    """Updates a list of investments in Datastore."""
    batch = client.batch()
    batch.begin()
    for investment in updated_investments:
        key = client.key('Investment', investment['id'])
        entity = datastore.Entity(key=key)
        entity.update(investment)
        batch.put(entity)
    batch.commit()
    with lock:
        completed_count[0] += len(updated_investments)
        print(f"({completed_count[0]}/{Config.TOTAL_ITEMS_TO_PROCESS}) investments updated.")

def results_saver(result_queue, stop_event, completed_count, lock):
    """A dedicated thread to save results as they come in."""
    client = datastore.Client(database='investment-reports')
    while not stop_event.is_set() or not result_queue.empty():
        try:
            batch = result_queue.get(timeout=1)
            update_investments(client, batch, completed_count, lock)
            result_queue.task_done()
        except queue.Empty:
            continue

def worker(processed_count, lock, result_queue, schema, pdf_bytes, prompt_template):
    """The worker function for each thread."""
    client = datastore.Client(database='investment-reports')
    
    while True:
        with lock:
            if processed_count[0] >= Config.TOTAL_ITEMS_TO_PROCESS:
                break
            
            batch_size = min(Config.COMPANIES_PER_PROMPT, Config.TOTAL_ITEMS_TO_PROCESS - processed_count[0])
            if batch_size <= 0:
                break
            
            processed_count[0] += batch_size
        
        batch = get_and_lock_pending_investments(client, batch_size, lock)
        if not batch:
            break

        for attempt in range(2): # Allow for one retry
            try:
                print(f"Thread {threading.current_thread().name} processing batch of {len(batch)} companies (Attempt {attempt + 1}).")
                
                # Sanitize and format the data for the prompt
                sanitized_companies = []
                for company in batch:
                    name = company.get('name', '').replace('"', '').replace('\\', '')
                    country = company.get('country', '').replace('"', '').replace('\\', '')
                    sanitized_companies.append(f"{name} from {country}")
                
                companies_data_string = "\n".join(sanitized_companies)
                prompt = prompt_template.format(companies_data=companies_data_string)
                
                # Call the Vertex AI function
                shallow_reports = vertex_generate_shallow_report(pdf_bytes, prompt, "shallow.schema.json")
                
                # Check if the number of reports matches the batch size
                if len(shallow_reports) != len(batch):
                    raise ValueError(f"Mismatched response count: expected {len(batch)}, got {len(shallow_reports)}")
                
                # Validate the response against the schema
                validate(instance=shallow_reports, schema=schema)
                
                # Associate results with original companies
                for i, report in enumerate(shallow_reports):
                    # This ensures we keep all original data, including deepReport if present
                    batch[i].update({
                        'shallowReport': report,
                        'state': 'done_shallow'
                    })
                
                result_queue.put(batch)
                print(f"Thread {threading.current_thread().name} finished processing batch.")
                break # Success, exit the retry loop
                
            except (ValidationError, Exception) as e:
                print(f"Attempt {attempt + 1} failed for batch: {e}")
                if attempt == 1:
                    # Log the raw response if it exists
                    if 'shallow_reports' in locals():
                        print("--- FAILED VERTEX RESPONSE ---")
                        print(shallow_reports)
                        print("-----------------------------")
                    print(f"Batch failed after 2 attempts. Marking as error and skipping.")
                    for company in batch:
                        company['state'] = 'error_shallow'
                    result_queue.put(batch) # Put the batch with error state in the queue to be updated
        
def main(num_items):
    Config.TOTAL_ITEMS_TO_PROCESS = num_items if num_items else Config.TOTAL_ITEMS_TO_PROCESS
    
    # Load external files once
    pdf_bytes = load_pdf_bytes('scripts/etchical_guidelines.pdf')
    prompt_template = load_prompt_template()
    shallow_schema = load_shallow_schema()
    
    job_lock = threading.Lock()
    completed_lock = threading.Lock()
    result_queue = queue.Queue()
    
    # Use a list to hold the counter so it's mutable and passed by reference
    processed_count = [0]
    completed_count = [0]
    
    # Create and start worker threads
    threads = []
    for i in range(Config.NUM_THREADS):
        thread = threading.Thread(target=worker, args=(processed_count, job_lock, result_queue, shallow_schema, pdf_bytes, prompt_template), name=f"Worker-{i+1}")
        threads.append(thread)
        thread.start()
        
    # Create and start the results saver thread
    stop_event = threading.Event()
    saver_thread = threading.Thread(target=results_saver, args=(result_queue, stop_event, completed_count, completed_lock))
    saver_thread.start()
        
    for thread in threads:
        thread.join()
        
    # All workers are done, signal the saver to stop
    stop_event.set()
    saver_thread.join()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Create shallow investment reports using Vertex AI.")
    parser.add_argument('num_items', type=int, nargs='?', default=None, help='The number of investments to process.')
    args = parser.parse_args()
    
    main(args.num_items)
