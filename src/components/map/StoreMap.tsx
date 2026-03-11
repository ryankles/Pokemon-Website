"use client";

import type { CSSProperties } from "react";
import { useState, useCallback, useRef } from "react";
import Map, { Marker, NavigationControl, Popup, type MapRef } from "react-map-gl/mapbox";
import { getPublicMapToken } from "@/lib/map";
import type { Store } from "@/types/store";
import "mapbox-gl/dist/mapbox-gl.css";

const DEFAULT_VIEW_STATE = {
  latitude: 34.0522,
  longitude: -118.2437,
  zoom: 7,
};

type MapBounds = {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
  zoom: number;
};

type StoreMapProps = {
  stores: Store[];
  showMarkers?: boolean;
  activeStoreId?: string | null;
  onStoreSelect?: (id: string | null) => void;
  onViewportChange?: (bounds: MapBounds) => void;
};

const PLACE_TYPE_COLOR: Record<string, string> = {
  lgs: "#f06b3c",
  big_box: "#4a90d9",
  vending: "#a855f7",
  event: "#22c55e",
};

export function StoreMap({
  stores,
  showMarkers = true,
  activeStoreId,
  onStoreSelect,
  onViewportChange,
}: StoreMapProps) {
  const [popupStore, setPopupStore] = useState<Store | null>(null);
  const mapRef = useRef<MapRef | null>(null);

  const handleMarkerClick = useCallback((store: Store) => {
    setPopupStore(store);
    onStoreSelect?.(store.id);
  }, [onStoreSelect]);

  const handlePopupClose = useCallback(() => {
    setPopupStore(null);
    onStoreSelect?.(null);
  }, [onStoreSelect]);

  const reportViewport = useCallback(() => {
    const map = mapRef.current?.getMap();

    if (!map) {
      return;
    }

    const bounds = map.getBounds();

    onViewportChange?.({
      swLat: bounds.getSouthWest().lat,
      swLng: bounds.getSouthWest().lng,
      neLat: bounds.getNorthEast().lat,
      neLng: bounds.getNorthEast().lng,
      zoom: map.getZoom(),
    });
  }, [onViewportChange]);

  return (
    <section className="store-map" aria-label="Store map">
      <Map
        ref={mapRef}
        mapboxAccessToken={getPublicMapToken()}
        initialViewState={DEFAULT_VIEW_STATE}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        onLoad={reportViewport}
        onMoveEnd={reportViewport}
      >
        <NavigationControl position="top-right" />

        {showMarkers ? stores.map((store) => {
          const isActive = activeStoreId === store.id;
          const color = PLACE_TYPE_COLOR[store.placeType] ?? "#f06b3c";
          return (
            <Marker
              key={store.id}
              latitude={store.latitude}
              longitude={store.longitude}
              anchor="bottom"
              onClick={() => handleMarkerClick(store)}
            >
              <div
                className={`map-marker map-marker--${store.placeType}${isActive ? " is-active" : ""}`}
                title={store.name}
                style={{ "--marker-color": color } as CSSProperties}
              >
                <span className="map-marker__core" aria-hidden="true">
                  {store.placeType === "vending" ? "V" : ""}
                </span>
              </div>
            </Marker>
          );
        }) : null}

        {popupStore && (
          <Popup
            latitude={popupStore.latitude}
            longitude={popupStore.longitude}
            anchor="bottom"
            offset={28}
            onClose={handlePopupClose}
            closeOnClick={false}
            style={{ maxWidth: 240 }}
          >
            <div style={{ padding: "4px 2px" }}>
              <p style={{ margin: "0 0 2px", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#f06b3c" }}>
                {popupStore.placeTypeLabel}
              </p>
              <strong style={{ fontSize: "1rem", display: "block" }}>{popupStore.name}</strong>
              <span style={{ fontSize: "0.85rem", color: "#888" }}>
                {popupStore.addressLine1}, {popupStore.city}
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                {popupStore.hasSingles && <span style={{ fontSize: "0.75rem", padding: "3px 8px", borderRadius: 999, background: "rgba(240,107,60,0.18)", color: "#ffae90" }}>Singles</span>}
                {popupStore.hostsEvents && <span style={{ fontSize: "0.75rem", padding: "3px 8px", borderRadius: 999, background: "rgba(240,107,60,0.18)", color: "#ffae90" }}>Events</span>}
                {popupStore.hasSealed && <span style={{ fontSize: "0.75rem", padding: "3px 8px", borderRadius: 999, background: "rgba(240,107,60,0.18)", color: "#ffae90" }}>Sealed</span>}
              </div>
              {popupStore.distanceMiles > 0 ? (
                <p style={{ margin: "6px 0 0", fontSize: "0.82rem", color: "#888" }}>
                  {popupStore.distanceMiles} mi away
                </p>
              ) : null}
            </div>
          </Popup>
        )}
      </Map>
    </section>
  );
}
