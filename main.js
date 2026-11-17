import { MapelevenMap, hosted } from "https://mapeleven.dev/sdk/web/0.2.0/mapeleven.js";

// 1. The map. hosted() covers Jordan and the GCC; use selfHosted("https://your.server") for your own.
const map = new MapelevenMap("map", {
  provider: hosted(),
  language: "ar",
  center: [35.9106, 31.9539], // [longitude, latitude]: Amman
  zoom: 13,
  controls: { navigation: true, locate: true },
  workerUrl: "https://cdn.jsdelivr.net/npm/maplibre-gl@6.16.0/dist/maplibre-gl-worker.mjs",
});

// 2. Your own data: a clustered layer of points with a click handler.
await map.ready;
map.addGeoJSON(
  "branches",
  {
    type: "FeatureCollection",
    features: [
      [35.8722, 31.9566, "Branch 1"],
      [35.9106, 31.9539, "Branch 2"],
      [35.8389, 31.9866, "Branch 3"],
      [35.9284, 31.9732, "Branch 4"],
    ].map(([lng, lat, name]) => ({ type: "Feature", properties: { name }, geometry: { type: "Point", coordinates: [lng, lat] } })),
  },
  { cluster: true, color: "#0F766E", onClick: (f) => alert(f.properties.name) },
);

// 3. Search as you type, ranked near the map centre.
const q = document.getElementById("q");
const results = document.getElementById("results");
let timer, controller, marker;

q.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    controller?.abort();
    controller = new AbortController();
    const text = q.value.trim();
    if (text.length < 2) return (results.hidden = true);
    const c = map.map.getCenter();
    try {
      const places = await map.search.search(text, { language: map.language, near: { lat: c.lat, lng: c.lng }, limit: 6, signal: controller.signal });
      results.replaceChildren(...places.map((p) => item(p.name, p.address, () => show(p))));
      results.hidden = places.length === 0;
    } catch (e) {
      if (e.name !== "AbortError") console.error(e);
    }
  }, 250);
});

function show(place) {
  results.hidden = true;
  marker?.remove();
  marker = map.addMarker([place.lng, place.lat], { color: "#DC2626", popup: place.label });
  if (place.bbox) map.fitBounds(place.bbox, 60);
  else map.flyTo([place.lng, place.lat], 16);
}

// 4. Reverse geocoding: what is under the centre when the map stops moving.
const here = document.getElementById("here");
async function describeCentre() {
  const c = map.map.getCenter();
  const place = await map.search.reverse(c.lat, c.lng, { language: map.language }).catch(() => null);
  here.hidden = !place;
  if (place) here.textContent = place.label;
}
map.map.on("moveend", describeCentre);

// 5. Arabic / English, switched at runtime (markers and layers are kept).
document.getElementById("lang").addEventListener("click", async (e) => {
  const next = map.language === "ar" ? "en" : "ar";
  e.target.textContent = next === "ar" ? "EN" : "ع";
  document.documentElement.lang = next;
  document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  q.placeholder = next === "ar" ? "ابحث عن مكان" : "Search places";
  await map.setLanguage(next);
  describeCentre();
});

function item(title, subtitle, onClick) {
  const li = document.createElement("li");
  const strong = document.createElement("strong");
  const span = document.createElement("span");
  strong.textContent = title;
  span.textContent = subtitle;
  li.append(strong, span);
  li.addEventListener("click", onClick);
  return li;
}
