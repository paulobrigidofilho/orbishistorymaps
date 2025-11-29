# Orbis History Maps

Orbis History Maps is a personal project that uses interactive maps to tell stories from history. The goal is to visualize historical events, journeys, and cultural developments in a spatial and engaging way, making history more accessible and immersive.

## Features

- **Interactive Maps:** Explore historical events and narratives through dynamic, user-friendly maps.
- **User Profiles:** Register, log in, and manage your own profile and contributions.
- **Gallery & Shop:** Browse curated map galleries and access a shop for related resources or merchandise.
- **Custom Storytelling:** Each map is designed to highlight specific historical themes, periods, or journeys.
- **Modern Tech Stack:** Built with React (frontend), Node.js/Express (backend), and MySQL for data storage.

## Getting Started

### Prerequisites

- Node.js and npm installed
- MySQL database set up

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd orbis
   ```

2. **Backend setup:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   - Configure your `.env` file for database credentials.

3. **Frontend setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the app:**
   - Open your browser at [http://localhost:5173](http://localhost:5173)

## Project Structure

- **frontend/** – React app for the user interface and map interactions
- **backend/** – Express server, REST API, authentication, and database logic

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT License

---
Orbis History Maps – Bringing history to life, one map at a time.

# Orbis Application

## Docker Networking

### Internal Communication (Container-to-Container)
- **Backend → Database**: Uses service name `db:3306` (internal Docker network)
- **Frontend → Backend**: Uses service name `backend:4000` (proxied by Vite)

### External Access (Host-to-Container)
- **Host → Database**: `localhost:3307` (for DB inspection tools like MySQL Workbench)
- **Host → Backend**: `localhost:4000` (API access from host)
- **Host → Frontend**: `localhost:5173` (web browser access)

**Note**: Port 3307 mapping is for host convenience only. Backend never uses it.
