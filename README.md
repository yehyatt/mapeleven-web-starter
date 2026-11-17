# Mapeleven web starter

A complete map page in three files and no build step: an Arabic-first map of Amman on [Mapeleven](https://mapeleven.dev), search as you type, a clustered layer of your own points, reverse geocoding of the map centre, and an Arabic / English switch.

```bash
git clone https://github.com/yehyatt/mapeleven-web-starter
cd mapeleven-web-starter
python3 -m http.server 8080     # or any static server; ES modules need http://, not file://
```

Open http://localhost:8080.

## What to change first

| Where | What |
|---|---|
| `main.js`, `provider: hosted()` | `selfHosted("https://maps.example.com")` once you run [your own server](https://mapeleven.dev/docs/self-hosting.html) |
| `main.js`, `center` / `zoom` | Your city. Coordinates are `[longitude, latitude]` |
| `main.js`, `branches` | Your stores, branches or drivers, as GeoJSON |
| `style.css` | Colours and layout |

## Using a bundler instead

With Vite, webpack or similar, install the packages and import them:

```bash
npm install mapeleven maplibre-gl
```

```js
import { MapelevenMap, hosted } from "mapeleven";
import "mapeleven/style.css";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url"; // Vite
```

See the [web guide](https://mapeleven.dev/docs/web.html).

## Licences

MIT. Map data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright) (ODbL): keep the attribution button visible.
