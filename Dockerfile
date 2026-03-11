# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build argument for Google AdSense
ARG VITE_GOOGLE_ADSENSE_CLIENT_ID
ENV VITE_GOOGLE_ADSENSE_CLIENT_ID=$VITE_GOOGLE_ADSENSE_CLIENT_ID

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
