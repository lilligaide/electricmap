# Deployment Guide

This guide explains how to deploy the EV Charging Finder application in different environments.

## Prerequisites

- Docker and Docker Compose installed
- Access to a container registry (GitHub Container Registry)
- Domain name and SSL certificates
- Access to deployment environment

## Environment Setup

1. Create environment files:
   ```bash
   # .env.staging
   NODE_ENV=staging
   API_URL=https://api.staging.electricmap.yourdomain.com
   
   # .env.production
   NODE_ENV=production
   API_URL=https://api.electricmap.yourdomain.com
   ```

2. Set up SSL certificates:
   ```bash
   # Using Let's Encrypt
   certbot certonly --nginx -d electricmap.yourdomain.com
   ```

## Deployment Methods

### 1. Manual Deployment

```bash
# Build the Docker image
docker build -t ev-charging-finder .

# Run the container
docker run -d \
  --name ev-charging-finder \
  -p 3000:80 \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  --env-file .env.production \
  ev-charging-finder
```

### 2. Using Docker Compose

```bash
# Start the application
docker compose -f docker-compose.yml up -d

# View logs
docker compose logs -f

# Stop the application
docker compose down
```

### 3. Using GitHub Actions (Recommended)

The repository includes GitHub Actions workflows for automated deployment:

1. Push to `main` branch triggers staging deployment
2. Manual trigger required for production deployment
3. Automated tests run before deployment
4. Notifications sent on deployment status

## Monitoring and Maintenance

1. Health Checks:
   - Application health: `http://localhost:3000/health`
   - Container health: `docker ps`

2. Logs:
   ```bash
   # View application logs
   docker logs -f ev-charging-finder
   
   # View nginx logs
   docker exec ev-charging-finder tail -f /var/log/nginx/access.log
   ```

3. Backup:
   ```bash
   # Backup container data
   docker run --rm --volumes-from ev-charging-finder \
     -v $(pwd):/backup alpine tar cvf /backup/backup.tar /data
   ```

## Rollback Procedure

1. Using Docker tags:
   ```bash
   # List available versions
   docker images ev-charging-finder
   
   # Roll back to previous version
   docker stop ev-charging-finder
   docker run -d --name ev-charging-finder-old \
     -p 3000:80 ev-charging-finder:previous-tag
   ```

2. Using GitHub Actions:
   - Go to Actions tab
   - Find the last successful deployment
   - Re-run the workflow

## Security Considerations

1. Environment Variables:
   - Never commit .env files
   - Use GitHub Secrets for sensitive data
   - Rotate API keys regularly

2. Access Control:
   - Use HTTPS only
   - Set up proper firewall rules
   - Implement rate limiting

3. Monitoring:
   - Set up error tracking (e.g., Sentry)
   - Configure uptime monitoring
   - Enable security scanning

## Troubleshooting

Common issues and solutions:

1. Container won't start:
   - Check logs: `docker logs ev-charging-finder`
   - Verify environment variables
   - Check port availability

2. SSL issues:
   - Verify certificate paths
   - Check certificate expiration
   - Validate nginx configuration

3. Performance issues:
   - Monitor resource usage
   - Check application logs
   - Review nginx access logs

## Support

For deployment issues:
1. Check the troubleshooting guide
2. Review GitHub Issues
3. Contact the maintainers 