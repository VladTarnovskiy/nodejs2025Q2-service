# Stage 1: Build
FROM node:22.14.0-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Prisma schema
COPY prisma ./prisma/

# Install dependencies
RUN npm ci && npm cache clean --force

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:22.14.0-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force
# Copy dependencies needed for prisma.config.ts
COPY --from=builder /app/node_modules/dotenv ./node_modules/dotenv
COPY --from=builder /app/node_modules/dotenv-expand ./node_modules/dotenv-expand

# Copy Prisma schema and config
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy documentation
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/doc ./doc

# Expose the application port
EXPOSE 4000

# Run migrations and start the application
CMD ["sh", "-c", "npm run start:prod:docker"]