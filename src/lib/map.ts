export function getPublicMapToken() {
  return process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
}

export function getMapProvider() {
  return process.env.MAP_PROVIDER ?? "mapbox";
}
