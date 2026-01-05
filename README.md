# Course Platform - Frontend Client

## 📖 Overview

This is the **React** frontend application for the Online Course Platform assessment. It provides a modern user interface to interact with the .NET Web API, managing courses, lessons, and user authentication.

---

## 🛠️ Tech Stack

* **Core:** React 18 (via Vite)
* **Routing:** React Router DOM
* **Styling:** Bootstrap 5 & React-Bootstrap
* **HTTP Client:** Axios (with Interceptors for JWT)
* **State Management:** Context API (for Authentication)

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v16 or higher)
* npm (Node Package Manager)

### Installation

1.  Navigate to the project directory:
    ```bash
    cd Assessment-Front
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Configuration

The application is configured to connect to the backend at **port 5012**.
If you need to change the API URL, check `src/api/axiosConfig.js` or the `.env` file.

```javascript
// Default configuration in axiosConfig.js
baseURL: "http://localhost:5012/api"

### Running the App
Start the develpment server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173` (or the port shown in your terminal)

## 📄 License

MIT License

---

## 👤 Author

**Name:** Miguel Angel Angarita
**Project:** Assessment_M6 - Courses & Lessons Management System
**Date:** January 2026

---

> "Good code is like good espresso: concentrated, powerful, and best served hot." — J.A.R.V.I.S.
