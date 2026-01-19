# Use an official lightweight Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /code

# Install dependencies
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the app code
COPY ./app /code/app

# WeChat Cloud Run expects the app to listen on port 80
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
