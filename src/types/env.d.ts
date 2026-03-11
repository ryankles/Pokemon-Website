declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL?: string;
    NEXT_PUBLIC_MAPBOX_TOKEN?: string;
    MAP_PROVIDER?: "mapbox";
  }
}
