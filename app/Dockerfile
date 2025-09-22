# ==========================
# Stage 1: Build frontend
# ==========================
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Copy package.json and yarn.lock
COPY package*.json yarn.lock ./

# Install frontend dependencies (including devDependencies)
RUN yarn install --frozen-lockfile

# Copy frontend source and build
COPY ./client ./client
RUN yarn build --frozen-lockfile

# ==========================
# Stage 2: Build backend
# ==========================
FROM node:20-alpine AS backend-build

WORKDIR /app

# Copy backend package.json and yarn.lock
COPY server/package*.json yarn.lock ./

# Install backend dependencies (including devDependencies)
RUN yarn install --frozen-lockfile

# Copy backend source
COPY ./server ./server

# Copy built frontend into backend public folder
COPY --from=frontend-build /app/client/build ./server/public

# ==========================
# Stage 3: Production image
# ==========================
FROM node:20-alpine AS production

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy backend and built frontend
COPY --from=backend-build /app /app

# Install only production dependencies
RUN yarn install --frozen-lockfile 

# Expose port
EXPOSE 3000

# Run the app
CMD ["node", "server.js"]
