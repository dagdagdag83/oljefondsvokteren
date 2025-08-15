## Oljefondsvokteren – A Static React Application

A static proof-of-concept application, built with React and Vite, and deployed to GitHub Pages.

### Stack

-   **Frontend**: React + Vite
-   **Data**: Local JSON files
-   **Deployment**: GitHub Actions to GitHub Pages

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

This project is automatically deployed to GitHub Pages upon pushing to the `main` branch, using the workflow defined in `.github/workflows/deploy.yml`.

To enable deployment, you need to configure your repository's settings:

1.  Go to **Settings** > **Pages**.
2.  Under **Build and deployment**, select **GitHub Actions** as the source.

The site will be available at `https://<your-username>.github.io/oljefondsvokteren/`.

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


