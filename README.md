# Blogging Platform

A full-stack blogging platform built with React, Node.js, Express, and MongoDB. Features user authentication, profile management with face detection, blog post creation and management, comments, and admin functionality.

## Features

### User Management
- User registration and authentication with JWT
- Profile management with automatic face detection for profile pictures
- Password hashing with bcrypt
- Admin user roles

### Blog Functionality
- Create, read, update, and delete blog posts
- Rich text editing for posts
- Comment system on posts
- Category-based organization
- Image upload support via Cloudinary

### Security & Performance
- JWT-based authentication
- Protected routes and middleware
- Input validation and error handling
- Responsive design with Tailwind CSS

### Additional Features
- Face detection using face-api.js for profile picture validation
- Real-time feedback during image uploads
- Admin dashboard for content management
- Search and filtering capabilities

## Tech Stack

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **face-api.js** - Face detection library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **Cloudinary** - Image hosting and management

### Development Tools
- **Vite** - Frontend build tool
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Git

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd blogging-platform
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables:**

   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/blogging-platform
   JWT_SECRET=your-super-secret-jwt-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

5. **Start MongoDB:**
   Make sure MongoDB is running on your system or update the `MONGO_URI` to point to your cloud database.

## Usage

### Development

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   The server will start on `http://localhost:5000`

2. **Start the frontend development server:**
   ```bash
   cd frontend
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

### Production

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend in production:**
   ```bash
   cd backend
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Authenticate user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `GET /api/posts/user/:userId` - Get posts by user

### Comments
- `GET /api/posts/:postId/comments` - Get comments for a post
- `POST /api/posts/:postId/comments` - Add comment to post (protected)
- `PUT /api/comments/:id` - Update comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

## Project Structure

```
blogging-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── postController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   └── uploadMiddleware.js
│   │   ├── models/
│   │   │   ├── Comment.js
│   │   │   ├── Post.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── postRoutes.js
│   │   │   └── userRoutes.js
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── CommentsSection.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Header.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── CategoriesPage.jsx
│   │   │   ├── CreatePostPage.jsx
│   │   │   ├── EditProfilePage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── PostPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   │   ├── postSlice.js
│   │   │   │   ├── postsSlice.js
│   │   │   │   └── userSlice.js
│   │   │   └── store.js
│   │   ├── utils/
│   │   │   └── faceDetection.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── App.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package-lock.json
├── README.md
└── package.json
```

## Environment Variables

### Backend (.env)
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Manual Testing Checklist
- User registration and login
- Profile picture upload with face detection
- Creating and editing blog posts
- Adding comments to posts
- Admin dashboard functionality
- Responsive design on mobile devices

## Deployment

### Backend Deployment
1. Set up a cloud database (MongoDB Atlas)
2. Configure Cloudinary for image uploads
3. Set environment variables on your hosting platform
4. Deploy to services like Heroku, DigitalOcean, or AWS

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to static hosting services like Vercel, Netlify, or GitHub Pages
3. Configure API base URL for production

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Express.js](https://expressjs.com/) - Fast, unopinionated, minimalist web framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [face-api.js](https://github.com/justadudewhohacks/face-api.js/) - JavaScript API for face detection
- [Cloudinary](https://cloudinary.com/) - Image and video management platform

## Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

**Note:** This is a development project. Make sure to follow security best practices when deploying to production, including proper environment variable management, input validation, and regular security updates.
