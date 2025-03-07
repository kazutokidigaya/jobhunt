# JobHunt – A Full-Stack Job Board with Resume Parsing

Welcome to **Job Huntl** , a full‑stack HR job board built with the MERN stack. In JobHunt, recruiters can post jobs while candidates can browse listings and apply by uploading their resumes. When a candidate applies, the resume is parsed using a third‑party AI API (e.g. Groq API) to extract key details—such as skills and total years of experience—which are then displayed on the recruiter’s dashboard for quick evaluation.

[Live Demo](https://jobs-horizon.vercel.app)

## Features

- **Job Posting & Management:**

  - Recruiters can create, update, and delete job postings.
  - Job listings include details such as title, description, salary, location, job type, and required experience level.

- **Candidate Application:**

  - Candidates can browse job listings and apply.
  - Each candidate’s profile contains their resume (uploaded once) and other personal details.
  - When applying, the resume data (including a parsed version) is automatically attached to the application.

- **Resume Parsing & Extraction:**

  - Resumes are uploaded and processed using pdf‑parse (debugging‑disabled) to extract raw text.
  - The parsed text is sent to the Groq API with a custom prompt to extract key details (e.g. total years of experience and skills) in JSON format.
  - Extracted data is stored and later displayed on the recruiter’s dashboard for fast, structured candidate evaluation.

- **Recruiter Dashboard:**
  - View and manage job postings and candidate applications.
  - For each candidate application, view basic details along with a hover‑card (“@info”) that shows the extracted resume information (total experience and skills).

## Installation & Setup

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/kazutokidigaya/jobhunt.git
cd jobhunt
```

### 2. Environment Variables

Create a .env file in the root of the backend directory and add the following (replace values as needed):

```bash
PORT=5000
MONGODB_URI="YOUR_MONGO_URL"
CLOUDINARY_CLOUD_NAME="YOUR_CLOUDINARY_CLOUD_NAME"
CLOUDINARY_API_KEY="YOUR_CLOUDINARY_API_KEY"
CLOUDINARY_API_SECRET="YOUR_CLOUDINARY_API_SECRET"
SECRET_KEY="YOUR_SECRET_KEY"
GROQ_API_KEY="YOUR_GROQ_API_KEY"
ORIGIN_URL=http://localhost:5173

```

Note: In your Vite frontend, remember to prefix environment variables with VITE\_. For example:

```bash
VITE_BASE_API=http://localhost:5000
```

### 3. Install Dependencies

For the Frontend
Navigate to the frontend folder (if separated) and install dependencies:

```bash
cd frontend
npm install
```

For the Backend
Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

### 4. Start the Development Servers

Frontend
Run the Vite development server:

```bash
npm run dev
```

Backend
Run the backend server:

```bash
npm run start
```
