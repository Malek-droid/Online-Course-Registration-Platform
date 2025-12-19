# Online Course Registration Platform

A simple and responsive web application for managing student registrations, built with React, Node.js, and SQLite.

## How to Run the Application

### Prerequisites
- Node.js (v14 or higher) installed on your machine.

### Installation
1. Open your terminal in the project root directory.
2. Install **Backend** dependencies:
   ```bash
   cd backend
   npm install
   cd ..
   ```
3. Install **Frontend** dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Running the App
To run the application, you will need **two separate terminal windows**.

**Terminal 1 (Backend):**
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Start the server:
   ```bash
   npm run dev
   ```
   (The server will start on `http://localhost:5000`)

**Terminal 2 (Frontend):**
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the React app:
   ```bash
   npm run dev
   ```
2. The application should automatically become available at the URL shown in your terminal (typically `http://localhost:5173`) and the backend API runs on `http://localhost:5000`.

## Assumptions Made
- **Database**: I chose **SQLite** for the database to provide a persistent, serverless, and zero-configuration storage solution that is easy to run locally without needing to install external database software like PostgreSQL or MongoDB.
- **Course Logic**: It is assumed that only the **"Advanced Maths"** course requires students to provide details about their "Previous Experience". This field is dynamically shown/hidden based on the course selection.
- **Concurrency**: The project assumes a development environment where it is convenient to run both client and server from a single terminal command for ease of use.

## Edge Cases Considered
- **Duplicate Emails**: The system enforces unique email addresses. If a user tries to register with an existing email, the backend rejects the request, and a specific error message is displayed to the user.
- **Accidental Deletion**:
    - A confirmation dialog ("Are you sure...") prevents accidental clicks on the delete button.
    - An **"Undo"** feature is available for a few seconds after deletion to restore the removed student immediately.
- **Form Validation**:
    - All fields are validated before submission.
    - Specific regex validation ensures the email format is correct.
    - Visual feedback (red borders, error text) is provided for invalid inputs.
- **Network/Server Errors**: The frontend gracefully handles connection failures (e.g., if the backend is down) by displaying user-friendly error messages instead of crashing.
- **Empty States**: A specific UI component is displayed when the student list is empty to guide the user to add their first student.
