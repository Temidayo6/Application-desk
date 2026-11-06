# Application Desk

An internship application tracker built with React, Java Spring Boot, and an H2 SQL database.

## Features

- Add applications with a company and role.
- Track Saved, Applied, Interview, Offer, and Closed statuses.
- Search applications by company or role.
- Update statuses and delete applications.
- Store records in a file-based SQL database.
- Display loading states and request errors.

## How it works

The React frontend sends HTTP requests to the Java REST API. The backend uses Spring JDBC and SQL queries to read and change application records.

During development, Vite forwards /api requests to the backend on port 8080.

## Run locally

Run these commands from the repository root.

Start the backend in one terminal:

    mvn -f backend/pom.xml spring-boot:run

Install frontend dependencies:

    npm --prefix front ci

Start the frontend in a separate terminal:

    npm --prefix front run dev -- --host 0.0.0.0

Open the frontend on port 5173. In GitHub Codespaces, use the forwarded port's browser link.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | /api/health | Check the backend |
| GET | /api/applications | List applications |
| POST | /api/applications | Create an application |
| PUT | /api/applications/{id} | Update an application |
| DELETE | /api/applications/{id} | Delete an application |

## Verification

Manually checked adding, listing, changing status, and deleting through the connected frontend. Changes remained after refreshing the page.

The frontend production build passed:

    npm --prefix front run build

## Current scope

This is a development project with one shared application list and no user authentication. Public deployment and automated tests are not yet included.

The Vite API proxy is for development. A production deployment also needs routing from /api to the backend.

Database files, generated backend files, and backups are excluded from Git.
