export type StorePlaceType = "lgs" | "big_box" | "vending" | "event";

export type Store = {
  id: string;
  name: string;
  addressLine1: string;
  city: string;
  stateRegion: string;
  postalCode: string;
  distanceMiles: number;
  placeType: StorePlaceType;
  placeTypeLabel: string;
  hasSealed: boolean;
  hasSingles: boolean;
  hostsEvents: boolean;
  latitude: number;
  longitude: number;
};
