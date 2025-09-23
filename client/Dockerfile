# Stage 1: Build static frontend (optional if using a framework like React)
# Using plain HTML/CSS here, so no build step needed

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy static files
COPY src/ /usr/share/nginx/html

# Expose port
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
