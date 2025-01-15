# Use official Python image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy dependencies and app files
COPY requirements.txt requirements.txt
COPY app.py app.py

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose Flask's default port
EXPOSE 5001

# Run the application
CMD ["python", "app.py"]
