# BOL Template

Vue 3/Vite app for generating BOL documents from editable product catalogs.

## Local Development

Run the catalog API in one terminal:

```sh
npm run api
```

Run Vite in another terminal:

```sh
npm run dev
```

Vite proxies `/api` to `http://localhost:4174`. Catalog edits are written to `data/products.json`.

## Production

`deploy.sh` deploys the built Vue app to `/var/www/bol-app`, the Node API file to `/var/www/bol-api`, and seeds `/var/www/bol-app-data/products.json` only if it does not already exist. The data file is outside `dist/`, so product edits are not removed by the app deploy.

Run the API with:

```sh
CATALOG_DATA_FILE=/var/www/bol-app-data/products.json CATALOG_API_PORT=4174 node /var/www/bol-api/catalog-api.mjs
```

Configure nginx to serve the built app and proxy `/api` to `http://127.0.0.1:4174`.
