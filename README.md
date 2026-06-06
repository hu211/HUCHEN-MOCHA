# Mocha - Speciality Matcha Bar

A modern Web Application (Single Page Application) developed for the Web Programming Methodology course. **Mocha** is an online store for a specialty matcha and coffee bar, featuring a fully functional shopping cart, a loyalty points system ("Matcha Points"), and a comprehensive admin dashboard.

## Architecture: Hybrid SPA
This project utilizes a **Hybrid Single Page Application** approach to provide both security and a seamless user experience:
- **Server-Side Bootstrapping:** The server uses **EJS** to render the initial application shell and provide a secure baseline.
- **Client-Side Routing:** Once loaded, **page.js** takes over the routing, dynamically fetching data via the **Fetch API** and rendering ES6 JS templates without reloading the page.

## Tech Stack

**Frontend**
* **Vanilla JavaScript:** ES6 Modules, Classes, and asynchronous functions (`async/await`).
* **Routing:** `page.js` for client-side navigation.
* **Styling:** Bootstrap 5, Bootstrap Icons, and Custom CSS (No inline styles).
* **State Management:** `localStorage` for cart persistence.

**Backend**
* **Server:** Node.js with Express.js.
* **Templating:** EJS (Embedded JavaScript templates).
* **Database:** SQLite (`sqlite3` module) with full CRUD operations.
* **Authentication:** `Passport.js` (Local Strategy) and `express-session` for secure user login and role management.

## Key Features

### For Customers (Mochers)
* **Interactive Menu:** Browse products, view details, and search by name or description.
* **Shopping Cart:** Add, remove, and adjust quantities of items. Prevents adding items beyond available stock.
* **Checkout & Rewards:** Complete purchases to earn **Matcha Points** (automatically saved to the database).
* **User Profile:** View accumulated points, current loyalty tier, and access exclusive rewards.

### For Administrators
* **Admin Dashboard:** Real-time overview of total products, pending orders, and total orders.
* **Inventory Management:** Add new products, edit existing ones, and delete discontinued items (CRUD).
* **Order Management:** View recent customer orders and mark pending orders as completed.

## Installation & Setup

1. **Clone or download** this repository to your local machine.
2. Open a terminal in the root directory of the project.
3. **Install the required dependencies:**
   ```bash
   npm install
4. **Start the server**
    node server.js
5. **Access the application** Open your browser and navigate to http://localhost:3000

## Test Credentials

A pre-populated SQLite database (database.sqlite) is included for testing purposes. You can log in usign the following accounts:

### Administratos Account

* **Email:** cristina.hu@example.com
* **Password:** password123

### Standard User Account (Mocher)

* **Email:** john.doe@example.com
* **Password:** password456
