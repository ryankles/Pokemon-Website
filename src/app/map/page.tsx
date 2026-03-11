import { LocationSearch } from "@/components/search/LocationSearch";
import { MapView } from "@/components/map/MapView";

export default function MapPage() {
  return (
    <main className="map-page">
      <div className="map-page__canvas">
        <MapView />
        <header className="map-page__header">
          <div>
            <p className="eyebrow">Official vending API</p>
            <h1>Pokemon vending machine map</h1>
            <p className="map-page__lede">
              The map loads vending machines from the official Pokemon locator for the current map bounds only. Zoom in to fetch nearby machines without loading the full nationwide dataset.
            </p>
          </div>
          <LocationSearch />
        </header>
      </div>
    </main>
  );
}
