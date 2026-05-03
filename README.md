# TaskManager

**TaskManager** is a web application for **project and task management**. It allows users to create projects, organize work in categories, assign members to tasks, and track progress in one place. The project is built as a full-stack app with an Angular frontend, Node.js/Express backend, and MongoDB database.

## Preview

### Main application view

<img width="1200" alt="taskmanager_main" src="https://github.com/user-attachments/assets/e9359524-3aec-45cb-8cfa-9137c95b16cc" />

## Live Demo

[Open live demo](https://taskmanager-demo.onrender.com/)

> [!NOTE]
> The live demo is hosted on Render's free tier, so the first request may take 15–60 seconds due to cold start.

## Tech Stack

- **Frontend:** Angular
- **Backend:** Node.js (Express)
- **Database:** MongoDB

## Main Implemented Features

- User registration and login
- JWT-based authentication and protected API routes
- Secure password storage (`bcrypt` hashing)
- Creating and deleting projects
- Project settings and member management
- Creating, editing, and deleting tasks
- Task categorization (create/edit/delete categories)
- Assigning team members to tasks
- Drag & drop tasks between categories
- Task filtering (e.g., show only assigned tasks)
- Basic UI internationalization


# Project Setup

## 1. Environment variables
1. Go to `/server` folder
2. Create a `.env` file by copying `.env.example`
3. Replace `<your-mongodb-connection-string>` in `.env`
with your [MongoDB URI](#how-to-get-mongodb-uri)

#### Example MongoDB URI
```
mongodb+srv://<username>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority
```
---

## 2. Install dependencies

Run this command from the **project root** (not `/server`):

```
npm run install-all
```

---

## 3. Run the project

Run this command from the **project root** (not `/server`):

```
npm start
```

---

## How to get MongoDB URI

You need to provide your own MongoDB connection string in `.env`.

If you don't have one:

- create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
- go to **Connect → Drivers**
- copy the connection string
- paste it into `.env`
- replace `<db_password>` with your password


> [!NOTE]  
> If you are having trouble with the SRV connection string, try disabling the **"SRV Connection String"** option and use a standard connection string (`mongodb://`) instead.
