# PlateWise

PlateWise is a full-stack monorepo for personalized restaurant menu recommendations. Users build a food profile, upload menu screenshots or PDFs, or paste a restaurant URL. The system extracts dishes, estimates likely nutrition, filters unsafe options, and ranks menu items with transparent explanations.

Recommendations are based on estimated nutrition and provided profile information. This is not medical advice.

## Monorepo structure

```text
.
|-- backend/
|   |-- app/
|   |   |-- api/
|   |   |-- core/
|   |   |-- db/
|   |   |-- models/
|   |   |-- schemas/
|   |   |-- services/
|   |   |-- init_db.py
|   |   |-- main.py
|   |   `-- seed.py
|   |-- sample_data/
|   |-- storage/uploads/
|   |-- .env.example
|   `-- requirements.txt
|-- docs/
|   |-- api.md
|   |-- architecture.md
|   `-- database-schema.md
|-- frontend/
|   |-- app/
|   |-- components/
|   |-- lib/
|   |-- .env.example
|   |-- package.json
|   `-- tailwind.config.ts
`-- .env.example
```

## Stack

- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn-style UI primitives
- Backend: FastAPI, Pydantic, MongoDB, PyMongo
- Ingestion: local PDF text extraction, OCR for images and scanned PDFs, and website-to-menu structuring
- Recommendations: OpenAI-powered ranking and nutrition estimation based only on the uploaded or scraped menu content and the user profile

## Backend Setup

Run these from PowerShell:

```powershell
cd C:\Users\Projects\HealthyBite\backend
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
copy .env.example .env
```

Then edit [backend/.env](/c:/Users/Projects/HealthyBite/backend/.env) and set:

```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=platewise
OPENAI_API_KEY=your_openai_key_here
OPENAI_MENU_MODEL=gpt-4.1-mini
OPENAI_RECOMMENDATION_MODEL=gpt-4.1-mini
```

Initialize the MongoDB collections and verify OpenAI:

```powershell
.\.venv\Scripts\python.exe -m app.init_db
.\.venv\Scripts\python.exe scripts\openai_smoke_test.py
```

Start the backend:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

API runs at `http://localhost:8000`, Swagger at `http://localhost:8000/docs`, and health check at `http://localhost:8000/health`.

The backend expects MongoDB to be available at the `MONGODB_URL` in [backend/.env.example](/c:/Users/Projects/HealthyBite/backend/.env.example). The default is `mongodb://localhost:27017` with database name `platewise`.
For image OCR and scanned PDFs, install Tesseract OCR locally. On Windows scanned-PDF conversion also needs Poppler for `pdf2image`.
Set `OPENAI_API_KEY` in [backend/.env](/c:/Users/Projects/HealthyBite/backend/.env) to enable menu analysis and recommendations. Do not commit real API keys.

## Frontend Setup

```powershell
cd C:\Users\Projects\HealthyBite\frontend
cmd /c npm install
copy .env.example .env.local
```

Ensure [frontend/.env.local](/c:/Users/Projects/HealthyBite/frontend/.env.local) contains:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

Start the frontend:

```powershell
cmd /c npm run dev
```

Frontend runs at `http://localhost:3000`.

## Daily Run Commands

Use 2 terminals.

Backend terminal from [backend](/c:/Users/Projects/HealthyBite/backend):

```powershell
cd C:\Users\Projects\HealthyBite\backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Frontend terminal from [frontend](/c:/Users/Projects/HealthyBite/frontend):

```powershell
cd C:\Users\Projects\HealthyBite\frontend
cmd /c npm run dev
```

If dependencies are not installed yet, run these once first.

Backend first-time install:

```powershell
cd C:\Users\Projects\HealthyBite\backend
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Frontend first-time install:

```powershell
cd C:\Users\Projects\HealthyBite\frontend
cmd /c npm install
```

Required backend env values in [backend/.env](/c:/Users/Projects/HealthyBite/backend/.env):

```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=platewise
OPENAI_API_KEY=your_openai_key_here
OPENAI_MENU_MODEL=gpt-4.1-mini
OPENAI_RECOMMENDATION_MODEL=gpt-4.1-mini
```

Required frontend env value in [frontend/.env.local](/c:/Users/Projects/HealthyBite/frontend/.env.local):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## Local Verification Commands

Backend compile and health check:

```powershell
cd C:\Users\Projects\HealthyBite\backend
.\.venv\Scripts\python.exe -m compileall app scripts
.\.venv\Scripts\python.exe -c "from fastapi.testclient import TestClient; from app.main import app; response = TestClient(app).get('/health'); print(response.status_code, response.json())"
.\.venv\Scripts\python.exe scripts\openai_smoke_test.py
```

Frontend production build:

```powershell
cd C:\Users\Projects\HealthyBite\frontend
cmd /c npm run build
```

## Key product flows

1. Sign up or log in.
2. Complete the profile at `/profile`.
3. **Quick analysis (new):** Upload menu at `/analyze` to get results with dietary filtering in one call.
   - OR traditional flow: Upload at `/upload` or paste URL at `/analyze-url`, then view ranked dishes at `/results`.
4. Inspect recommendation history at `/saved`.

## API summary

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/profile`
- `PUT /api/profile`
- **`POST /api/analyze` (NEW)** — Upload menu file and get dietary-filtered recommendations in one call
- `POST /api/uploads`
- `POST /api/ingest/url`
- `GET /api/menus`
- `GET /api/menus/{menu_id}`
- `POST /api/recommendations/{menu_id}`
- `GET /api/history`
- `PUT /api/history/{recommendation_id}/save`

Detailed request and response notes are in [docs/api.md](/c:/Users/Projects/HealthyBite/docs/api.md).

## Notes on estimation and safety

- Nutrition values, allergens, and dish ranking are generated from the provided menu content and profile data using OpenAI.
- Allergens are inferred from menu information and should be treated as warnings, not guarantees.
- The system avoids medical claims and uses cautious wording throughout the API and UI.
- The system is a food guidance tool, not a clinician, and should not be used as medical advice.

## Sample parser assets

- Upload parser sample: [backend/sample_data/sample_menu_upload.txt](/c:/Users/Projects/HealthyBite/backend/sample_data/sample_menu_upload.txt)
- Website parser sample payload: [backend/sample_data/sample_restaurant_payload.json](/c:/Users/Projects/HealthyBite/backend/sample_data/sample_restaurant_payload.json)

## Suggested next improvements

- Replace demo header auth with JWT bearer auth on protected routes.
- Add background jobs for OCR/crawling.
- Improve the local parser with a stronger ingredient knowledge base or richer menu dictionaries.
- Add file persistence, S3 support, and OCR providers for production use.
