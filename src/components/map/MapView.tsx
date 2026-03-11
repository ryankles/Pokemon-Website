"use client";

import { useEffect, useRef, useState } from "react";
import { StoreMap } from "./StoreMap";
import { StoreCard } from "@/components/store/StoreCard";
import type { Store } from "@/types/store";

const VENDING_FETCH_MIN_ZOOM = 7;

type MapBounds = {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
  zoom: number;
};

function toVendingStore(machine: {
  id: string;
  lat: number;
  lng: number;
  retailer: string;
  street: string;
  city: string;
  zipPostalCode: string;
  stateProvince: string;
}): Store {
  return {
    id: machine.id,
    name: `${machine.retailer} Vending Machine`,
    addressLine1: machine.street,
    city: machine.city,
    stateRegion: machine.stateProvince,
    postalCode: machine.zipPostalCode,
    distanceMiles: 0,
    placeType: "vending",
    placeTypeLabel: "Vending machine",
    hasSealed: true,
    hasSingles: false,
    hostsEvents: false,
    latitude: machine.lat,
    longitude: machine.lng,
  };
}

export function MapView() {
  const [stores, setStores] = useState<Store[]>([]);
  const [activeStoreId, setActiveStoreId] = useState<string | null>(null);
  const [showVendingMachines, setShowVendingMachines] = useState(true);
  const [showMapMarkers, setShowMapMarkers] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastBoundsKeyRef = useRef<string | null>(null);
  const canLoadVendingMachines = Boolean(
    showVendingMachines &&
      mapBounds &&
      mapBounds.zoom >= VENDING_FETCH_MIN_ZOOM,
  );

  useEffect(() => {
    if (!showVendingMachines) {
      abortControllerRef.current?.abort();
      lastBoundsKeyRef.current = null;
      return;
    }

    if (!mapBounds) {
      return;
    }

    if (mapBounds.zoom < VENDING_FETCH_MIN_ZOOM) {
      abortControllerRef.current?.abort();
      lastBoundsKeyRef.current = null;
      return;
    }

    const boundsKey = [
      mapBounds.swLat.toFixed(3),
      mapBounds.swLng.toFixed(3),
      mapBounds.neLat.toFixed(3),
      mapBounds.neLng.toFixed(3),
      mapBounds.zoom.toFixed(2),
    ].join(":");

    if (lastBoundsKeyRef.current === boundsKey) {
      return;
    }

    lastBoundsKeyRef.current = boundsKey;
    abortControllerRef.current?.abort();
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const params = new URLSearchParams({
      swLat: String(mapBounds.swLat),
      swLng: String(mapBounds.swLng),
      neLat: String(mapBounds.neLat),
      neLng: String(mapBounds.neLng),
    });

    fetchTimeoutRef.current = setTimeout(() => {
      void (async () => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
          const response = await fetch(`/api/vending-machines?${params.toString()}`, {
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error("Official vending API request failed.");
          }

          const payload = await response.json();
          const machines = Array.isArray(payload.machines) ? payload.machines : [];
          setStores(machines.map(toVendingStore));
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            return;
          }

          setStores([]);
          setErrorMessage("Unable to load vending machines for this map view.");
        } finally {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        }
      })();
    }, 220);

    return () => {
      controller.abort();
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [mapBounds, showVendingMachines]);

  const visibleStores = canLoadVendingMachines ? stores : [];
  const listedStores = visibleStores.slice(0, 120);
  const hiddenStoreCount = visibleStores.length - listedStores.length;

  return (
    <section className="map-layout">
      <StoreMap
        stores={visibleStores}
        showMarkers={showMapMarkers && showVendingMachines}
        activeStoreId={activeStoreId}
        onStoreSelect={setActiveStoreId}
        onViewportChange={setMapBounds}
      />

      <div className="map-layout__controls">
        <section className="map-filters" aria-label="Map filters">
          <div>
            <p className="map-filters__eyebrow">Filters</p>
            <strong>{visibleStores.length} locations visible</strong>
            <p className="map-filters__copy">
              The official locator returns up to 20 machines for the current map view. Zoom in for denser areas.
            </p>
          </div>
          <label className="filter-toggle">
            <input
              type="checkbox"
              checked={showVendingMachines}
              onChange={(event) => setShowVendingMachines(event.target.checked)}
            />
            <span>Vending machines</span>
          </label>
          <label className="filter-toggle">
            <input
              type="checkbox"
              checked={showMapMarkers}
              onChange={(event) => setShowMapMarkers(event.target.checked)}
              disabled={!showVendingMachines}
            />
            <span>Show on map</span>
          </label>
        </section>

        {showVendingMachines && mapBounds && mapBounds.zoom < VENDING_FETCH_MIN_ZOOM ? (
          <p className="map-status">
            Zoom in to level {VENDING_FETCH_MIN_ZOOM} or closer to load vending machines for the current area.
          </p>
        ) : null}
        {canLoadVendingMachines && isLoading ? (
          <p className="map-status">Loading vending machines for the current map view...</p>
        ) : null}
        {canLoadVendingMachines && errorMessage ? <p className="map-status">{errorMessage}</p> : null}
      </div>

      <aside className="store-list" aria-label="Store results">
        {listedStores.map((store) => (
          <div
            key={store.id}
            onMouseEnter={() => setActiveStoreId(store.id)}
            onMouseLeave={() => setActiveStoreId(null)}
          >
            <StoreCard store={store} isActive={activeStoreId === store.id} />
          </div>
        ))}
        {hiddenStoreCount > 0 ? (
          <p className="store-list__summary">
            Showing the first {listedStores.length} results in the list. The map still includes all {visibleStores.length} visible locations.
          </p>
        ) : null}
        {visibleStores.length === 0 ? (
          <p className="store-list__summary">No locations match the current filter.</p>
        ) : null}
      </aside>
    </section>
  );
}
