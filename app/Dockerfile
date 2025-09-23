# Stage 1: Build the Go backend
FROM golang:1.21-alpine AS backend-builder

# Install git and make
RUN apk add --no-cache git make

# Set working directory
WORKDIR /app/server

# Copy go modules manifests
COPY server/go.mod server/go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the source code
COPY server/ ./

# Build the backend
RUN go build -o /app/focalboard ./server

# Stage 2: Build the React frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/webapp

# Copy frontend code
COPY webapp ./webapp

# Install dependencies and build
RUN npm install --legacy-peer-deps
RUN npm run build

# Stage 3: Create the final runtime image
FROM alpine:latest

# Install required runtime dependencies
RUN apk add --no-cache ca-certificates

WORKDIR /app

# Copy backend binary
COPY --from=backend-builder /app/bin/focalboard /app/focalboard

# Copy frontend build
COPY --from=frontend-builder /app/webapp/build ./webapp/build

# Expose port
EXPOSE 8000

# Run the application
CMD ["/app/focalboard", "--config", "/app/config.json"]
