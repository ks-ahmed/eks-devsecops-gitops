# ==========================
# Stage 1: Build frontend
# ==========================
FROM node:20-alpine AS frontend-build

WORKDIR /app/client

# Install frontend dependencies
COPY client/package*.json ./
RUN npm ci

# Copy frontend source and build
COPY client/ ./
RUN npm run build

# ==========================
# Stage 2: Build backend
# ==========================
FROM node:20-alpine AS backend-build

WORKDIR /app/server

# Install backend dependencies (production only)
COPY server/package*.json ./
RUN npm ci --omit=dev

# Copy backend source
COPY server/ ./

# Copy built frontend into backend public folder
COPY --from=frontend-build /app/client/build ./public

# ==========================
# Stage 3: Production image
# ==========================
FROM node:20-alpine AS production

WORKDIR /app

# Copy backend + built frontend
COPY --from=backend-build /app/server ./

ENV NODE_ENV=production
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
