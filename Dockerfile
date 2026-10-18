# ==============================================================================
# Multi-Stage Dockerfile for Angular Standalone Frontend
# ==============================================================================

# Stage 1: Build Angular Application
FROM node:20-alpine AS builder

WORKDIR /app

ENV NODE_ENV=development

# Install dependencies with caching
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Build production bundle
RUN npm run build -- --configuration production


# Stage 2: Serve via Nginx
FROM nginx:1.27-alpine AS runner

# Remove default Nginx configuration and static assets
RUN rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production build artifacts from builder stage (Angular 18+ browser build output)
COPY --from=builder /app/dist/restaurant-frontend/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=20s --timeout=3s --retries=3 \
    CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
