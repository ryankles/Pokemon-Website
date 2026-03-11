"use client";

import type { FormEvent } from "react";

export function LocationSearch() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form className="location-search" onSubmit={handleSubmit}>
      <label htmlFor="location">Search by city, zip, or address</label>
      <div className="location-search__row">
        <input
          id="location"
          name="location"
          type="text"
          placeholder="Seattle, WA"
        />
        <button type="submit">Search</button>
      </div>
    </form>
  );
}
