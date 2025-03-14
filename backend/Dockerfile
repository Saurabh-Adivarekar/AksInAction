# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed dependencies
RUN npm install

# Bundle the app source inside the Docker image
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Define environment variable for MySQL connection
ENV MYSQL_HOST mysql
ENV MYSQL_USER root
ENV MYSQL_PASSWORD mysecurepassword
ENV MYSQL_DB names_db

# Run the app
CMD ["node", "app.js"]
