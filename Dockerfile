# ==============================================================================
# Dockerfile - DevOps Learning Journey Static Website
# Uses official Nginx Alpine image for minimal size and high performance
# ==============================================================================

FROM nginx:1.25-alpine

# Set maintainer metadata
LABEL maintainer="DevOps Learning Journey" \
      description="Static web server for DevOps Learning Journey portfolio" \
      version="1.0.0"

# Remove default Nginx welcome assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static website assets to Nginx web root directory
COPY . /usr/share/nginx/html/

# Expose HTTP port 80
EXPOSE 80

# Optional container healthcheck to verify web server status
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
