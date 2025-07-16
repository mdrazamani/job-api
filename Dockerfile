# Stage 1: Build
FROM node:20.17.0-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20.17.0-alpine AS runner
WORKDIR /app

# Install needed packages for runtime
RUN apk add --no-cache curl

# Copy built files and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy and allow script execution
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000
ENV NODE_ENV=production

# Run the app through entrypoint
CMD ["sh", "./entrypoint.sh"]
