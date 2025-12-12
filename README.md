# Blogs Website - MERN Stack

A full-stack blog website built with MongoDB, Express, React, and Node.js.

## Project Structure

```
blogs-website/
├── backend/          # Node.js + Express API
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   └── server.js     # Entry point
└── Frontend/         # React + Vite frontend
    └── blogs-website/
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend folder:
   ```bash
   cd blogs-website/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB connection string
   - Change `JWT_SECRET` to a secure random string

4. Seed the database (creates admin user and sample blogs):
   ```bash
   node seed.js
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

The API will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd blogs-website/Frontend/blogs-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## Default Admin Credentials

- Email: `admin@mvhemanth.me`
- Password: `admin123`

## API Endpoints

### Public
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/featured` - Get featured blogs
- `GET /api/blogs/latest/:count` - Get latest blogs
- `GET /api/blogs/:slug` - Get blog by slug
- `POST /api/subscribers` - Subscribe to newsletter

### Protected (requires JWT token)
- `POST /api/blogs` - Create blog
- `PUT /api/blogs/:slug` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin
