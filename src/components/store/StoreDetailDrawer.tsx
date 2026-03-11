import type { Store } from "@/types/store";

type StoreDetailDrawerProps = {
  store: Store;
};

export function StoreDetailDrawer({ store }: StoreDetailDrawerProps) {
  return (
    <aside aria-label={`${store.name} details`}>
      <h2>{store.name}</h2>
      <p>
        {store.addressLine1}, {store.city}, {store.stateRegion} {store.postalCode}
      </p>
    </aside>
  );
}
