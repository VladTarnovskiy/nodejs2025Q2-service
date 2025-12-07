
# Use Node.js 20.11.1 base image
FROM node:22.14.0-alpine

# Set working directory
WORKDIR /app

# Copy package.json
COPY package*.json ./

COPY prisma ./prisma/
RUN npm install && npm cache clean --force
COPY . .
EXPOSE 4000
CMD ["npm", "run", "start:dev:docker"]
