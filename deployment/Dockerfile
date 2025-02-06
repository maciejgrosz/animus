# Dockerfile
FROM python:3.9-slim

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Copy and install Python dependencies from the repository root
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire repository (build context) into the container
COPY . /app/

# Expose the port that Gunicorn will use
EXPOSE 8000

# Start Gunicorn with 3 worker processes serving your Flask app
CMD ["gunicorn", "--workers", "3", "--bind", "0.0.0.0:8000", "-m", "007", "app:app"]
