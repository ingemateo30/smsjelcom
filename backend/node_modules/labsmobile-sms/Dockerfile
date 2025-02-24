# Use an official PHP image as a starting point
FROM node:21.5.0-alpine

# Set the working directory to the root of your project
WORKDIR /app

# Copy the composer.json and composer.lock file to the container
COPY package.json ./

# Install the dependencies
RUN npm install

# Copy the rest of your application to the container
COPY . .

# Default command to run when container starts
CMD ["node"]
