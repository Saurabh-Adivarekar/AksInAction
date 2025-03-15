# Use the official Node.js image for building the app
FROM node:16 as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the React app
RUN npm run build

# Use a lighter image to serve the app (serve is a static file server)
FROM node:16-slim

WORKDIR /app

# Install 'serve' to serve the build folder
RUN npm install -g serve

# Copy the build folder from the previous image
COPY --from=build /app/build /app/build

# Expose port 3000 (or whatever port you want to use)
EXPOSE 8080

# Serve the React build
CMD ["serve", "-s", "build", "-l", "8080"]
