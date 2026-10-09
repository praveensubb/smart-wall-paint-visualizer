# Smart Wall Paint Visualizer

## Project Structure
- `backend/`: Node.js, Express, MongoDB.
- `frontend/`: Angular 17+ standalone components, Canvas API.

## Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and set variables.
4. Run MongoDB locally or use Atlas.
5. Run `npm run seed` to seed admin user, colours, and patterns.
6. Run `npm run dev` to start the backend.

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start` to run locally at `http://localhost:4200`.

## API Documentation

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | Login |
| `/api/auth/me` | GET | Get current user |
| `/api/auth/favourites/colors/:id` | POST | Toggle favourite color |
| `/api/projects/upload` | POST | Upload an image for a new project |
| `/api/projects` | GET | Get all projects for current user |
| `/api/projects/:id` | GET | Get a specific project |
| `/api/projects/:id` | PUT | Update a project (save wall selections/rendered image) |
| `/api/projects/:id` | DELETE | Delete a project |
| `/api/colors` | GET | Get all colours |
| `/api/patterns` | GET | Get all patterns |
| `/api/admin/users` | GET | (Admin) Get all users |
| `/api/admin/designs` | GET | (Admin) Get all saved designs |
| `/api/admin/activity` | GET | (Admin) Get all activity logs |
| `/api/admin/stats` | GET | (Admin) Get KPI stats |

## Deployment Steps
1. **Backend**: Host on AWS or Render. Make sure to set `MONGO_URI` to a MongoDB Atlas cluster and `JWT_SECRET`.
2. **Frontend**: Build using `ng build`. Deploy the `dist` folder to Vercel or Netlify. Set the base API URL correctly in the environment configuration.
3. **Database**: Use MongoDB Atlas for production data storage.
