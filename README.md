# 🛍️ ShopVerse

A full-stack **MERN e-commerce platform** featuring AI-powered product search, Razorpay payments in test mode, product reviews and ratings, wishlists, order tracking, and a dedicated admin dashboard for product and order management.

## ✨ Features

### 🛒 Customer Storefront

- **AI-Powered Product Search:** Search for products using natural language with the Google Gemini API. For example, "Find a warm jacket under $50."
- **Secure Payments:** Razorpay Orders API integration, hosted checkout modal, and server-side HMAC signature verification before marking payments as successful.
- **Product Reviews & Ratings:** Submit product reviews and ratings, with average ratings displayed on product pages.
- **Wishlist:** Save products for later, independently of the shopping cart.
- **Shopping Cart & Checkout:** Manage cart items and proceed through the checkout flow.
- **Order History:** View previous orders and their itemized details.
- **JWT Authentication:** User signup and login with bcrypt-hashed passwords.
- **Toast Notifications:** Receive feedback for cart actions, wishlist updates, and failed requests.

### ⚙️ Admin Dashboard

- **Secure Admin Authentication:** JWT-protected admin functionality.
- **Product Management:** Add, edit, list, and remove products.
- **Cloudinary Integration:** Upload and manage product images in cloud storage.
- **AI-Generated Product Descriptions:** Generate descriptions for individual products or bulk-generate descriptions for products missing them.
- **Order Management:** View customer orders and update their statuses.

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| Customer Storefront | React, React Router, Context API, react-toastify |
| Admin Dashboard | React, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| Image Storage | Cloudinary |
| AI Integration | Google Gemini API (`gemini-3.1-flash-lite`) |
| Payment Gateway | Razorpay (Test Mode) |

## 📁 Project Structure

```text
ShopVerse-AI-Ecommerce/
├── backend/
│   ├── index.js
│   ├── config/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   └── migrateImagesToCloudinary.js
├── frontend/
│   └── Customer-facing React application
├── admin/
│   └── React + Vite admin dashboard
├── .gitignore
└── README.md
```

- **backend/** — Express API, database models, authentication, AI integration, and payment processing.
- **frontend/** — Customer-facing e-commerce storefront built with React.
- **admin/** — Separate dashboard for managing products and orders.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following:

- [Node.js](https://nodejs.org/) 18 or later
- npm
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or local MongoDB instance
- A [Cloudinary](https://cloudinary.com/) account
- A [Google AI Studio](https://aistudio.google.com/) API key
- [Razorpay](https://dashboard.razorpay.com/) test-mode API keys

### 1. Clone the Repository

```bash
git clone https://github.com/Rishika321/ShopVerse-AI-Ecommerce-.git
cd ShopVerse-AI-Ecommerce-
```

### 2. Install Dependencies

Run the following commands from the repository root:

```bash
cd backend
npm install

cd ../frontend
npm install

cd ../admin
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in each application directory using the corresponding `.env.example` file. Replace all placeholder values with your own credentials.

#### Backend — `backend/.env`

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/ecommerce?retryWrites=true&w=majority

PORT=4000

# CORS configuration
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:5173

# Authentication
JWT_SECRET=your_long_random_secret
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_strong_admin_password

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Razorpay test-mode credentials
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```


To generate a secure JWT secret, run:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Frontend — `frontend/.env`

```env
REACT_APP_API_URL=http://localhost:4000
```

#### Admin Dashboard — `admin/.env`

```env
VITE_API_URL=http://localhost:4000
```

### 4. Run the Applications

Open three separate terminals from the repository root.

**Terminal 1 — Backend API**

```bash
cd backend
node index.js
```

**Terminal 2 — Customer Storefront**

```bash
cd frontend
npm start
```

**Terminal 3 — Admin Dashboard**

```bash
cd admin
npm run dev
```

### 5. Access the Applications

| Application | Local URL |
|---|---|
| Customer Storefront | http://localhost:3000 |
| Admin Dashboard | http://localhost:5173 |
| Backend API | http://localhost:4000 |

Ensure MongoDB is accessible and all required environment variables are configured before starting the applications.

> **Note:** Verify the port numbers, environment variable names, and start commands against the current project configuration before running the applications.

## 🔌 API Overview

The backend provides endpoints for authentication, product management, shopping cart operations, wishlists, reviews, orders, payments, and AI features.

| Area | Endpoints |
|---|---|
| Authentication | `POST /signup`, `POST /login`, `POST /admin/login` |
| Products | `GET /allproducts`, `GET /product/:id`, `GET /newcollections`, `GET /popularinwomen` |
| Product Management | `POST /upload`, `POST /addproduct`, `POST /updateproduct`, `POST /removeproduct` |
| Shopping Cart | `POST /addtocart`, `POST /removefromcart`, `POST /getcart` |
| Wishlist | `POST /addtowishlist`, `POST /removefromwishlist`, `POST /getwishlist` |
| Reviews | `GET /reviews/:productId`, `POST /addreview` |
| Customer Orders | `POST /createrazorpayorder`, `POST /verifyrazorpaypayment`, `GET /myorders` |
| Admin Orders | `GET /allorders`, `POST /updateorderstatus` |
| AI Features | `POST /aisearch`, `POST /generatedescription`, `POST /bulkgeneratedescriptions` |

*Note: Verify endpoint names and HTTP methods against the current backend implementation before relying on this API reference.*

## 🩹 Troubleshooting

### Products Are Missing from the Admin Dashboard

- Check that `MONGO_URI` points to the correct MongoDB cluster and database.
- Ensure the database name, such as `/ecommerce`, is included in the connection string.
- Verify that the application is querying the intended database and collection.

### MongoDB Authentication Fails

- Check the database username and password in MongoDB Atlas.
- Verify that the database user has the required permissions.
- URL-encode special characters in the connection string credentials.

### Product Images Are Broken

- Verify that the Cloudinary credentials are correct.
- Check that the image URLs stored in MongoDB are accessible.
- Older products may reference local image URLs. Restore the required local image files and run the migration script if supported by the current project, or upload the images again through the admin dashboard.

### CORS Errors Occur

- Ensure `FRONTEND_URL` and `ADMIN_URL` match the origins used by the running applications.
- Check that the backend CORS configuration allows both frontend applications.

### AI Search or Product Descriptions Fail

- Confirm that `GEMINI_API_KEY` is configured correctly.
- Verify that the selected Gemini model is available to your API key.
- Check the backend logs for API errors or rate-limit responses.

## 🗺️ Future Improvements

- Product pagination and advanced filtering
- Email order confirmations and notifications
- Product variants, including size and colour
- Inventory and stock management
- Deployment documentation and production configuration
- Automated testing for critical API and payment flows


**Built with React, Node.js, Express, MongoDB, and Google Gemini AI.**
