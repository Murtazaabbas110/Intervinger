# Intervinger

![MERN](https://img.shields.io/badge/Stack-MERN-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Node](https://img.shields.io/badge/Node.js-16+-brightgreen)
![React](https://img.shields.io/badge/React-18+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-latest-success)

**A MERN‑stack interview platform with an online code editor** — designed to let users practice, host, and participate in technical interviews directly through a web interface.

---

## 🚀 Project Overview

Intervinger is a full‑stack web application built with the **MERN stack** (MongoDB, Express, React, Node.js). It provides:

- 🔹 A user-friendly interface to take technical interviews  
- 🔹 A real-time, in-browser **code editor**  
- 🔹 Video calling for live interviews using Stream API  
- 🔹 Backend logic to manage interview sessions and code submissions  

---

## 🧩 Features

- Authentication and user session management via **Clerk**  
- Live code editor for multiple languages  
- Role-based interfaces (admin / interviewer / interviewee)  
- Real-time video calling using **Stream API**  
- Persistent data storage via MongoDB  
- Beautiful UI built with **DaisyUI** and **Tailwind CSS**  

---

## 🛠️ Tech Stack

| Layer          | Technology                                      |
|----------------|------------------------------------------------|
| Frontend       | React, Tailwind CSS, DaisyUI                    |
| Backend        | Node.js + Express                               |
| Database       | MongoDB                                         |
| Authentication | Clerk                                           |
| Video          | Stream API                                      |
| Others         | Ingest API key for connecting Clerk, MongoDB, and Stream, REST APIs, JWT Authentication |

---

## 📥 Prerequisites

- Node.js (v16 or newer recommended)  
- npm or yarn  
- MongoDB (local or hosted cluster)  
- Clerk account and API key  
- Stream API key  

---

## 1. Install Dependencies

**Backend**
```bash
cd backend
npm install
```

**Frontend**
```bash
cd ../frontend
npm install
```

---

## 2. Create Environment Variables

Create a .env file inside the backend folder:
```bash
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
CLERK_API_KEY=<your_clerk_api_key>
STREAM_API_KEY=<your_stream_api_key>
```

---

## 3. Run the Application

**Backend**
```bash
cd backend
npm start
```

**Frontend**
```bash
cd frontend
npm start
```
The frontend will typically launch on http://localhost:3000 and the backend on http://localhost:5000.

---

## 📘 Usage

1. Register or log in using Clerk authentication

2. Create or join interview sessions

3. Use the online code editor to write and submit solutions

4. Start video calls with interview participants via Stream API

---

## 📦 Deployment

1. Host the frontend (e.g., Vercel, Netlify) and backend (e.g., Heroku, DigitalOcean)

2. Configure environment variables on your hosting platform

3. Follow build and deployment instructions per host documentation

---

## 🤝 Contributing

1. Fork the repository

2. Create a new branch (feature/your-feature)

3. Commit your changes

4. Open a Pull Request

Follow standard commit conventions and document significant changes.

---

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 📞 Contact

For bugs, suggestions, or support, create an issue or reach out to the maintainer on GitHub.
