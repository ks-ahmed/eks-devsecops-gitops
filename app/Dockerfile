# ==========================
# Stage 1: Build frontend
# ==========================
FROM node:20-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json client/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY client/ ./
RUN yarn build

# ==========================
# Stage 2: Build backend
# ==========================
FROM node:20-alpine AS backend-build
WORKDIR /app/server
COPY server/package*.json server/yarn.lock ./
RUN yarn install --frozen-lockfile 
COPY server/ ./
COPY --from=frontend-build /app/client/build ./public

# ==========================
# Stage 3: Production image
# ==========================
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=backend-build /app/server ./
EXPOSE 3000
CMD ["node", "server.js"]
