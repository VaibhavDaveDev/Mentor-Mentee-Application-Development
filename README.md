# Mentor-Mentee Application

A web application for connecting mentors and mentees, built with FastAPI backend and React frontend.

## Project Structure

```
.
├── Backend/         # FastAPI backend
├── Frontend/        # React frontend
└── README.md        # This file
```

## Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

## Setup Instructions

### Backend Setup

1. Navigate to the Backend directory:

   ```
   cd Backend
   ```

2. Create a virtual environment:

   ```
   python -m venv venv
   ```

3. Activate the virtual environment:

   - Windows:
     ```
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

5. Configure the database:

   - Create a PostgreSQL database
   - Update the database URL in `database.py` or set it as an environment variable

   **Important:** For security reasons, you should use environment variables instead of hardcoding credentials.
   Create a `.env` file in the Backend directory with:

   ```
   DATABASE_URL=postgresql://username:password@localhost/database_name
   ```

   Then modify `database.py` to use the environment variable:

   ```python
   import os
   from dotenv import load_dotenv

   load_dotenv()
   SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
   ```

6. Run the backend server:
   ```
   uvicorn app:main --reload
   ```

### Frontend Setup

1. Navigate to the Frontend directory:

   ```
   cd Frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with the backend URL:

   ```
   VITE_API_URL=http://localhost:8000
   ```

4. Run the development server:
   ```
   npm run dev
   ```

## Running the Application

1. Start the backend server:

   ```
   cd Backend
   uvicorn app:main --reload
   ```

2. In a separate terminal, start the frontend server:

   ```
   cd Frontend
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:5173 (or the port shown in the terminal)
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Features

- User authentication (login/register)
- Mentor and mentee profiles
- Dashboard for users
- Admin panel

## Technologies Used

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Passlib and Bcrypt

### Frontend

- React
- Vite
- Tailwind CSS
- React Router

## Environment Variables

### Backend

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: For JWT token encryption
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time

### Frontend

- `VITE_API_URL`: Backend API URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
