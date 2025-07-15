# Angular

O angular 20 removeu o sufixo que indicava qual era o tipo daquela classe. Para adicionar novamente basta ajustar o `angular.json` da seguinte forma:

```json
{
  "projects": {
    "app": {
      ...
      "schematics": {
        "@schematics/angular:component": {
            "type": "component",
            "style": "scss"
        },
        "@schematics/angular:directive": { "type": "directive" },
        "@schematics/angular:service": { "type": "service" },
        "@schematics/angular:guard": { "typeSeparator": "." },
        "@schematics/angular:interceptor": { "typeSeparator": "." },
        "@schematics/angular:module": { "typeSeparator": "." },
        "@schematics/angular:pipe": { "typeSeparator": "." },
        "@schematics/angular:resolver": { "typeSeparator": "." }
      },
  ...
}
```

Leitura recomendada:
- https://www.reddit.com/r/Angular2/comments/1l9iq1s/angular_20_removing_suffixes_from_components/
- https://www.reddit.com/r/Angular2/comments/1kzh729/angular_20_cli_generates_userts_instead_of/

# Nginx

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