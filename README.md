# Mess Meal Calculation System

A full-stack application for managing mess/hostel meal calculations, deposits, and expenses. This system digitizes the traditional paper-based or Excel-based mess management, providing real-time calculations of meal rates and individual balances.

## 🚀 Features

-   **Dashboard**: Overview of total meals, total cost, meal rate, and member balances.
-   **Member Management**: Add, view, and delete members.
-   **Daily Meals**: Track daily meal counts for each member.
-   **Deposits**: Manage member deposits and tracking.
-   **Cost Tracking**: Record bazar expenses and extra costs.
-   **Auto-Calculations**: Automatic calculation of meal rates and member balances.

## 🛠️ Tech Stack

-   **Backend**: ASP.NET Core Web API 9.0
-   **Frontend**: React (Vite) + TypeScript
-   **Database**: PostgreSQL
-   **ORM**: Entity Framework Core
-   **Styling**: Vanilla CSS (Custom UI)
-   **Icons**: Lucide React

## 📋 Prerequisites

-   [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
-   [Node.js](https://nodejs.org/) (v18+)
-   [PostgreSQL Server](https://www.postgresql.org/download/)
-   [pgAdmin 4](https://www.pgadmin.org/download/) (optional, for DB management)

## ⚙️ Setup & Installation

### 1. Database Setup
Update your connection string in `backend/appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=MessMealDb;Username=postgres;Password=YOUR_PASSWORD"
}
```

Then run migrations to create tables:
```bash
cd backend
dotnet ef database update
```

### 2. Run Backend
```bash
cd backend
dotnet run
```
The API will be available at `http://localhost:5121`.

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

## 📂 Project Structure

-   `/backend`: ASP.NET Core project
-   `/frontend`: React + Vite project
-   `.gitignore`: Git ignore rules
-   `README.md`: Project documentation
