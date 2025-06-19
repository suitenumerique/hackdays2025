FROM python:3.10-slim


# Set up working directory
WORKDIR /all-in-one


# Copy requirements and install dependencies
COPY requirements_2.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .
WORKDIR /all-in-one/backend

# Expose port
EXPOSE 5002

# Run the application
CMD ["python", "api.py"]
