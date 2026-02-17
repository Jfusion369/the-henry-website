# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Browser)                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  HTML/CSS/JavaScript                                       │ │
│  │  ├─ Contact Form  ──┐                                      │ │
│  │  └─ Newsletter Form ├──> Fetch API Call (JSON)            │ │
│  │                     └──> HTTP POST to Backend              │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    HTTP/CORS Bridge
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    BACKEND SERVER (Node.js)                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Express.js Server (Port 3000)                             │ │
│  │  ├─ Middleware                                             │ │
│  │  │  ├─ CORS                                               │ │
│  │  │  ├─ Helmet (Security)                                 │ │
│  │  │  └─ Body Parser                                       │ │
│  │  │                                                        │ │
│  │  ├─ Routes                                                │ │
│  │  │  ├─ POST /api/contact                                │ │
│  │  │  │  ├─ Validate Input                                │ │
│  │  │  │  ├─ Save to Database                              │ │
│  │  │  │  └─ Send Emails                                   │ │
│  │  │  │                                                    │ │
│  │  │  └─ POST /api/newsletter/subscribe                  │ │
│  │  │     ├─ Validate Email                               │ │
│  │  │     ├─ Save to Database                             │ │
│  │  │     └─ Send Confirmation Email                      │ │
│  │  │                                                       │ │
│  │  └─ Models                                               │ │
│  │     ├─ Contact.js                                       │ │
│  │     └─ Newsletter.js                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────┬──────────────────┬────────────────────────────────────┘
           │                  │
           ▼                  ▼
    ┌──────────────┐   ┌──────────────────┐
    │  DATABASE    │   │  EMAIL SERVICE   │
    │ (SQLite)     │   │ (Nodemailer)     │
    │              │   │                  │
    │ ┌──────────┐ │   │ SMTP Server:     │
    │ │ contacts │ │   │ • Gmail          │
    │ │ newsletter│ │   │ • Outlook        │
    │ │          │ │   │ • SendGrid       │
    │ └──────────┘ │   │ • Custom SMTP    │
    └──────────────┘   └──────────────────┘
         |Users                 |Admin
         |receive             receives
         |emails              notifications
         ▼                     ▼
    [Subscriber               [Admin
     Inboxes]                 Inbox]
```

## Data Flow - Contact Form Submission

```
User fills Contact Form
         │
         ▼
Frontend JavaScript validates
         │
         ▼
Sends POST to /api/contact with JSON
         │
         ▼
Express receives request
         │
         ▼
Validate using express-validator
         │
    ┌────┴────┐
    │          │
    ▼          ▼
 Valid     Invalid
    │          │
    │          ▼
    │     Return 400 error
    │
    ▼
Save to SQLite database
    │
    ▼
Send email to ADMIN
    │
    ├─→ SMTP Server → Admin Inbox
    │
    ▼
Send confirmation email to USER
    │
    ├─→ SMTP Server → User Inbox
    │
    ▼
Return 201 success response
    │
    ▼
Frontend shows success notification
```

## Component Interaction

```
┌─ PRESENTATION LAYER ─────────────┐
│                                   │
│  HTML Form              scripts/  │
│  ├─ contact form    ←→   main.js │
│  └─ newsletter form  ←→   (API    │
│                          calls)   │
│                                   │
└─────────────┬─────────────────────┘
              │ HTTP/JSON
              ▼
┌─ API LAYER ──────────────────────┐
│                                   │
│  routes/contact.js                │
│  routes/newsletter.js             │
│                                   │
└─────────────┬─────────────────────┘
              │ SQL/Queries
              ▼
┌─ DATA LAYER ──────────────────────┐
│                                   │
│  models/Contact.js                │
│  models/Newsletter.js             │
│  ↓                                │
│  config/database.js               │
│  ↓                                │
│  SQLite Database                  │
│                                   │
└─────────────────────────────────────┘

