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
- 🔹 Backend logic to manage interview sessions and code submissions  

---

## 🧩 Features

- Authentication and user session management  
- Live code editor for multiple languages  
- Role-based interfaces (admin / interviewer / interviewee)  
- Persistent data storage via MongoDB  

---

## 🛠️ Tech Stack

| Layer    | Technology                |
|----------|--------------------------|
| Frontend | React                     |
| Backend  | Node.js + Express         |
| Database | MongoDB                   |
| Others   | REST APIs, JWT Authentication |

---

## 📥 Prerequisites

- Node.js (v16 or newer recommended)  
- npm or yarn  
- MongoDB (local or hosted cluster)  

---

### 2. Install Dependencies

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

3. Create Environment Variables

Create a .env file inside the backend folder:

```bash
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

---

4. Run the Application

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

📘 Usage

1. Register or log in from the frontend UI
2. Create or join interview sessions
3. Use the online code editor to write and submit solutions

---

📦 Deployment

1. Host the frontend (e.g., Vercel, Netlify) and backend (e.g., Heroku, DigitalOcean)
2. Configure environment variables on your hosting platform
3. Follow build and deployment instructions per host documentation

---

🤝 Contributing

1. Fork the repository
2. Create a new branch (feature/your-feature)
3. Commit your changes
4. Open a Pull Request

Follow standard commit conventions and document significant changes.

---

📞 Contact

For bugs, suggestions, or support, create an issue or reach out to the maintainer on GitHub.
