# 🛍️ Full-Stack E-Commerce Website

A complete **e-commerce platform** with secure authentication, product management, and real-time updates.  
Built with **React.js + Tailwind CSS** (frontend) and **Node.js + MongoDB** (backend).  

## ✨ Features

- 🔑 **Authentication System**  
  - Secure login & registration  
  - Dedicated **Admin login**  

- 🛒 **User Features**  
  - Browse products  
  - Add items to **Cart** & **Favorites**  
  - Safe checkout & place orders  

- 📊 **Admin Panel**  
  - Manage products, users, and orders  
  - Add, update, delete products  
  - Real-time updates  

- 📂 **File Management**  
  - Product data exported to **Excel** using `xlsx`  
  - **Multer** used for image uploads  

---

## 🛠️ Tech Stack

**Frontend:** React.js, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Other Libraries:** Multer, xlsx  

---

## 📦 Installation & Setup

1. Clone the repository  
   ```bash
   git clone https://github.com/your-username/ecommerce-website.git
   cd ecommerce-frontend & backend
Install dependencies for both frontend & backend

# Frontend
cd ecommerce_frontend
npm install
npm run dev

# Backend
cd ecommerce_backend
npm install
npm node server.js
Configure environment variables
Create a .env file inside the server directory with:

env
Copy
Edit
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Run the application

📂 Project Structure
bash
Copy
Edit
ecommerce-website/
│── client/        # React.js + Tailwind frontend
│── server/        # Node.js + Express backend
│── models/        # MongoDB models
│── routes/        # API routes
│── uploads/       # Product images (via Multer)
│── exports/       # Excel files generated (via xlsx)

🚀 Future Improvements
Payment gateway integration

Product reviews & ratings

Email notifications for orders

Role-based access control

Add Google Auth for fast login
