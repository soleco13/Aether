#!/bin/bash

# Aether Production Deployment Script
# Server: 45.146.166.126
# Domains: aethers.ru, aetherhelp.store

set -e

echo "🚀 Starting Aether deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="aether"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.prod"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_error "This script should not be run as root"
        exit 1
    fi
}

# Check dependencies
check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    log_success "Dependencies check passed"
}

# Check environment file
check_env_file() {
    log_info "Checking environment configuration..."
    
    if [[ ! -f "$ENV_FILE" ]]; then
        log_error "Environment file $ENV_FILE not found!"
        log_info "Please copy env.prod.example to $ENV_FILE and fill in your values"
        exit 1
    fi
    
    # Check for placeholder values
    if grep -q "your-" "$ENV_FILE"; then
        log_warning "Found placeholder values in $ENV_FILE"
        log_info "Please update all 'your-*' values with actual configuration"
        exit 1
    fi
    
    log_success "Environment configuration check passed"
}

# Create SSL directories
setup_ssl_directories() {
    log_info "Setting up SSL directories..."
    
    sudo mkdir -p docker/ssl/aethers.ru
    sudo mkdir -p docker/ssl/aetherhelp.store
    sudo mkdir -p /var/www/certbot
    
    log_success "SSL directories created"
}

# Build and start services
deploy() {
    log_info "Building and starting services..."
    
    # Stop existing services
    docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE down || true
    
    # Remove old images
    docker image prune -f
    
    # Build and start services
    docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE build --no-cache
    docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE up -d
    
    log_success "Services deployed successfully"
}

# Wait for services to be ready
wait_for_services() {
    log_info "Waiting for services to be ready..."
    
    # Wait for database
    log_info "Waiting for database..."
    sleep 10
    
    # Check if services are running
    if docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE ps | grep -q "Up"; then
        log_success "Services are running"
    else
        log_error "Some services failed to start"
        docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE logs
        exit 1
    fi
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE exec -T app python manage.py migrate
    
    log_success "Database migrations completed"
}

# Collect static files
collect_static() {
    log_info "Collecting static files..."
    
    docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE exec -T app python manage.py collectstatic --noinput
    
    log_success "Static files collected"
}

# Create superuser (optional)
create_superuser() {
    read -p "Do you want to create a superuser? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE exec app python manage.py createsuperuser
    fi
}

# Show service status
show_status() {
    log_info "Service status:"
    docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE ps
    
    echo
    log_info "Service logs (last 20 lines):"
    docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE logs --tail=20
}

# Show SSL certificate instructions
show_ssl_instructions() {
    log_info "SSL Certificate Setup Instructions:"
    echo
    echo "1. Install Certbot:"
    echo "   sudo apt update && sudo apt install certbot python3-certbot-nginx"
    echo
    echo "2. Generate certificates for your domains:"
    echo "   sudo certbot certonly --webroot -w /var/www/certbot -d aethers.ru -d www.aethers.ru"
    echo "   sudo certbot certonly --webroot -w /var/www/certbot -d aetherhelp.store -d www.aetherhelp.store"
    echo
    echo "3. Copy certificates to Docker volumes:"
    echo "   sudo cp /etc/letsencrypt/live/aethers.ru/* docker/ssl/aethers.ru/"
    echo "   sudo cp /etc/letsencrypt/live/aetherhelp.store/* docker/ssl/aetherhelp.store/"
    echo
    echo "4. Restart nginx:"
    echo "   docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE restart nginx"
    echo
}

# Main deployment process
main() {
    log_info "🌌 Aether Production Deployment"
    echo "=================================="
    
    check_root
    check_dependencies
    check_env_file
    setup_ssl_directories
    deploy
    wait_for_services
    run_migrations
    collect_static
    create_superuser
    show_status
    
    echo
    log_success "🎉 Deployment completed successfully!"
    echo
    log_info "Your Aether installation is now running at:"
    log_info "- Main site: https://aethers.ru"
    log_info "- Admin panel: https://aethers.ru/admin/"
    log_info "- Authentication: https://aethers.ru/auth/"
    echo
    show_ssl_instructions
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "stop")
        log_info "Stopping services..."
        docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE down
        log_success "Services stopped"
        ;;
    "restart")
        log_info "Restarting services..."
        docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE restart
        log_success "Services restarted"
        ;;
    "logs")
        docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE logs -f
        ;;
    "status")
        show_status
        ;;
    "update")
        log_info "Updating deployment..."
        git pull
        docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE build --no-cache
        docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE up -d
        run_migrations
        collect_static
        log_success "Update completed"
        ;;
    *)
        echo "Usage: $0 {deploy|stop|restart|logs|status|update}"
        echo
        echo "Commands:"
        echo "  deploy  - Full deployment (default)"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  logs    - Show service logs"
        echo "  status  - Show service status"
        echo "  update  - Update deployment from Git"
        exit 1
        ;;
esac 