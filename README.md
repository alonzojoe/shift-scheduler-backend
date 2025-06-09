# Shift Scheduler Backend API (Node Express)

## Overview

This is the backend API for the Shift Scheduler application, built with Node.js and Express. It manages shift data with timezone-aware handling by storing all timestamps in UTC and converting them dynamically based on client-provided timezones. The API supports full CRUD operations on shifts and maintains a configurable global timezone setting.

## 🔧 Installation & Setup

### Clone the Repository

Start by cloning the project:

```bash
git clone https://github.com/alonzojoe/shift-scheduler-backend.git
cd shift-scheduler-backend
```

### Install Dependencies

Run the following to install required packages:

```bash
npm install
```

### Start the app

Run the command below

```bash
npm start
```

### Firebase Emulator Setup (makesure you have firebase -tools installed)

Run the command below

```bash
firebase init emulators
//start emulator
firebase emulators:start --only firestore --project=fc-itw-joenell
```

### Verify Emulator Access the UI at:

```bash
http://localhost:4000/firestore
```

Create new collection `settings` DocumentID -> `timezone` and default `timezone` type `string` value `Asia/Manila` for default timezone

### Preview the project in POSTMAN:

```bash
http://localhost:3000/api/test
//will return response { "message": "API endpoint test!" }
```

## API Routes

### /api/timezone

- **GET**  
  Retrieve the current configured timezone.  
  Required query parameter: `timezone` to specify a timezone.

- **PUT**  
  Update the current global timezone setting.  
  Request body should contain the new timezone string.

### /api/shifts

- **GET**  
  Retrieve all shifts.  
  Optional query parameter: `timezone` to return shifts formatted in the requested timezone.

- **POST**  
  Create a new shift.  
  Payload: start,end (duration automatically computed)
- **PUT** /:id  
  Update shift data.  
  Payload: start,end (duration automatically computed)

- **DELETE** /:id  
  DELETE shift data.

### Deployment

A Dockerfile has already been set up in the root folder of the project, including:

```bash
FROM node:18


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install


COPY . .


ENV PORT=8080
ENV NODE_ENV=production


EXPOSE 8080


CMD ["npm", "start"]
```

### Uploading to Google Cloud Run

Replace the project name based on your preference, then deploy the application using the following command:

```bash
gcloud run deploy node-backend --source . --region us-central1 --project fc-itw-joenell --platform managed --allow-unauthenticated
```
