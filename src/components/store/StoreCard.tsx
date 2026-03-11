import type { Store } from "@/types/store";

type StoreCardProps = {
  store: Store;
  isActive?: boolean;
};

export function StoreCard({ store, isActive }: StoreCardProps) {
  return (
    <article
      className="store-card"
      style={isActive ? { borderColor: "rgba(240, 107, 60, 0.6)", boxShadow: "0 0 0 2px rgba(240,107,60,0.25)" } : undefined}
    >
      <span className="store-card__meta">{store.placeTypeLabel}</span>
      <h2>{store.name}</h2>
      <p>
        {store.city}, {store.stateRegion}
      </p>
      {store.distanceMiles > 0 ? (
        <span className="store-card__distance">{store.distanceMiles} miles away</span>
      ) : (
        <span className="store-card__distance">{store.addressLine1}</span>
      )}
      <div className="store-card__chips">
        {store.hasSingles ? <span>Singles</span> : null}
        {store.hostsEvents ? <span>Events</span> : null}
        {store.hasSealed ? <span>Sealed</span> : null}
      </div>
    </article>
  );
}
