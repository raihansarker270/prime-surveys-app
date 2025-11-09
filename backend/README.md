# Prime Surveys Backend

This folder contains the Node.js backend server for the Prime Surveys application. It's built with Express.js and connects to a PostgreSQL database (designed for Neon.tech).

## Setup

1.  **Install Dependencies:**
    Navigate into this `backend` directory and run:
    ```bash
    npm install
    ```

2.  **Set up Environment Variables:**
    - Create a `.env` file in this `backend` directory (i.e., `backend/.env`).
    - Copy the contents of `.env.example` into your new `.env` file.
    - **`DATABASE_URL`**: Get this from your **Neon.tech** database project. Find the connection string that looks like `postgres://...` in your Neon dashboard.
    - **`JWT_SECRET`**: **IMPORTANT!** Change this to a long, random, secret string. You can generate one online.
    - **`PORT`**: The port the server will run on (defaults to 3001).

3.  **Run the Server:**
    For development (restarts automatically on file changes):
    ```bash
    npm run dev
    ```
    For production:
    ```bash
    npm start
    ```
    The server will start and automatically create the necessary database tables in your Neon database if they don't exist.

## Deployment to Render.com

1.  Push this entire project (both frontend files and the `backend` directory) to a GitHub repository.
2.  Go to Render.com and create a new **"Web Service"**.
3.  Connect your GitHub repository.
4.  Set the **Root Directory** to `backend`. This tells Render to run commands from within this folder.
5.  Set the **Build Command** to `npm install`.
6.  Set the **Start Command** to `npm start`.
7.  Under the "Environment" tab, add your `DATABASE_URL` and `JWT_SECRET` from your `.env` file.
8.  Deploy! Render will provide you with a public URL for your backend (e.g., `https://prime-surveys-backend.onrender.com`).

## Final Step: Connect Frontend to Deployed Backend

Once your backend is live on Render, you must update the `API_BASE_URL` constant in your frontend file `contexts/AuthContext.tsx` to your new Render URL.

```javascript
// in contexts/AuthContext.tsx
const API_BASE_URL = 'https://your-backend-url.onrender.com'; 
```
After updating this URL, you can deploy your frontend as a **"Static Site"** on Render.
