# Build stage
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Create a volume for node_modules
VOLUME ["/src/app/node_modules"]

# Create a volume for the app code
VOLUME ["/src/app"]

EXPOSE 8000

CMD ["npm", "run", "dev"]
