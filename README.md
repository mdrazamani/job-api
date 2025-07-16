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

> Developed as part of a technical assignment to demonstrate API integration, data transformation, scalable architecture, and clean coding in **TypeScript** using **NestJS**.

---

## 🚀 Features

- ✅ **Data transformation** from heterogeneous sources into a unified format
- ✅ **Duplicate prevention** based on `externalId + provider`
- ✅ **Scheduled cron job** for periodic data fetching
- ✅ **REST API** to fetch and filter job offers
- ✅ **Pagination support**
- ✅ **PostgreSQL** relational database
- ✅ **Error handling** with meaningful messages
- ✅ **Unit & e2e tests** with Jest and Supertest
- ✅ **Dockerized** for consistent environment

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

- [Node.js](https://nodejs.org/en) (v20+)
- [Docker](https://www.docker.com/)
- [Yarn](https://yarnpkg.com/) or npm

---

### 📦 Install Dependencies

```bash
yarn install
```
