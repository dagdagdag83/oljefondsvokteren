## Oljefondsvokteren – Cloud Run starter

A static-only proof-of-concept application, deployed to Google Cloud Run.

### Stack

-   **Frontend**: React + Vite (static), served by Nginx
-   **Data**: Local JSON files

### Local Development

To run the app locally, follow these steps:

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the development server**:
    ```bash
    npm run dev
    ```

Open the URL provided by Vite in your browser to see the application.

### Deployment

This is a static site and can be deployed to any static hosting provider, including Google Cloud Run. The provided `Dockerfile` builds the static assets and serves them with Nginx.

---

### Structure

```
frontend/
  public/
    data/
      investments.json
      mel.json
  src/
    components/
    pages/
    shared/
  ...
Dockerfile
```


