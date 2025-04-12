# ========== Builder stage ==========
FROM node:18 AS builder
WORKDIR /app

# Copy package.json and lock file first to install dependencies
COPY ../package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the project files
COPY ../ ./

# Build the React app
RUN npm run build

# ========== Output stage (used in docker-compose via volume) ==========
FROM alpine AS output
WORKDIR /output
COPY --from=builder /app/dist ./
