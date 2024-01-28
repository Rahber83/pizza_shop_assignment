# Starting instruction for pizza-Shop-frontend

This is the frontend application for a Pizza Shop built using React. The application allows users to place orders, view the status of their orders, and cancel orders if needed.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

2. Change to the project directory:

   ```bash
   cd pizza-shop-frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Features

- **Place Order:** Users can place a pizza order by selecting the restaurant, type, size, and base.
- **Order Status:** View the status of each order, including time elapsed since order placement.
- **Cancel Order:** Cancel orders that are in the "Order Placed" or "Order In Making" stages.
- **Sorting:** Sort orders by delay, which considers the current order status and time of placement.

Run the development server:

```bash
npm start
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).




# Starting instruction for pizza-backend

This is the backend application for a Pizza Shop built using Node.js and MongoDB. The backend provides RESTful APIs for managing pizza orders and related functionalities.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. Clone the repository:

2. Change to the project directory:

   ```bash
   cd pizza-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your MongoDB connection string:

   ```env
   DB_STRING=mongodb://localhost:27017/pizza-shop
   ```

install the mongoDB compass for DB connection and put the DB_STRING URI into the URI box and click to connect.
![image](https://github.com/Rahber83/pizza_shop_assignment/assets/119001786/c020f5e1-3d70-4161-aec4-59d4d841b897)


After connecting with the DB create a new collection with name restaurants and insert the restaurant.json which is in the repository with the same file name.
![image](https://github.com/Rahber83/pizza_shop_assignment/assets/119001786/8b97451c-f70b-4fbe-8508-65784960ad39)

### Usage

Run the server:

```bash
npm start
```

The server will be running at [http://localhost:5001](http://localhost:5000).

