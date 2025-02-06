# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Prevent Python from writing .pyc files and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file from the repository root into the container
COPY requirements.txt /app/

# Install dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
# This copies everything from the repository root into /app
COPY . /app/

# Expose port 8000 which Gunicorn will listen on
EXPOSE 8000

# Start Gunicorn to serve the Flask app.
# This assumes your Flask app is defined in app.py with an application instance named "app"
CMD ["gunicorn", "--workers", "3", "--bind", "0.0.0.0:8000", "-m", "007", "app:app"]

