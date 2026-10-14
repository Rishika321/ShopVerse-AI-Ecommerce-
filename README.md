\# 🛍️ ShopVerse



A full-stack \*\*MERN e-commerce platform\*\* featuring AI-powered product search, Razorpay payments in test mode, product reviews and ratings, wishlists, order tracking, and a dedicated admin dashboard for product and order management.



\## ✨ Features



\### 🛒 Customer Storefront



\- \*\*AI-Powered Product Search:\*\* Search for products using natural language with the Google Gemini API. For example, \*"Find a warm jacket under $50."\*

\- \*\*Secure Payments:\*\* Razorpay Orders API integration, hosted checkout modal, and server-side HMAC signature verification before marking payments as successful.

\- \*\*Product Reviews \& Ratings:\*\* Submit product reviews and ratings, with average ratings displayed on product pages.

\- \*\*Wishlist:\*\* Save products for later, independently of the shopping cart.

\- \*\*Shopping Cart \& Checkout:\*\* Manage cart items and proceed through the checkout flow.

\- \*\*Order History:\*\* View previous orders and their itemized details.

\- \*\*JWT Authentication:\*\* User signup and login with bcrypt-hashed passwords.

\- \*\*Toast Notifications:\*\* Receive feedback for cart actions, wishlist updates, and failed requests.



\### ⚙️ Admin Dashboard



\- \*\*Secure Admin Authentication:\*\* JWT-protected admin functionality.

\- \*\*Product Management:\*\* Add, edit, list, and remove products.

\- \*\*Cloudinary Integration:\*\* Upload and manage product images in cloud storage.

\- \*\*AI-Generated Product Descriptions:\*\* Generate descriptions for individual products or bulk-generate descriptions for products missing them.

\- \*\*Order Management:\*\* View customer orders and update their statuses.



\## 🧰 Tech Stack



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



\## 📁 Project Structure



```text

E-Commerce/

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

└── admin/

&#x20;   └── React + Vite admin dashboard

```



\- \*\*backend/\*\* — Express API, database models, authentication, AI integration, and payment processing.

\- \*\*frontend/\*\* — Customer-facing e-commerce storefront built with React.

\- \*\*admin/\*\* — Separate dashboard for managing products and orders.



\## 🚀 Getting Started



\### Prerequisites



Make sure you have the following:



\- \[Node.js](https://nodejs.org/) 18 or later

\- npm

\- A \[MongoDB Atlas](https://www.mongodb.com/atlas) cluster or local MongoDB instance

\- A \[Cloudinary](https://cloudinary.com/) account

\- A \[Google AI Studio](https://aistudio.google.com/) API key

\- \[Razorpay](https://dashboard.razorpay.com/) test-mode API keys



\### 1. Clone the Repository



Replace `<your-username>` with your GitHub username.



```bash

git clone https://github.com/<your-username>/ShopVerse-AI-Ecommerce.git

cd ShopVerse-AI-Ecommerce

```



\### 2. Install Dependencies



Run the following commands from the repository root:



```bash

cd backend

npm install



cd ../frontend

npm install



cd ../admin

npm install

```



\### 3. Configure Environment Variables



Create a `.env` file in each application directory using the following examples. Replace all placeholder values with your own credentials.



\#### Backend — `backend/.env`



```env

MONGO\_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/ecommerce?retryWrites=true\&w=majority



PORT=4000



\# CORS configuration

FRONTEND\_URL=http://localhost:3000

ADMIN\_URL=http://localhost:5173



\# Authentication

JWT\_SECRET=your\_long\_random\_secret

ADMIN\_USERNAME=your\_admin\_username

ADMIN\_PASSWORD=your\_strong\_admin\_password



\# Google Gemini API

GEMINI\_API\_KEY=your\_gemini\_api\_key



\# Razorpay test-mode credentials

RAZORPAY\_KEY\_ID=your\_razorpay\_test\_key\_id

RAZORPAY\_KEY\_SECRET=your\_razorpay\_test\_key\_secret



\# Cloudinary credentials

CLOUDINARY\_CLOUD\_NAME=your\_cloud\_name

CLOUDINARY\_API\_KEY=your\_api\_key

CLOUDINARY\_API\_SECRET=your\_api\_secret

```



\*\*Important:\*\* Include the database name `/ecommerce` in your MongoDB connection string, and URL-encode special characters in the database username or password when necessary.



Generate a secure JWT secret using:



```bash

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

```



\#### Frontend — `frontend/.env`



```env

REACT\_APP\_API\_URL=http://localhost:4000

```



\#### Admin Dashboard — `admin/.env`



```env

VITE\_API\_URL=http://localhost:4000

```



\*\*Security:\*\* Never commit actual `.env` files, API keys, database credentials, payment secrets, or production passwords to GitHub. Use placeholders in any committed `.env.example` files.



\### 4. Run the Applications



Open three separate terminals from the repository root.



\*\*Terminal 1 — Backend API\*\*



```bash

cd backend

node index.js

```



\*\*Terminal 2 — Customer Storefront\*\*



```bash

cd frontend

npm start

```



\*\*Terminal 3 — Admin Dashboard\*\*



```bash

cd admin

npm run dev

```



\### 5. Access the Applications



| Application | Local URL |

|---|---|

| Customer Storefront | http://localhost:3000 |

| Admin Dashboard | http://localhost:5173 |

| Backend API | http://localhost:4000 |



Ensure MongoDB is accessible and the required environment variables are configured before starting the applications.



\## 🔌 API Overview



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



\*Note: Verify endpoint names and HTTP methods against the current backend implementation before publishing this API reference.\*



\## 🩹 Troubleshooting



\### Products are missing from the admin dashboard



\- Check that `MONGO\_URI` points to the correct MongoDB cluster and database.

\- Ensure the database name, such as `/ecommerce`, is included in the connection string.

\- Verify that the application is querying the intended database and collection.



\### MongoDB authentication fails



\- Check the database username and password in MongoDB Atlas.

\- Verify that the database user has the required permissions.

\- URL-encode special characters in the connection string credentials.



\### Product images are broken



\- Verify that the Cloudinary credentials are correct.

\- Check that the image URLs stored in MongoDB are accessible.

\- Older products may reference local image URLs. Restore the required local image files and run the migration script, if supported by the current project, or upload the images again through the admin dashboard.



\### CORS errors occur



\- Ensure `FRONTEND\_URL` and `ADMIN\_URL` match the origins used by the running applications.

\- Check that the backend CORS configuration allows both frontend applications.



\### AI search or product descriptions fail



\- Confirm that `GEMINI\_API\_KEY` is configured correctly.

\- Verify that the selected Gemini model is available to your API key.

\- Check the backend logs for API errors or rate-limit responses.



\## 🗺️ Future Improvements



\- Product pagination and advanced filtering

\- Email order confirmations and notifications

\- Product variants, including size and colour

\- Inventory and stock management

\- Deployment documentation and production configuration

\- Automated testing for critical API and payment flows



\## 📄 License



This project is intended for learning, experimentation, and portfolio demonstration. No formal open-source license is specified. Add an appropriate license before permitting reuse or redistribution under specific terms.



\---



\*\*Built with React, Node.js, Express, MongoDB, and Google Gemini AI.\*\*

