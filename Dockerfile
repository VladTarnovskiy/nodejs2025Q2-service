
FROM node:22.14.0-alpine

# Set working directory
WORKDIR /app

# Copy package.json
COPY package*.json ./

COPY prisma ./prisma/
RUN npm ci && npm cache clean --force
RUN npx prisma generate
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "run", "start:prod:docker"]
