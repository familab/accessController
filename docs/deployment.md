# Deployment Process

## Server 
1. Compile NodeJS app
2. Build Docker image
3. Publish Docker image to GitHub registry
4. Copy `docker-compose.yml` file to server
5. Run `docker compose up` command on server

## NFC Card Reader
1. Compile NFC app (?)
2. Flash to NFC reader
3. ...
4. Profit!
