# Vulnerable JavaScript Training Application for GHAS

This project is designed for training purposes to demonstrate common web vulnerabilities, including Cross-Site Scripting (XSS), SQL Injection, and other security issues. 

## Project Structure

```
vulnerable-js-training
├── src
│   ├── app.js
│   ├── controllers
│   │   ├── authController.js
│   │   └── userController.js
│   ├── models
│   │   └── userModel.js
│   ├── routes
│   │   └── routes.js
│   ├── utils
│   │   └── database.js
│   └── views
│       ├── dashboard.html
│       ├── login.html
│       └── search.html
├── public
│   ├── css
│   │   └── styles.css
│   └── js
│       └── main.js
├── config.js
├── server.js
├── package.json
└── README.md
```

## Setup Instructions

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the required dependencies by running:
   ```
   npm install
   ```
4. Start the server with:
   ```
   node server.js
   ```
5. Open your browser and navigate to `http://localhost:3000` to access the application.

## Vulnerabilities Overview

- **Cross-Site Scripting (XSS)**: Several views (e.g., `dashboard.html`, `login.html`, `search.html`) may include unsanitized user input, allowing attackers to inject malicious scripts.
  
- **SQL Injection**: The `userModel.js` and `database.js` files contain unsafe query construction methods that can be exploited to manipulate database queries.

- **Improper Input Validation**: The `authController.js` may not adequately validate user input during authentication processes, leading to potential security breaches.

This application serves as a practical example for understanding and mitigating these vulnerabilities in real-world applications. Always ensure to follow best practices for security in production environments.
