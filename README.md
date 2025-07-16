# 💼 Job Aggregator API

A backend service for aggregating job offers from multiple external providers into a unified format, storing them in a relational database, and providing a powerful REST API for querying.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Cron Job Scheduler](#cron-job-scheduler)
- [Testing](#testing)
- [Error Handling](#error-handling)
- [Logs](#logs)
- [Project Structure](#project-structure)
- [Author](#author)

---

## 📖 Overview

This project fetches job offers from **two external providers** with different response structures, transforms them into a unified format, stores them in **PostgreSQL**, and exposes a public REST API to retrieve job offers with filters and pagination.

> Developed by **Mohammadreza Zamani** as part of a technical assignment to demonstrate API integration, data transformation, scalable architecture, and clean coding in **TypeScript** using **NestJS**.

---

## 🚀 Features

- ✅ Data transformation from heterogeneous sources into a unified format
- ✅ Duplicate prevention based on `externalId + provider`
- ✅ Scheduled cron job for periodic data fetching
- ✅ REST API to fetch and filter job offers
- ✅ Pagination support
- ✅ PostgreSQL relational database
- ✅ Error handling with meaningful messages
- ✅ Unit & e2e tests with Jest and Supertest
- ✅ Dockerized for consistent environment

---

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Scheduling**: node-cron
- **HTTP**: Axios
- **Containerization**: Docker, Docker Compose
- **Testing**: Jest, Supertest

---

## ⚙️ Getting Started

### 🔧 Prerequisites

- Node.js (v20+)
- Docker
- Yarn or npm
- PostgreSQL (optional if running locally)

---

### 📦 Install Dependencies

```bash
yarn install
# or
npm install
```

---

### ▶️ Option 1: Run with Docker (Recommended)

```bash
cp .env.example .env
docker-compose up --build
```

---

### ▶️ Option 2: Run Locally

1. Install PostgreSQL and run:

```sql
CREATE USER jobadmin WITH PASSWORD 'securepassword';
CREATE DATABASE jobhub OWNER jobadmin;
```

2. Create and configure `.env` file:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=jobadmin
DB_PASSWORD=securepassword
DB_NAME=jobhub
CRON_SCHEDULE=*/1 * * * *
```

3. Run migration and start server:

```bash
npm run db:init
npm run start:dev
```

---

## 🌱 Environment Variables

See `.env.example` for full config.

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

---

## 🧠 API Documentation

**GET /api/job-offers**

- Query params:
    - `title`, `location`
    - `minSalary`, `maxSalary`
    - `page`, `limit`

Example:

```bash
curl "http://localhost:3000/api/job-offers?title=Engineer&location=Berlin&minSalary=60000&page=1&limit=10"
```

---

## 📆 Cron Job Scheduler

Scheduled with `node-cron`, runs based on `CRON_SCHEDULE` from `.env`.

---

## ❗ Error Handling

- Logs errors from APIs and database
- Returns structured JSON responses

---

## 📁 Project Structure

```
src/
├── app/
│   └── jobOffer/
│       ├── controllers/
│       ├── dto/
│       ├── entities/
│       ├── services/
├── common/
├── config/
├── database/
│   ├── migrations/
│   └── scripts/
├── cron/
├── main.ts
```

---

## 👤 Author

**MohammadReza Zamani**
