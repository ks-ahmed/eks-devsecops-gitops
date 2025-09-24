# Use official Python slim image for smaller attack surface
FROM python:3.11-alpine

# Set working directory
WORKDIR /app

# Copy app files
COPY app/ /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup
USER appuser


# Expose port
EXPOSE 5000

# Run Flask API
CMD ["python", "main.py"]
