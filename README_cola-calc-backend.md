
# 🧠 Cola-Calc Backend (SipSense API)

This is the backend server for **SipSense**, a smart health-tracking app focused on monitoring users' cola consumption habits. Built with **TypeScript + Express**, it provides RESTful APIs for user management, cola intake logging, reminder notifications, and chatbot feedback. The server runs on **AWS EC2**, uses **Prisma ORM** for PostgreSQL database management, and is secured with **JWT authentication**.

---

## 🚀 Features

- 🔐 **Authentication**: Secure user signup and login with hashed passwords and JWT tokens.
- 🥤 **Cola Intake API**: Create and fetch daily cola consumption logs.
- 📈 **Analytics & Stats**: Track user progress and send personalized chatbot messages.
- ⏰ **Scheduled Tasks**: Cron jobs to trigger inactivity reminders.
- 🧰 **Environment-based Configuration**: via `.env` for secure deployment.
- 🐘 **PostgreSQL + Prisma ORM**: Type-safe DB access layer.
- ☁️ **EC2 + NGINX**: Deployed and reverse-proxied for HTTPS access.

---

## 🛠️ Tech Stack

| Layer        | Tech                             |
|--------------|----------------------------------|
| Language     | TypeScript                       |
| Framework    | Express.js                       |
| ORM          | Prisma                           |
| DB           | PostgreSQL                       |
| Auth         | bcrypt + JWT                     |
| Scheduler    | node-cron                        |
| Dev Tools    | ts-node-dev, dotenv              |
| Hosting      | AWS EC2(Amazon Linux 2, ec2-user)|
| Reverse Proxy| NGINX                            |

---

## 📁 Project Structure

```
cola-calc-backend/
├── prisma/                 # Prisma schema & migrations
│   └── migrations/
│   └── schema.prisma
├── src/
│   ├── routes/             # Express route definitions
│   ├── middleware/         # Auth middleware
│   ├── cron/               # Scheduled cron job(inactivity reminder in 3 hrs)
│   └── index.ts            # Main server entry point
├── .env                    # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧪 Getting Started (Local Dev)

```bash
# 1. Clone the repo
git clone https://github.com/Raina-Moon/cola-calc-backend.git
cd cola-calc-backend

# 2. Install dependencies
npm install

# 3. Set up the DB with Prisma
npx prisma migrate dev

# 4. Start dev server
npm run dev
```

---

## 📦 Build & Deploy

```bash
# Build
npm run build

# Start in production
npm start
```

### Deployment Notes

- EC2: Amazon Linux 2 instance(ec2-user) with Node.js and PostgreSQL installed
- NGINX: Proxy incoming HTTPS requests to port `5000`

---

## 🔐 API Authentication

All protected routes require a `Bearer` token in the `Authorization` header.

```http
Authorization: Bearer <access_token>
```

---

## 📬 Endpoints

| Method | Endpoint                 | Description                             |
|--------|--------------------------|-----------------------------------------|
| POST   | `/user`                  | Create a new user                       |
| POST   | `/auth/login`            | Authenticate user                       |
| POST   | `/auth/refresh`          | Refresh access token using refresh token|
| POST   | `/cola`                  | Log cola intake                         |
| GET    | `/cola/daily`            | Fetch daily’s logs                      |
| GET    | `/cola/monthly`          | Fetch monthly’s logs                    |
| GET    | `/cola/yearly`           | Fetch yearly’s logs                     |
| PATCH  | `/user/:id`              | Update user info                        |
| PATCH  | `/user/:id/active`       | Update user active for notification     |
| PATCH  | `/user/:id/notification` | Update user notification                |
| GET    | `/notification.:id`      | Get all notifications                   |
| POST   | `/notification`          | Create a notification                   |
| PATCH  | `/notification/read/:id` | Mark notification as read               |

---

## 👩‍💻 Author

**Raina Moon**  
[https://raina-moon.com](https://raina-moon.com)

---

## 📄 License

MIT License
