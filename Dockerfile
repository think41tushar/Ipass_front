# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3000

# Command to start the production server
CMD ["npm", "run", "start"]
