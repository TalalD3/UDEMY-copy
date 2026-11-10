# MyEdu: Online Learning Platform

MyEdu is a full-stack e-learning web application (LMS). Teachers publish video courses organised into chapters, lessons and quizzes. Students enroll in courses, track their progress and leave reviews. Administrators manage the platform through a statistics dashboard.

This project was built as a **3rd-year Licence (Bachelor's) final project**.

| | |
|---|---|
| **University** | Ferhat Abbas University, Sétif 2 |
| **Department** | Department of Science |
| **Students** | Abdesselam Mohamed, Douibi Talal |
| **Academic year** | _2023 / 2024_ |

---

## Features

### Visitors and students
- Browse the catalogue, featured courses and categories, and search courses
- View a course page with its description, price, chapters and reviews
- Sign up and log in with JWT authentication; passwords are hashed with bcrypt
- Enroll in courses and see them under **My Courses**
- Watch lessons, with progress tracked per lesson and shown as a progress bar
- Take a timed quiz at the end of a chapter
- Rate and comment on courses; a course's rating is the average of its reviews
- Free preview chapters, viewable before enrolling

### Teachers
- Any user can become a teacher from their account
- Create a course: title, description, category, price and cover image
- Add, edit and delete chapters, each with video lessons and an optional quiz
- Upload images and videos, stored on Cloudinary
- Publish or unpublish a course

### Administrators
- Dashboard with totals (users, teachers, admins, courses, orders) and monthly charts
- Charts of orders per course and per category, and courses per category
- Manage courses: publish, unpublish or delete
- Manage users: change a user's role (user / teacher / admin)

---

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, React Router, Material UI, Ant Design, Recharts, ApexCharts, Framer Motion, Axios |
| Backend | Node.js, Express, Mongoose, JSON Web Token, bcrypt, Multer |
| Database | MongoDB (MongoDB Atlas or local) |
| Media storage | Cloudinary |

---

## Architecture

```
┌────────────────────────┐   HTTP / JSON   ┌────────────────────────┐      ┌─────────────┐
│  client (React + Vite) │ ──────────────▶ │   server (Express)     │ ───▶ │   MongoDB   │
│  localhost:5173        │ ◀────────────── │   localhost:5000       │      └─────────────┘
└────────────────────────┘                 └───────────┬────────────┘
                                                       │ media uploads
                                                       ▼
                                                ┌─────────────┐
                                                │  Cloudinary │
                                                └─────────────┘
```

### Data model

| Collection | Main fields |
|---|---|
| `users` | username, email, hashed password, role (`user` / `teacher` / `admin`), picture, bio, courses created, courses enrolled |
| `courses` | title, description, category, price, image, rating, creator, chapters, comments, published flag |
| `chapters` | title, free-preview flag, lessons (title + video URL), quiz |
| `quizzes` | time limit, questions with answer choices |
| `progresses` | completed lessons per user and course |
| `orders` | user, course and enrollment date |
| `comments` | user, course, comment text, rating |

---

## Project structure

```
MyEdu-full/
├── client/                 # React frontend (Vite)
│   ├── public/
│   └── src/
│       ├── Pages/          # Home, Courses, Course, WatchCourse, Search, MyCourses, Login, About, Cart
│       ├── component/      # Reusable UI: dashboard, forms, course cards, reviews, sidebar, etc.
│       ├── Context/        # ShopContext: global state (courses, user role, enrollment)
│       └── assets/
└── server/                 # Express REST API
    ├── index.js            # Models, routes and server start-up
    ├── config/db.js        # MongoDB connection
    └── middlewares/        # Error handler
```

---

## Getting started

### Prerequisites
- [Node.js](https://nodejs.org/) 18 or newer
- A MongoDB database: a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local MongoDB server
- A free [Cloudinary](https://cloudinary.com/) account for image and video uploads

### 1. Clone the repository
```bash
git clone https://github.com/mohamed-abdesselam/My-Edu.git
cd My-Edu
```

### 2. Configure environment variables
The `.env` files are not committed to the repository. Create them yourself.

`server/.env`
```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/MyEdu
# or, for a local database:
# MONGO_URI=mongodb://localhost:27017/MyEdu

CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# PORT=5000   (optional, defaults to 5000)
```

> Keep the database name (`/MyEdu`) at the end of `MONGO_URI`. Without it, MongoDB uses the empty `test` database and no courses appear.

`client/.env`
```env
VITE_REACT_APP_BACKEND_BASEURL=http://localhost:5000
VITE_REACT_APP_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
VITE_REACT_APP_CLOUDINARY_API_KEY=<your-api-key>
```

### 3. Start the backend
```bash
cd server
npm install
npm run dev        # with auto-reload (nodemon)
# or: npm start
```
When it starts correctly, you should see `Server started listening on port 5000` and `MongoDB connected: ...`.

### 4. Start the frontend
In a second terminal:
```bash
cd client
npm install
npm run dev
```
Open the URL that Vite prints, usually http://localhost:5173.

### 5. Create an admin account
1. Sign up through the app.
2. In MongoDB, set that user's `role` field to `"admin"`, using Atlas Data Explorer, MongoDB Compass or `mongosh`:
   ```js
   db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
   ```
3. Log in again. The admin dashboard is at `/admin/dashboard`.

---

## Main routes

### Frontend pages
| Path | Page |
|---|---|
| `/` | Home: hero, featured courses, categories, reviews |
| `/courses` | All courses |
| `/search` | Search courses |
| `/course/:courseId` | Course details |
| `/watchCourse/:courseId` | Course player: lessons, progress, quizzes |
| `/myCourses` | The user's enrolled and created courses |
| `/login` | Login and sign up |
| `/teacher/addCourse/:courseId` | Course editor (teacher) |
| `/teacher/addCourse/:courseId/chapters/:chapterId` | Chapter editor (teacher) |
| `/admin/dashboard` | Statistics dashboard (admin) |
| `/admin/managecourses` | Course management (admin) |
| `/admin/manageusers` | User management (admin) |

### REST API (selection)
Protected routes expect the JWT in an `auth-token` header.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/signup`, `/api/login` | Create an account and log in; both return a JWT |
| `GET` | `/api/publishedcourses` | All published courses |
| `GET` | `/api/courses/:courseId` | One course with its chapters |
| `POST` | `/api/addcourse` | Create a course (teacher) |
| `POST` | `/api/addchapterdetails` | Create or update a chapter, its lessons and quiz |
| `PUT` | `/api/change-publish/:courseId` | Publish or unpublish a course |
| `POST` | `/api/enroll-course` | Enroll the logged-in user in a course |
| `PUT` | `/api/progress/user/:userId/course/:courseId/chapters/:chapterId/lessons/:lessonId` | Mark a lesson as completed |
| `POST` | `/api/addComment` | Add or update a review |
| `GET` | `/api/countusers-per-month`, `/api/orders-per-category`, … | Dashboard statistics |
| `PUT` | `/api/change-role/:userId` | Change a user's role (admin) |
| `POST` | `/upload/images`, `/upload/video` | Upload media to Cloudinary |

---

## Possible improvements
- Add a real online payment step. Enrolling currently creates an order directly.
- Move the JWT signing secret into an environment variable.
- Split `server/index.js` into separate model, route and controller files.
- Add automated tests and deploy the app (for example, Vercel for the client and Render for the server).

---

## License
This project was developed for academic purposes as part of a university Licence degree.
