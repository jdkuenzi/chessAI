# Install dependencies only when needed
FROM node:16-alpine AS deps
WORKDIR /app
COPY ./chess-ai/package.json ./
RUN npm install

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY ./chess-ai ./
COPY --from=deps /app/node_modules ./node_modules

# Development image, copy all the files and run
FROM node:16-alpine AS runner
WORKDIR /app
ENV NODE_ENV development
COPY --from=builder /app ./
CMD ["npm", "start"]
