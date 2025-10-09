###############################
# Stage 1: install dependencies
###############################
FROM node:22-alpine AS deps
WORKDIR /app
# For some native modules compatibility
RUN apk add --no-cache libc6-compat
COPY package*.json ./
# Use clean, reproducible install
RUN npm ci

###############################
# Stage 2: build the app
###############################
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Accept API base URL at build time so Next.js rewrites have a defined destination
ARG NEXT_PUBLIC_API_SERVICE_URL
ENV NEXT_PUBLIC_API_SERVICE_URL=$NEXT_PUBLIC_API_SERVICE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build Next (emits .next/standalone when output: 'standalone' is set)
RUN npm run build

###############################
# Stage 3: production runtime
###############################
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0
# Create and use non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Static assets
COPY --from=builder /app/public ./public
# Standalone server and required files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER 1001
EXPOSE 3001
CMD ["node", "server.js"]
