# Notifications System

A full-stack personal notifications management application built with **React**, **NestJS**, **TypeScript**, **MongoDB**, **Mongoose**, **JWT authentication**, and **bcrypt**.

This project was developed as an internship evaluation assignment. The goal was to rebuild the behavior of an existing Angular + Express application using a modern React + NestJS architecture while improving maintainability, validation, security, state management, responsiveness, and overall user experience.

The application allows authenticated users to create, view, edit, dismiss, search, filter, and delete personal notifications while ensuring that every user's data remains isolated and protected.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Authentication Flow](#authentication-flow)
- [Notification Flow](#notification-flow)
- [Notification Categories](#notification-categories)
- [Notification Banner Behavior](#notification-banner-behavior)
- [Account Settings](#account-settings)
- [Security](#security)
- [Validation](#validation)
- [Frontend Routing](#frontend-routing)
- [State Management](#state-management)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Building](#building)
- [Linting](#linting)
- [Manual Testing Checklist](#manual-testing-checklist)
- [Important Engineering Decisions](#important-engineering-decisions)
- [Git Workflow](#git-workflow)
- [Current Verification Status](#current-verification-status)
- [Future Improvements](#future-improvements)
- [Submission Checklist](#submission-checklist)
- [Repository](#repository)

---

## Project Overview

The **Notifications System** is a personal notification dashboard where every authenticated user has an isolated workspace.

A user can:

- register an account;
- log in securely;
- remain authenticated after refreshing the browser;
- create notifications;
- assign notification categories;
- view notifications newest first;
- edit existing notifications;
- delete notifications;
- dismiss active notification banners;
- search notifications;
- filter notifications by category;
- update their profile;
- change their password;
- switch between dark and light themes.

The application contains two independently running applications:

```text
React Frontend
      ↓
REST API / JSON
      ↓
NestJS Backend
      ↓
Mongoose
      ↓
MongoDB
```

The frontend handles:

- presentation;
- client-side routing;
- forms;
- local interaction;
- shared application state;
- theme handling;
- API communication.

The backend handles:

- authentication;
- authorization;
- validation;
- business logic;
- password hashing;
- JWT generation and verification;
- MongoDB operations;
- resource ownership checks.

---

## Key Features

### Authentication

The authentication system includes:

- User registration
- User login
- User logout
- JWT-based authentication
- Password hashing using bcrypt
- Authentication persistence after browser refresh
- Protected frontend routes
- Protected backend routes
- Duplicate username rejection
- Secure password changes
- Authenticated user restoration through `/auth/me`

Passwords are never stored in plaintext.

---

### User Registration

A new user provides:

```text
Full Name
Username
Password
```

The backend validates the registration request.

Important rules:

- Full name must not be empty
- Username must not be empty
- Username must be unique
- Password must meet the minimum length
- Password is hashed before database storage

If a username already exists, the backend returns:

```text
409 Conflict
```

---

### Login

A user logs in with:

```text
Username
Password
```

The backend performs the following flow:

```text
Normalize username
        ↓
Find user in MongoDB
        ↓
Explicitly select passwordHash
        ↓
bcrypt.compare()
        ↓
Credentials valid?
       / \
     no   yes
     ↓     ↓
   401   Generate JWT
             ↓
         Return token
```

The frontend stores the access token in `localStorage`.

---

### Authentication Persistence

The application restores authentication after refresh.

```text
Application loads
      ↓
Check localStorage
      ↓
Access token exists?
     / \
   no   yes
   ↓     ↓
Login   GET /auth/me
page       ↓
       Valid token?
        /     \
      no       yes
      ↓         ↓
Remove      Restore
token       user state
```

This avoids logging users out simply because the browser was refreshed.

---

### Protected Routes

Protected frontend routes include:

```text
/dashboard
/notifications
/notifications/new
/notifications/:id/edit
/settings
```

If an unauthenticated user attempts to visit a protected route, the frontend redirects them to:

```text
/login
```

The backend independently protects sensitive endpoints using JWT authentication.

Frontend route protection is therefore a user-experience layer, while backend authorization remains the actual security boundary.

---

## Notifications

The application supports complete CRUD operations:

```text
Create
Read
Update
Delete
```

Users can:

- create notifications;
- retrieve their notification list;
- retrieve an individual notification;
- edit notifications;
- delete notifications;
- dismiss notifications.

Notifications are returned newest first.

---

## Notification Model

A notification contains fields conceptually equivalent to:

```ts
{
  _id: string;
  header: string;
  body: string;
  category: 'INFO' | 'WARNING' | 'ERROR';
  isClosed: boolean;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### Field Responsibilities

#### `header`

Short notification title.

Example:

```text
Deployment completed
```

#### `body`

Detailed notification content.

Example:

```text
The production deployment completed successfully.
```

#### `category`

Defines notification severity.

Supported values:

```text
INFO
WARNING
ERROR
```

#### `isClosed`

Controls whether the notification should still appear as an active banner.

Default:

```text
false
```

#### `userId`

References the authenticated user who owns the notification.

This field is used to enforce ownership and prevent unauthorized access.

---

## Notification Categories

### INFO

Color:

```text
Blue
```

Typical use cases:

- General information
- Successful operations
- Non-critical updates

Behavior:

```text
Automatically closes after 90 seconds
```

---

### WARNING

Color:

```text
Yellow / Orange
```

Typical use cases:

- Situations requiring attention
- Potential issues
- Important reminders

Behavior:

```text
Remains visible until manually dismissed
```

---

### ERROR

Color:

```text
Red
```

Typical use cases:

- Critical failures
- Important problems
- High-priority issues

Behavior:

```text
Remains visible until manually dismissed
```

---

## Notification Banner Behavior

Undismissed notifications are displayed as banners.

Only notifications where:

```ts
isClosed === false
```

are eligible.

Banner rules:

- Show only undismissed notifications
- Show at most five banners
- Allow users to dismiss banners
- Persist dismissal through the backend
- Automatically close INFO notifications after 90 seconds
- Keep WARNING and ERROR notifications visible until manually dismissed

If there are more than five undismissed notifications, the UI displays:

```text
You have more notifications
```

along with the number of additional notifications.

Example:

```text
You have more notifications
3 additional notifications
```

---

## INFO Auto-Close Logic

INFO notifications do not simply wait 90 seconds from page load.

Their remaining lifetime is calculated using the original creation time.

```text
INFO lifetime = 90 seconds

elapsed =
current time - createdAt

remaining =
90 seconds - elapsed
```

Example:

```text
Notification age: 60 seconds

90 - 60 = 30 seconds remaining
```

This prevents a browser refresh from restarting the 90-second lifetime.

When the remaining time reaches zero, the frontend persists dismissal through the backend:

```http
PUT /notifications/:id
```

```json
{
  "isClosed": true
}
```

---

## Real-Time UI Updates

The application does not use WebSockets.

The real-time requirement is fulfilled by updating shared React state immediately after local CRUD actions.

Example:

```text
Create notification
        ↓
POST /notifications
        ↓
Backend returns created notification
        ↓
NotificationsProvider updates state
        ↓
Dashboard updates
Notification list updates
Banner stack updates
```

No browser refresh is required.

---

## Search and Filtering

The Notifications page supports:

- text search;
- filtering by category.

Available filters:

```text
ALL
INFO
WARNING
ERROR
```

Filtering is performed on the frontend using the authenticated user's already-loaded notification state.

---

## Account Settings

The Settings page provides actual account-management functionality.

Users can:

- update their full name;
- change their username;
- change their password;
- change the application theme.

---

### Profile Update

Profile changes use:

```http
PUT /auth/me
```

The backend performs:

```text
Authenticated user ID
        ↓
Validate DTO
        ↓
Normalize username
        ↓
Check duplicate username
        ↓
Update MongoDB
        ↓
Return safe user object
```

The frontend then updates the shared authentication context.

The new profile information immediately appears in:

- Sidebar
- TopBar
- Dashboard greeting
- Settings page
- Avatar initials

without requiring a browser refresh.

---

### Username Uniqueness

Username changes are protected against duplicates.

The backend checks whether another user already owns the requested username while excluding the current user's own ID.

If the username is already taken:

```text
409 Conflict
```

is returned.

The frontend displays a user-friendly error message.

---

### Password Change

Users can securely change passwords through:

```http
PUT /auth/me/password
```

The frontend collects:

```text
Current Password
New Password
Confirm New Password
```

The backend receives:

```json
{
  "currentPassword": "...",
  "newPassword": "..."
}
```

Password-change flow:

```text
Authenticated user ID
        ↓
Load user with passwordHash
        ↓
bcrypt.compare(currentPassword)
        ↓
Correct?
   /         \
 no           yes
 ↓             ↓
400       Compare new
          password with old
                ↓
           Same password?
            /        \
          yes         no
          ↓            ↓
         400       bcrypt.hash()
                        ↓
                  Save new hash
```

The new password must be different from the current password.

---

## Theme System

Supported themes:

```text
Dark Mode
Light Mode
```

The selected theme is persisted in `localStorage`.

Example:

```text
Select light mode
      ↓
Refresh browser
      ↓
Light mode remains active
```

The theme affects:

- page background;
- sidebar;
- top navigation;
- text colors;
- cards;
- borders;
- dialogs;
- forms;
- hover effects;
- animated input borders;
- notification surfaces.

---

## Premium Input Interaction

Input controls use an animated theme-aware border effect.

When focused, colors flow across the field perimeter using a palette such as:

```text
Blue → Cyan → Violet
```

Dark and light themes use different intensity values to preserve readability.

The UI also respects:

```css
prefers-reduced-motion
```

for users who request reduced motion at operating-system level.

---

## Technology Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| React 19 | Component-based UI |
| TypeScript | Static typing |
| Vite | Development server and build tool |
| React Router | Client-side routing |
| Axios | HTTP communication |
| Tailwind CSS 4 | Utility-first styling |
| Framer Motion | Animations and transitions |
| Lucide React | Icon library |
| React Context | Shared authentication, notification, and theme state |

---

### Backend

| Technology | Purpose |
| --- | --- |
| NestJS | Backend application framework |
| TypeScript | Static typing |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| Passport | Authentication integration |
| Passport JWT | JWT authentication strategy |
| `@nestjs/jwt` | Token creation and verification |
| bcrypt | Password hashing |
| class-validator | DTO validation |
| class-transformer | Request transformation |
| Vitest | Unit testing |
| `@nestjs/testing` | NestJS testing utilities |

---

## System Architecture

```text
┌────────────────────────────────────────────┐
│                  Browser                   │
│                                            │
│ React + TypeScript                         │
│ Pages                                      │
│ Components                                 │
│ Context Providers                          │
│ API Services                               │
└───────────────────┬────────────────────────┘
                    │
                    │ REST / JSON
                    │ Authorization: Bearer JWT
                    ↓
┌────────────────────────────────────────────┐
│                 NestJS API                 │
│                                            │
│ Controllers                                │
│ DTO Validation                             │
│ JWT Authentication                         │
│ Services                                   │
│ Mongoose Models                            │
└───────────────────┬────────────────────────┘
                    │
                    ↓
┌────────────────────────────────────────────┐
│                  MongoDB                   │
│                                            │
│ Users                                      │
│ Notifications                              │
└────────────────────────────────────────────┘
```

---

## Backend Architecture

The NestJS backend is organized around modules.

Major modules:

```text
AuthModule
UsersModule
NotificationsModule
```

### Controllers

Controllers receive HTTP requests and forward work to services.

Examples:

```text
AuthController
NotificationsController
```

Typical controller flow:

```text
Receive request
      ↓
Extract body / params / user
      ↓
Call service
      ↓
Return response
```

---

### Services

Services contain business logic.

Examples:

```text
AuthService
UsersService
NotificationsService
```

Responsibilities include:

- querying MongoDB;
- updating documents;
- password hashing;
- password verification;
- checking username uniqueness;
- JWT creation;
- ownership validation;
- notification CRUD.

---

### DTOs

DTO means:

```text
Data Transfer Object
```

DTOs define and validate incoming API payloads.

Examples:

```text
RegisterDto
LoginDto
CreateNotificationDto
UpdateNotificationDto
UpdateProfileDto
UpdatePasswordDto
```

---

### Schemas

Mongoose schemas define database document structures.

Important schemas:

```text
User
Notification
```

---

## Project Structure

```text
notifications-system/
│
├── backend/
│   ├── src/
│   │   │
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   ├── update-password.dto.ts
│   │   │   │   └── update-profile.dto.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── users/
│   │   │   ├── schemas/
│   │   │   │   └── user.schema.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   │
│   │   ├── notifications/
│   │   │   ├── dto/
│   │   │   ├── schemas/
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   └── notifications.module.ts
│   │   │
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   │
│   │   ├── api/
│   │   │   ├── http.ts
│   │   │   ├── auth.api.ts
│   │   │   └── notifications.api.ts
│   │   │
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   ├── notifications/
│   │   │   └── ui/
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── NotificationsProvider.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── supporting context/hooks
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── notifications/
│   │   │   └── settings/
│   │   │
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## Authentication Flow

### Login Request

```text
Login form
    ↓
authApi.login()
    ↓
POST /auth/login
    ↓
AuthController
    ↓
AuthService
    ↓
UsersService
    ↓
MongoDB
```

If credentials are valid:

```text
bcrypt.compare()
      ↓
JWT generated
      ↓
accessToken returned
      ↓
localStorage
```

---

## Axios JWT Interceptor

The application uses a shared Axios instance.

Before each outgoing request:

```ts
const token =
  localStorage.getItem('accessToken');
```

If the token exists:

```http
Authorization: Bearer <token>
```

is attached automatically.

---

## Notification Flow

Notification state is centralized in `NotificationsProvider`.

```text
                     NotificationsProvider
                            │
           ┌────────────────┼────────────────┐
           │                │                │
           ↓                ↓                ↓
      Dashboard        Notifications     Banner Stack
           │                Page              │
           └────────────────┼─────────────────┘
                            │
                      Shared state
```

When a notification is created:

```text
CreateNotificationPage
        ↓
createNotification()
        ↓
POST /notifications
        ↓
Backend creates notification
        ↓
Created object returned
        ↓
setNotifications()
        ↓
Every consumer re-renders
```

---

## Frontend Routing

| Route | Description | Protected |
| --- | --- | --- |
| `/` | Application entry / redirect | Depends on auth |
| `/login` | Login page | No |
| `/register` | Registration page | No |
| `/dashboard` | Dashboard | Yes |
| `/notifications` | Notification management | Yes |
| `/notifications/new` | Create notification | Yes |
| `/notifications/:id/edit` | Edit notification | Yes |
| `/settings` | Account settings | Yes |

---

## State Management

React Context is used because the application is small enough that Redux would add unnecessary complexity.

### Authentication Context

Stores:

```text
user
isLoading
login()
register()
logout()
updateProfile()
changePassword()
```

### Notifications Context

Stores:

```text
notifications
isLoading
error
createNotification()
updateNotification()
deleteNotification()
dismissNotification()
refreshNotifications()
```

### Theme Context

Stores:

```text
theme
toggleTheme()
```

---

## Security

### Password Hashing

Passwords are hashed using bcrypt.

Registration:

```text
plaintext password
      ↓
bcrypt.hash(password, 12)
      ↓
passwordHash
      ↓
MongoDB
```

Login:

```text
entered password
      +
stored passwordHash
      ↓
bcrypt.compare()
```

---

### Password Hash Exclusion

The `passwordHash` field is excluded from normal Mongoose queries using:

```ts
select: false
```

This reduces accidental exposure of password hashes.

---

### JWT Authentication

Protected requests require:

```http
Authorization: Bearer <token>
```

The JWT strategy verifies the token and attaches the authenticated user to the request.

---

### IDOR Protection

Notification ownership is enforced by combining:

```text
notification ID
+
authenticated user ID
```

Conceptually:

```ts
{
  _id: notificationId,
  userId: authenticatedUserId
}
```

This prevents one user from accessing another user's notification by guessing or modifying an ID.

---

### Environment Security

Real `.env` files are ignored by Git.

Only example configuration files should be committed.

---

## Validation

Validation exists on both frontend and backend.

Frontend validation improves user experience.

Backend validation protects the API and cannot be bypassed by direct tools such as:

```text
Postman
curl
custom clients
```

### Backend Validation

NestJS uses:

```text
class-validator
class-transformer
ValidationPipe
```

Examples of validated data include:

- full name;
- username;
- password length;
- notification header;
- notification body;
- notification category;
- MongoDB object IDs.

### Frontend Validation

The frontend validates:

- required fields;
- password length;
- password confirmation;
- profile changes;
- invalid notification forms;
- duplicate username responses;
- backend errors.

---

## Prerequisites

Install:

- Node.js
- npm
- MongoDB
- Git

Recommended Node version:

```text
Node.js 22+
```

Check:

```bash
node --version
npm --version
git --version
```

MongoDB may be:

- installed locally; or
- hosted using MongoDB Atlas.

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/zainulabidin776/notifications-system.git
cd notifications-system
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

## Environment Variables

Never commit real environment values.

### Backend

Create:

```text
backend/.env
```

Copy the example:

#### macOS / Linux

```bash
cd backend
cp .env.example .env
```

#### Windows PowerShell

```powershell
cd backend
Copy-Item .env.example .env
```

Required configuration:

```env
MONGODB_URI=mongodb://localhost:27017/notifications
JWT_SECRET=replace-with-a-secure-secret
JWT_EXPIRES_IN=1d
```

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWT tokens |
| `JWT_EXPIRES_IN` | Yes | JWT expiration duration |

---

### Frontend

Create:

```text
frontend/.env
```

Copy the example:

#### macOS / Linux

```bash
cd frontend
cp .env.example .env
```

#### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

Configuration:

```env
VITE_API_URL=http://localhost:3000
```

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | Recommended | Base URL of the NestJS API |

---

## Running the Application

Three things may need to be running:

```text
MongoDB
NestJS backend
React frontend
```

### Start MongoDB

If using local MongoDB, make sure the database service is running.

MongoDB Atlas users do not need a local MongoDB process.

### Start Backend

```bash
cd backend
npm run start:dev
```

Backend URL:

```text
http://localhost:3000
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## CORS

During development:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:3000
```

These are different browser origins.

The NestJS backend therefore enables CORS for the frontend development origin.

---

## API Endpoints

### Authentication API

| Method | Endpoint | Description | Protected |
| --- | --- | --- | --- |
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login and receive JWT | No |
| GET | `/auth/me` | Get current authenticated user | Yes |
| PUT | `/auth/me` | Update profile | Yes |
| PUT | `/auth/me/password` | Change password | Yes |

#### Register Example

```http
POST /auth/register
```

```json
{
  "fullName": "John Doe",
  "username": "johndoe",
  "password": "password123"
}
```

#### Login Example

```http
POST /auth/login
```

```json
{
  "username": "johndoe",
  "password": "password123"
}
```

#### Update Profile Example

```http
PUT /auth/me
```

```json
{
  "fullName": "John Smith",
  "username": "johnsmith"
}
```

#### Change Password Example

```http
PUT /auth/me/password
```

```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

---

### Notifications API

All notification routes require JWT authentication.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/notifications` | Get authenticated user's notifications |
| GET | `/notifications/:id` | Get one owned notification |
| POST | `/notifications` | Create notification |
| PUT | `/notifications/:id` | Update owned notification |
| DELETE | `/notifications/:id` | Delete owned notification |

#### Create Notification

```http
POST /notifications
```

```json
{
  "header": "Deployment complete",
  "body": "The latest version was deployed successfully.",
  "category": "INFO"
}
```

#### Update Notification

```http
PUT /notifications/:id
```

```json
{
  "header": "Updated title",
  "body": "Updated message",
  "category": "WARNING"
}
```

#### Dismiss Notification

```http
PUT /notifications/:id
```

```json
{
  "isClosed": true
}
```

---

## HTTP Status Behavior

| Situation | Status |
| --- | --- |
| Successful request | `200 / 201` |
| Validation failure | `400 Bad Request` |
| Incorrect password | `400 Bad Request` |
| Invalid login credentials | `401 Unauthorized` |
| Missing or invalid JWT | `401 Unauthorized` |
| Duplicate username | `409 Conflict` |
| Missing owned resource | `404 Not Found` |

---

## Dashboard

The dashboard includes:

- total notifications;
- undismissed notifications;
- warning count;
- critical/error count;
- recent notifications;
- warning distribution;
- error distribution;
- quick navigation to create notifications.

Dashboard data is calculated from shared notification state.

---

## Notifications Page

Features:

- complete notification list;
- category filtering;
- text search;
- edit action;
- dismiss action;
- delete action;
- category badges;
- status indicators;
- responsive cards.

---

## Create Notification Page

Fields:

```text
Header
Message
Category
```

Category options:

```text
INFO
WARNING
ERROR
```

The form uses controlled React state.

After creation, the shared notification context updates immediately.

---

## Edit Notification Page

The edit form pre-populates:

```text
Header
Body
Category
```

After a successful update, the shared notification state updates immediately.

---

## Delete Confirmation

Deletion uses a confirmation dialog that supports:

- Cancel
- Delete
- Escape key
- backdrop click
- body scroll locking
- accessible dialog semantics

---

## Accessibility

The interface includes:

- keyboard focus indicators;
- semantic buttons;
- ARIA labels where appropriate;
- dialog semantics;
- Escape-key behavior;
- reduced-motion support;
- labeled forms;
- responsive keyboard-accessible navigation.

---

## Responsive Design

### Desktop

```text
Persistent sidebar
Top navigation
Dashboard content
```

### Mobile

```text
Top navigation
Menu trigger
Animated drawer
Backdrop
Responsive cards
Responsive forms
```

The mobile drawer closes through:

```text
Escape
Backdrop click
Navigation
```

---

## Testing

Backend tests use:

```text
Vitest
@nestjs/testing
```

Mocks are used instead of a real MongoDB database for unit tests.

Current test coverage includes:

- App controller
- Auth controller
- Auth service
- Users service
- Notifications controller
- Notifications service

### Authentication Service Tests

Current auth tests verify:

```text
✓ service is defined
✓ profile update returns a safe user
✓ correct password change succeeds
✓ incorrect current password is rejected
✓ same old/new password is rejected
✓ missing user is rejected
```

---

## Running Tests

From:

```text
backend/
```

Run all tests:

```bash
npm test
```

Run authentication service tests:

```bash
npm test -- auth.service.spec.ts
```

Watch mode:

```bash
npm run test:watch
```

Coverage:

```bash
npm run test:cov
```

---

## Building

### Backend

```bash
cd backend
npm run build
```

### Frontend

```bash
cd frontend
npm run build
```

The frontend build performs:

```text
TypeScript compilation
      ↓
Vite production build
```

Output:

```text
frontend/dist
```

---

## Linting

### Frontend

```bash
cd frontend
npm run lint
```

### Backend

```bash
cd backend
npm run lint
```

---

## Current Verification Status

At the latest verification stage:

```text
Backend test files: 6 passed
Backend tests: 12 passed
Backend build: passed
Frontend lint: passed
Frontend production build: passed
```

---

## Error Handling

The frontend converts backend errors into user-friendly messages.

It handles both:

```text
Single string messages
Arrays of validation messages
```

Examples:

```text
Username is already taken
Current password is incorrect
New password must be at least 6 characters
Unable to create notification
```

---

## Manual Testing Checklist

### Authentication

- [ ] Register a new account
- [ ] Duplicate username is rejected
- [ ] Login with correct password works
- [ ] Login with incorrect password fails
- [ ] Refresh keeps the user logged in
- [ ] Logout removes authentication
- [ ] Protected pages redirect unauthenticated users

### Notifications

- [ ] Create INFO notification
- [ ] Create WARNING notification
- [ ] Create ERROR notification
- [ ] New notification appears without refresh
- [ ] Notifications appear newest first
- [ ] Search works
- [ ] Category filtering works
- [ ] Edit form is pre-populated
- [ ] Edit updates notification
- [ ] Delete removes notification
- [ ] Dismiss marks notification closed

### Banners

- [ ] Undismissed notifications appear
- [ ] Maximum five banners appear
- [ ] Overflow summary appears when there are more than five
- [ ] INFO is blue
- [ ] WARNING is yellow/orange
- [ ] ERROR is red
- [ ] INFO auto-closes after 90 seconds
- [ ] Refresh does not restart INFO lifetime
- [ ] Dismiss persists after refresh

### Account Settings

- [ ] Full name can be updated
- [ ] Username can be updated
- [ ] Duplicate username is rejected
- [ ] Profile changes update the UI immediately
- [ ] Profile changes survive refresh
- [ ] Incorrect current password is rejected
- [ ] New password under six characters is rejected
- [ ] Password confirmation mismatch is rejected
- [ ] Reusing the current password is rejected
- [ ] Valid password change succeeds
- [ ] Old password stops working
- [ ] New password works

### Theme

- [ ] Dark mode works
- [ ] Light mode works
- [ ] Theme persists after refresh
- [ ] Sidebar theme changes correctly
- [ ] Forms remain readable
- [ ] Cards remain readable
- [ ] Mobile layout remains usable

### Security

- [ ] User A cannot retrieve User B's notification
- [ ] User A cannot edit User B's notification
- [ ] User A cannot delete User B's notification
- [ ] Password hashes are never returned
- [ ] `.env` is not tracked by Git

---

## Important Engineering Decisions

### Why React Context Instead of Redux?

The application has three main shared state domains:

```text
Authentication
Notifications
Theme
```

For this project size, React Context is sufficient and avoids unnecessary complexity.

Redux Toolkit or Zustand would be reasonable choices for a larger application.

---

### Why JWT?

JWT allows protected backend requests to be authenticated using a signed token.

The assignment specifically required JWT authentication.

---

### Why bcrypt?

bcrypt is designed for password hashing and is intentionally computationally expensive.

The project uses:

```text
bcrypt cost factor: 12
```

---

### Why Validate on Both Frontend and Backend?

Frontend validation improves user experience.

Backend validation provides actual protection.

Frontend checks can be bypassed through tools such as:

```text
Postman
curl
custom scripts
```

Therefore backend validation is mandatory.

---

### Why Check Notification Ownership?

Authentication answers:

```text
Who is the user?
```

Authorization answers:

```text
Is this user allowed to access this notification?
```

Being authenticated does not mean a user should be allowed to access every database record.

Ownership checks prevent IDOR vulnerabilities.

---

### Why Use an API Service Layer?

Direct Axios calls are centralized into reusable API modules.

This improves:

- maintainability;
- consistency;
- authentication handling;
- testing;
- separation of concerns.

---

### Why Shared Notification State?

Without shared state:

```text
Create notification
        ↓
Backend stores it
        ↓
Dashboard still has old local state
        ↓
Refresh required
```

With `NotificationsProvider`:

```text
Create notification
        ↓
Shared state updates
        ↓
Dashboard updates immediately
```

---

## Git Workflow

The project was developed incrementally using logical commits.

Example commit areas:

```text
Authentication
Notification CRUD
Frontend authentication
Dashboard
Notification management
Account settings
Documentation
```

Example conventional commit messages:

```text
feat: implement authentication
fix: enable cors for frontend
feat: build notification management dashboard
feat: add account settings
docs: add project documentation
```

---

## Production Considerations

This project is primarily intended for internship evaluation and local development.

A production deployment should additionally consider:

- HTTPS
- secure secret management
- production CORS restrictions
- refresh tokens
- rate limiting
- centralized logging
- monitoring
- database indexes
- CI/CD
- automated integration tests
- end-to-end tests
- frontend error boundaries
- stronger deployment configuration

---

## Future Improvements

### Authentication

- Refresh token rotation
- Email verification
- Forgot-password flow
- Login history
- Multi-factor authentication

### Notifications

- Pagination
- Bulk dismissal
- Bulk deletion
- Scheduling
- Notification priorities
- Advanced filtering
- Server-side search

### Real-Time Updates

WebSockets or Server-Sent Events could provide server-pushed updates across multiple devices or browser sessions.

### User Interface

- Command palette
- More advanced accessibility testing
- Custom motion preferences
- Additional analytics
- Saved filters

### Testing

- Expanded service coverage
- Controller integration tests
- MongoDB integration tests
- React component tests
- Playwright or Cypress E2E tests

---

## Assignment Requirement Mapping

| Requirement | Implementation |
| --- | --- |
| React frontend | React + TypeScript + Vite |
| NestJS backend | NestJS + TypeScript |
| MongoDB | MongoDB + Mongoose |
| JWT authentication | Passport JWT + `@nestjs/jwt` |
| bcrypt password hashing | bcrypt with cost factor 12 |
| Registration | Implemented |
| Login | Implemented |
| Logout | Implemented |
| Session persistence | JWT + `/auth/me` |
| Protected frontend routes | `ProtectedRoute` |
| Protected backend routes | Passport JWT guard |
| Notification CRUD | Implemented |
| User ownership protection | Queries scoped by `userId` |
| INFO/WARNING/ERROR categories | Implemented |
| Max five banners | Implemented |
| Overflow notification summary | Implemented |
| INFO auto-close after 90 seconds | Implemented |
| Frontend validation | Implemented |
| Backend validation | DTOs + ValidationPipe |
| Unit tests | Multiple backend tests |
| README | Detailed setup and architecture documentation |

---

## Submission Checklist

Before submission, run:

### Backend

```bash
cd backend
npm test
npm run build
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

Then from repository root:

```bash
git status
```

Expected:

```text
nothing to commit, working tree clean
```

Check tracked environment files:

```powershell
git ls-files | Select-String "\.env"
```

Only example files such as:

```text
backend/.env.example
frontend/.env.example
```

should be tracked.

Real `.env` files must never be committed.

---

## Repository

GitHub:

```text
https://github.com/zainulabidin776/notifications-system
```

---

## Project Status

```text
Authentication       ✅
JWT authorization    ✅
Password security    ✅
Notification CRUD    ✅
Ownership protection ✅
Notification banners ✅
INFO auto-dismiss    ✅
Shared React state   ✅
Search & filters     ✅
Account settings     ✅
Dark/light themes    ✅
Responsive UI        ✅
Backend testing      ✅
Production builds    ✅
```

---

## License

This project was developed as part of an internship evaluation assignment.

It is intended primarily for educational, evaluation, and demonstration purposes.
