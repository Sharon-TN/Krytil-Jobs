# 💼 Krytil Jobs - Job Portal

**Krytil Jobs** is a comprehensive, full-stack job portal platform that connects job seekers with recruiters. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), this platform provides a seamless experience for both job hunters and companies looking to hire talent.

---

## 🎯 Project Overview

**Krytil Jobs** is a production-ready job portal that streamlines the recruitment process. It allows job seekers to search, discover, and apply for jobs while providing recruiters with powerful tools to post job openings, manage applications, and track candidates. The platform is built with scalability, security, and user experience in mind.

**Live Demo:** [Visit Krytil Jobs](https://job-nest-client-coral.vercel.app/)

---

## ✨ Key Features

### 👤 Job Seeker Features
- **User Authentication**: Secure login/signup with Clerk authentication
- **Job Discovery**: Browse and search through job listings with detailed filters
- **Advanced Filtering**: Filter jobs by:
  - Job Category
  - Location
  - Experience Level
  - Salary Range
- **Job Application**: Apply to jobs with one click
- **Application Tracking**: Track the status of all your job applications (Pending, Accepted, Rejected)
- **Profile Management**: Create and manage your professional profile
- **Resume Management**: Upload and manage resume documents
- **Application History**: View all submitted applications in one place
- **Responsive Design**: Seamless experience across all devices

### 🧑‍💼 Recruiter/Company Features
- **Recruiter Dashboard**: Dedicated dashboard for managing all recruitment activities
- **Job Posting**: Create new job listings with detailed descriptions using rich text editor
- **Job Management**: 
  - Edit existing job listings
  - Delete job postings
  - Toggle job visibility (active/inactive)
  - Manage multiple job openings
- **Application Management**: 
  - View all applications received for jobs
  - Accept or reject applications
  - Track application status
- **Candidate Profiles**: View detailed profiles of job applicants
- **Resume Download**: Download and review candidate resumes directly
- **Application Analytics**: Track application trends and status

### ⚙️ Platform Features
- **Secure Authentication**: 
  - Clerk integration for robust user authentication
  - JWT token-based session management
  - Company/Recruiter specific authentication
- **File Management**: 
  - Resume upload and storage via Cloudinary
  - Secure file handling with multer
  - File validation and optimization
- **Real-time Monitoring**: 
  - Sentry integration for error tracking
  - Performance monitoring
  - Application health checks
- **Database Optimization**:
  - MongoDB with optimized indexes for fast queries
  - Efficient data relationships and references
  - Unique constraints on job applications (prevent duplicate applications)
- **API Security**:
  - Rate limiting to prevent abuse
  - Helmet.js for HTTP security headers
  - CORS protection
  - Request validation and sanitization
- **Error Handling**: Comprehensive error handling middleware
- **Response Compression**: GZIP compression for optimized performance
- **Responsive UI**: Beautiful, mobile-first design with Tailwind CSS

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| **Frontend Framework** | React.js 18.3 |
| **Frontend Routing** | React Router v7 |
| **Backend Framework** | Node.js + Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | Clerk |
| **File Upload** | Multer + Cloudinary |
| **Styling** | Tailwind CSS + PostCSS |
| **Rich Text Editor** | Quill.js |
| **HTTP Client** | Axios |
| **UI Components** | React Icons, Framer Motion |
| **Notifications** | React Toastify |
| **Security** | Helmet.js, bcrypt, JWT |
| **Monitoring** | Sentry |
| **Build Tool** | Vite |
| **Code Quality** | ESLint |
| **Date Utilities** | Moment.js |

---

## 📁 Project Structure

```
Krytil-Jobs/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── AppDownload.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobListing.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── MouseTracker.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── RecruiterLogin.jsx
│   │   │   └── SignUpRedirect.jsx
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── ApplyJob.jsx         # Job application page
│   │   │   ├── Applications.jsx     # User's applications list
│   │   │   ├── ProfileSettings.jsx  # User profile management
│   │   │   ├── ResumeUpload.jsx     # Resume upload
│   │   │   ├── Dashboard.jsx        # Recruiter dashboard
│   │   │   ├── AddJob.jsx           # Create new job
│   │   │   ├── ManageJobs.jsx       # Edit/manage jobs
│   │   │   └── ViewApplications.jsx # View job applications
│   │   ├── context/                 # React Context (Global state)
│   │   │   └── AppContext.jsx       # Shared app state
│   │   ├── assets/                  # Images and static files
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # App entry point
│   │   └── index.css                # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── eslint.config.js
│
├── server/                          # Node.js/Express Backend
│   ├── config/                      # Configuration files
│   │   ├── db.js                    # MongoDB connection
│   │   ├── cloudinary.js            # Cloudinary setup
│   │   ├── multer.js                # File upload configuration
│   │   └── instrument.js            # Sentry configuration
│   ├── models/                      # Database models
│   │   ├── User.js                  # User schema
│   │   ├── Company.js               # Company/Recruiter schema
│   │   ├── Job.js                   # Job posting schema
│   │   └── JobApplication.js        # Job application schema
│   ├── controllers/                 # Business logic
│   │   ├── userController.js        # User operations
│   │   ├── companyController.js     # Company operations
│   │   ├── jobController.js         # Job management
│   │   └── webhooks.js              # Clerk webhook handlers
│   ├── routes/                      # API routes
│   │   ├── userRoutes.js            # User endpoints
│   │   ├── companyRoutes.js         # Company endpoints
│   │   └── jobRoutes.js             # Job endpoints
│   ├── middleware/                  # Middleware functions
│   │   ├── authMiddleware.js        # Authentication checks
│   │   └── errorHandler.js          # Error handling
│   ├── utils/                       # Utility functions
│   │   └── generateToken.js         # JWT token generation
│   ├── temp/                        # Temporary files directory
│   ├── server.js                    # Main server file
│   └── package.json
│
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (Local installation or MongoDB Atlas cloud account)
- **Clerk** account (Sign up at [clerk.com](https://clerk.com))
- **Cloudinary** account (for file uploads)
- **Sentry** account (optional, for monitoring)

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Krytil-Jobs.git
cd Krytil-Jobs
```

#### 2. Setup Backend (Server)
```bash
cd server

# Install dependencies
npm install

# Create .env file in server directory
# Add the following environment variables:
# MONGODB_URI=your_mongodb_connection_string
# CLERK_SECRET_KEY=your_clerk_secret_key
# CLOUDINARY_API_KEY=your_cloudinary_api_key
# CLOUDINARY_API_SECRET=your_cloudinary_api_secret
# CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
# SENTRY_DSN=your_sentry_dsn (optional)
# PORT=5000

# Start the server
npm run dev
```

#### 3. Setup Frontend (Client)
```bash
cd ../client

# Install dependencies
npm install

# Create .env.local file in client directory
# VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
# VITE_API_URL=http://localhost:5000

# Start the development server
npm run dev
```

---

## 📋 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/krytil-jobs
# or MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/krytil-jobs

CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
VITE_API_URL=http://localhost:5000
```

---

## 🔌 API Endpoints

### User Routes (`/api/users`)
- **POST** `/register` - Register a new user
- **POST** `/login` - Login user
- **GET** `/profile/:id` - Get user profile
- **PUT** `/profile/:id` - Update user profile
- **POST** `/upload-resume` - Upload resume
- **GET** `/applications` - Get user's job applications

### Company Routes (`/api/companies`)
- **POST** `/register` - Register company/recruiter
- **POST** `/login` - Company login
- **GET** `/profile/:id` - Get company profile
- **PUT** `/profile/:id` - Update company profile
- **GET** `/dashboard` - Get company dashboard data
- **GET** `/applications` - Get all applications for company's jobs

### Job Routes (`/api/jobs`)
- **GET** `/` - Get all visible jobs with filters
- **GET** `/:id` - Get job details
- **POST** `/` - Create new job (recruiter only)
- **PUT** `/:id` - Update job (recruiter only)
- **DELETE** `/:id` - Delete job (recruiter only)
- **POST** `/:id/apply` - Apply for a job
- **GET** `/:id/applications` - Get applications for a job

---

## 🎯 Core Functionality

### Job Seeker Workflow
1. **Sign Up / Log In** - Register via Clerk or login
2. **Browse Jobs** - Explore job listings on the home page
3. **Search & Filter** - Find jobs by category, location, level, and salary
4. **View Details** - Click on a job card to see full details
5. **Apply** - Submit application with optional resume upload
6. **Track Status** - Monitor application status in the Applications page
7. **Manage Profile** - Update profile and manage resumes

### Recruiter Workflow
1. **Company Sign Up** - Register as a company/recruiter
2. **Access Dashboard** - Login to recruiter dashboard
3. **Post Jobs** - Create new job listings with detailed descriptions
4. **Manage Listings** - Edit, update, or delete job postings
5. **Review Applications** - View all received applications
6. **Manage Candidates** - Accept or reject applications
7. **Download Resumes** - Download and review candidate resumes

---

## 🔐 Security Features

- **Clerk Authentication**: Enterprise-grade authentication and user management
- **JWT Tokens**: Secure session management with JWT tokens
- **Password Hashing**: bcrypt for secure password storage
- **Helmet.js**: HTTP security headers protection
- **Rate Limiting**: Express rate limit to prevent brute-force attacks
- **CORS**: Cross-Origin Resource Sharing protection
- **Input Validation**: Server-side validation of all inputs
- **File Security**: Secure file upload handling with multer and Cloudinary
- **MongoDB Indexes**: Unique constraints to prevent duplicate applications

---

## 📊 Database Schema

### User Model
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  resume: String (URL),
  clerkId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Company Model
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  logo: String (URL),
  description: String,
  website: String,
  location: String,
  clerkId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Job Model
```
{
  _id: ObjectId,
  title: String,
  description: String (Rich text),
  location: String,
  category: String,
  level: String (Junior/Mid/Senior),
  salary: Number,
  date: Number (timestamp),
  visible: Boolean,
  companyId: ObjectId (ref: Company),
  createdAt: Date,
  updatedAt: Date
}
```

### JobApplication Model
```
{
  _id: ObjectId,
  userId: String,
  jobId: ObjectId (ref: Job),
  companyId: ObjectId (ref: Company),
  status: String (Pending/Accepted/Rejected),
  date: Number (timestamp),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚢 Deployment

### Deploy Backend to Vercel
1. Create a Vercel account
2. Connect your GitHub repository
3. Add environment variables in Vercel project settings
4. Deploy the server folder as a serverless function

### Deploy Frontend to Vercel
1. Configure `vercel.json` in client folder
2. Push to GitHub
3. Vercel will auto-deploy on every push
4. Update API URLs to production backend

### MongoDB Atlas Setup
1. Create free cluster on MongoDB Atlas
2. Get connection string
3. Use in `MONGODB_URI` environment variable

---

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm run lint          # Run ESLint
npm run build         # Build for production
npm run preview       # Preview production build
```

### Backend Testing
```bash
cd server
npm run dev           # Run with nodemon for development
npm start             # Run production server
```

---

## 📱 Features Highlights

### Search & Filter
- Search jobs by title, location, company
- Filter by category, experience level, and salary range
- Real-time filtering with no page reload

### Job Application Management
- One-click job application
- Prevents duplicate applications (unique constraint)
- Track application status across multiple jobs
- Download recruiter feedback

### Rich Job Descriptions
- Job descriptions support rich text formatting (bold, italic, lists, etc.)
- Beautiful rendering of formatted content
- Support for detailed job requirements and responsibilities

### Responsive Design
- Mobile-first approach
- Works seamlessly on desktop, tablet, and mobile
- Touch-friendly interface
- Fast loading times with optimized images

### Performance Optimization
- Database indexes for fast queries
- Response compression (GZIP)
- Lazy loading of components
- Optimized images and assets
- Efficient API calls with axios

---

## 🤝 Contributing

Contributions are welcome! To contribute:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 👥 Author

- **Sharon-T-N** - Project Creator and Maintainer

---

## 📞 Support & Contact

For questions, issues, or suggestions:
- Open an issue on GitHub
- Contact via email
- Check the documentation

---

## 🙏 Acknowledgments

- **Clerk** for secure authentication
- **MongoDB** for reliable database
- **Cloudinary** for file storage
- **Sentry** for error monitoring
- **React** and **Express** communities

---

## 🔄 Versioning

- **Current Version**: 1.0.0
- **Status**: Production Ready
- **Last Updated**: March 2024

---

## 📈 Roadmap

### Future Enhancements
- [ ] Advanced search with AI recommendations
- [ ] In-app messaging between recruiters and candidates
- [ ] Email notifications for application status
- [ ] Job saved/bookmarks feature
- [ ] Company reviews and ratings
- [ ] Multiple file resume support
- [ ] Interview scheduling system
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Video resume support

---

## 🐛 Known Issues

- None currently reported

---

**Built with ❤️ for connecting talent with opportunity.**