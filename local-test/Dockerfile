# Use an official Python runtime as a parent image
FROM python:3.9-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container (from the parent directory)
COPY requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code (from the parent directory)
COPY . /app/

# Expose port 8000
EXPOSE 8000

# Use Gunicorn to serve the Flask app.
CMD ["gunicorn", "--workers", "3", "--bind", "0.0.0.0:8000", "-m", "007", "app:app"]
