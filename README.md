# OpenCaseViewer

A web-based medical imaging viewer for viewing and managing DICOM cases.

## Stack

- **Frontend**: Vue 3, Vite, Pinia, Vue Router
- **Backend**: FastAPI, Motor (async MongoDB), pydicom
- **Database**: MongoDB
- **Infrastructure**: Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Run with Docker

```sh
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- MongoDB: localhost:27017

### Run without Docker

**Backend**

```sh
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend**

```sh
cd frontend
npm install
npm run dev
```

## Project Structure

```
opencaseviewer/
├── backend/          # FastAPI application
│   ├── app/          # Application source
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/         # Vue 3 application
│   ├── src/
│   └── Dockerfile
└── docker-compose.yml
```
