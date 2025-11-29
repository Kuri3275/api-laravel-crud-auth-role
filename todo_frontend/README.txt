Simple static frontend for the uploaded Laravel Todo API.

Files:
- index.html
- styles.css
- app.js

How to use:
1. Make sure your Laravel backend is running:
   php artisan serve
   (default API base: http://127.0.0.1:8000/api)

2. Open index.html in your browser (you can open file directly,
   or serve it via a static server).

3. The page will call /api/todos endpoints:
   GET /api/todos
   POST /api/todos
   PUT /api/todos/{id}
   DELETE /api/todos/{id}

Notes:
- If your API base URL is different, edit the API_BASE variable in index.html.
- This frontend uses simple fetch(...) calls and requires CORS enabled on the backend
  if you open index.html from the file system or from another origin.
