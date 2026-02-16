# Smart Lodging System - Docker Startup Guide

## Current Status
Docker daemon is not currently running on your system. The `docker` CLI is installed but the `dockerd` daemon is not available.

## To Start the System

### Option 1: Start Docker Daemon (if available on your system)

```bash
# Check if Docker can be started
sudo systemctl start docker

# Or if using Docker Desktop on macOS/Windows
# Open Docker Desktop application

# Verify Docker is running
docker ps
```

### Option 2: Full Startup Command

Once Docker daemon is running, use:

```bash
# From the project root directory
cd /home/rennie/Desktop/projects/smart\ lodging

# Start all services in detached mode
sudo docker-compose up -d

# Or with build (if images need updating)
sudo docker-compose up -d --build
```

### Option 3: Monitor Startup

```bash
# View container status
sudo docker-compose ps

# View logs in real-time
sudo docker-compose logs -f

# View specific service logs
sudo docker-compose logs -f backend
sudo docker-compose logs -f mongodb
sudo docker-compose logs -f ml-service
sudo docker-compose logs -f frontend
```

## Expected Services

Once running, the system will have:

- **MongoDB**: Database on port 27017
  - Credentials: admin / password
  - Connection: `mongodb://admin:password@mongodb:27017/smart_lodging?authSource=admin`

- **Backend**: Express API on port 5000
  - Health check: `http://localhost:5000/health`
  - API routes: `http://localhost:5000/api/*`

- **ML Service**: Python ML API on port 8000
  - Health check: `http://localhost:8000/health`

- **Frontend**: React UI on port 3000
  - Access: `http://localhost:3000`

## Troubleshooting

### Docker Daemon Not Running
```bash
# Check daemon status
sudo systemctl status docker

# Start daemon
sudo systemctl start docker

# Enable auto-start
sudo systemctl enable docker
```

### Permission Issues
If you get permission denied errors:
```bash
# Add user to docker group (requires logout/login)
sudo usermod -aG docker $USER
newgrp docker
```

### Clear Everything
```bash
# Stop all containers
sudo docker-compose down

# Remove volumes (loses data)
sudo docker-compose down -v

# Clean up images
sudo docker system prune
```

## Next Steps

1. Ensure Docker daemon is running
2. Run: `sudo docker-compose up -d`
3. Wait 30 seconds for services to start
4. Check health: `curl http://localhost:5000/health`
5. Access UI: Open browser to `http://localhost:3000`
