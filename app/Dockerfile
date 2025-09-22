# ==========================
# Stage 1: Build frontend
# ==========================
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy frontend source and build
COPY ./ ./
RUN npm run build

# ==========================
# Stage 2: Build backend
# ==========================
FROM node:20-alpine AS backend-build

WORKDIR /app

# Install dependencies
COPY server/package*.json ./
RUN npm ci

# Copy backend source
COPY ./ ./

# Copy built frontend into backend public folder
COPY --from=frontend-build /app/client/build ./public

# ==========================
# Stage 3: Production image
# ==========================
FROM node:20-alpine AS production

WORKDIR /app

# Copy backend + frontend build
COPY --from=backend-build /app .

# Set production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Install only production dependencies
RUN npm ci --omit=dev

# Run the app
CMD ["node", "server.js"]
