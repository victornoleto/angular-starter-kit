# Desenvolvimento Frontend

## Nginx

Editar arquivo de configuração do nginx: `sudo nano /etc/nginx/sites-enabled/starter-kit-app`

```
server {
    listen 80;
    server_name app.starter-kit.local;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name app.starter-kit.local;
    root /var/www/angular-starter-kit/dist/browser;

    ssl_certificate /etc/nginx/ssl/starter-kit.local+1.pem;
    ssl_certificate_key /etc/nginx/ssl/starter-kit.local+1-key.pem;

    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        access_log off;
        add_header Cache-Control "public";
    }
}
```