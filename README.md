# 🛍️ React Store App (Vite + Tailwind + Mock API)

This is a fully responsive e-commerce web application built using **React.js** with **Vite** and styled using **Tailwind CSS**. It simulates an online shopping experience, allowing users to browse products, manage a shopping cart, and log in with **dummy user accounts**. Product data is fetched from the **[Fake Store API](https://fakestoreapi.com/)**.

---

## 🚀 Features

- ⚛️ Built with **Vite + React.js**
- 💨 Styled with **Tailwind CSS**
- 🧭 Routing via **React Router DOM**
- 🛒 **Shopping Cart** functionality:
  - Add to cart
  - Update quantity
  - Remove items
- 📱 **Responsive Design** (mobile-first)
- 🔐 **Mock Authentication**:
  - Use dummy credentials or create your own user (in-memory)
- 📡 **Mock API Integration** with [Fake Store API](https://fakestoreapi.com/)
- ⚠️ No backend: Fully frontend-only application

---

## 🔒 Authentication Notes

- Multiple dummy users are available for login.
- You can also create a new user manually.
- No real authentication or persistent login — all data is stored temporarily in the app's state and resets on refresh.

---

## 🧰 Tech Stack

- **React.js** (with Vite)
- **Tailwind CSS** for styling
- **React Router DOM** for routing
- **Fake Store API** for product data
- **Local State / Context API** for managing cart and users

---

## 📦 Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the repository

```bash

git clone https://github.com/your-username/react-store-app.git
cd react-store-app

2. Install dependencies
npm install

3. Start the development server
npm install

4. After starting, the app will be available at:
http://localhost:5173

5. Dummy User Login
email - admin@xyz.com
password - 12345678