Async:
┌─ NOTIFICATION LAYER ──────────────┐
│                                   │
│  config/email.js                  │
│  ↓                                │
│  Nodemailer                       │
│  ↓                                │
│  SMTP Server                      │
│  ↓                                │
│  User & Admin Emails              │
│                                   │
└───────────────────────────────────┘
```

## File Organization

```
server/
├── server.js                Main entry point
│   ├── imports routes
│   ├── sets up middleware
│   └── starts Express server
│
├── config/
│   ├── database.js          SQLite connection & init
│   └── email.js             Nodemailer & sending
│
├── models/
│   ├── Contact.js           CRUD for contacts
│   └── Newsletter.js        CRUD for subscriptions
│
├── routes/
│   ├── contact.js           POST /api/contact
│   └── newsletter.js        POST /api/newsletter/*
│
├── data/                    (auto-created)
│   └── contacts.db          SQLite database file
│
├── package.json             Dependencies
├── .env                     Configuration (secret)
├── .env.example             Template
├── .gitignore               Git rules
└── README.md                Documentation
```

## Middleware Pipeline

```
HTTP Request
    │
    ▼
Helmet (security headers)
    │
    ▼
CORS (cross-origin)
    │
    ▼
Body Parser (JSON)
    │
    ▼
Route Handler
    │
    ├─→ Validation (express-validator)
    │
    ├─→ Database Query (SQLite)
    │
    ├─→ Email Send (Nodemailer - async)
    │
    ▼
JSON Response
    │
    ▼
User's Browser
```

## Email Flow

```
Form Submission
    │
    ├─────────────┬──────────────────┐
    │             │                  │
    ▼             ▼                  ▼
Save to    Send to Admin      Send to User
Database   Inbox              Inbox
    │         SMTP              SMTP
    │          │                 │
    │          ▼                 ▼
    │      Email Server      Email Server
    │          │                 │
    ▼          ▼                 ▼
 [DB]    [Admin Email]      [User Email]
    │          │                 │
    └──────────┼─────────────────┘
               │
        Return to Frontend
```

## Technology Stack

```
├─ Runtime & Framework
│  └─ Node.js + Express.js
│
├─ Database
│  └─ SQLite3
│
├─ Security
│  ├─ Helmet.js
│  ├─ CORS
│  └─ express-validator
│
├─ Email
│  └─ Nodemailer
│
├─ Configuration
│  └─ dotenv
│
└─ Development
   └─ Nodemon (auto-reload)
```

## Deployment Architecture (Example: Render)

```
┌─ Version Control ─────┐
│                       │
│  GitHub Repository    │
│  ├─ server/           │
│  ├─ Frontend files    │
│  └─ Docs              │
│                       │
└───────────┬───────────┘
            │
            │ Push to main branch
            │
            ▼
┌─ Render.com ──────────────────┐
│                               │
│  Build Process                │
│  1. git clone                 │
│  2. cd server && npm install  │
│  3. npm start                 │
│                               │
│  Environment Setup            │
│  • Set .env variables         │
│  • Database auto-creates      │
│                               │
├─ Node.js Server (Port 3000)──┤
│                               │
│  Live at: thehenry.render.com │
│                               │
└───────────┬───────────────────┘
            │
    ┌───────┴───────┐
    ▼               ▼
Frontend    Backend API
Requests    Requests
```

## Request-Response Cycle

```
[Contact Form Submitted]
       │
       ▼
JavaScript Event Handler
       │
       ├─ Validate input
       ├─ Disable button
       ├─ Show "Sending..."
       │
       ▼
Fetch Request
    method: POST
    url: /api/contact
    body: {name, email, phone, subject, message}
       │
       ▼
[Express Server]
    │
    ├─ Receive request
    ├─ Parse JSON body
    ├─ Validate fields
    │
    ├─ Save to database
    │ (Contact Model)
    │
    ├─ Send emails
    │ (Nodemailer)
    │
    ▼
Return Response
{
  success: true,
  message: "...",
  contactId: 123
}
       │
       ▼
JavaScript Receives Response
       │
       ├─ Enable button
       ├─ Reset form
       ├─ Show success
       ▼
[User sees confirmation]
```

---

This architecture is scalable, maintainable, and follows best practices for web application development.
