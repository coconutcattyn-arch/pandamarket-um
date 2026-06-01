"use client";

import { useMemo, useState } from "react";
import { getLocationLabel, locationGroups, locations } from "@/lib/data";
import type { ProductLocationKey } from "@/lib/types";

type LocationPickerProps = {
  defaultValue?: ProductLocationKey;
  name?: string;
};

type LocationGroupKey = (typeof locationGroups)[number]["key"];

const firstGroupedLocation = locationGroups[0]?.locationKeys[0] as ProductLocationKey;
const firstGroupKey = locationGroups[0]?.key as LocationGroupKey;

function isProductLocationKey(value: string | undefined): value is ProductLocationKey {
  return Boolean(value && locations.some((location) => location.key === value));
}

function findGroupKeyByLocation(locationKey: ProductLocationKey): LocationGroupKey {
  return locationGroups.find((group) => (group.locationKeys as readonly string[]).includes(locationKey))?.key ?? firstGroupKey;
}

export function LocationPicker({ defaultValue, name = "location" }: LocationPickerProps) {
  const initialLocation = isProductLocationKey(defaultValue) ? defaultValue : firstGroupedLocation;
  const initialGroupKey = initialLocation ? findGroupKeyByLocation(initialLocation) : firstGroupKey;
  const [activeGroupKey, setActiveGroupKey] = useState(initialGroupKey);
  const [selectedLocation, setSelectedLocation] = useState<ProductLocationKey>(initialLocation);

  const activeGroup = locationGroups.find((group) => group.key === activeGroupKey) ?? locationGroups[0];
  const activeLocations = useMemo(
    () =>
      activeGroup.locationKeys
        .map((locationKey) => locations.find((location) => location.key === locationKey))
        .filter((location): location is (typeof locations)[number] => Boolean(location)),
    [activeGroup]
  );
  const selectedLocationInGroups = locationGroups.some((group) => (group.locationKeys as readonly string[]).includes(selectedLocation));

  function handleGroupChange(groupKey: LocationGroupKey) {
    const nextGroup = locationGroups.find((group) => group.key === groupKey);
    const nextLocation = nextGroup?.locationKeys[0] as ProductLocationKey | undefined;

    setActiveGroupKey(groupKey);
    if (nextLocation) {
      setSelectedLocation(nextLocation);
    }
  }

  return (
    <div className="block">
      <span className="mb-2 block text-sm font-medium text-panda-ink">交易地点</span>
      <input name={name} type="hidden" value={selectedLocation} />

      <div className="space-y-3 rounded-[1.25rem] border border-panda-line bg-panda-paper/70 p-3">
        {!selectedLocationInGroups ? (
          <div className="rounded-full border border-panda-lime bg-white px-3 py-2 text-sm font-semibold text-panda-ink">
            当前已选：{getLocationLabel(selectedLocation)}
          </div>
        ) : null}

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {locationGroups.map((group) => {
            const active = group.key === activeGroup.key;

            return (
              <button
                key={group.key}
                className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition ${
                  active
                    ? "border-panda-lime bg-panda-lime text-panda-ink shadow-sm"
                    : "border-panda-line bg-white text-panda-muted hover:border-panda-lime hover:text-panda-ink"
                }`}
                type="button"
                onClick={() => handleGroupChange(group.key)}
              >
                {group.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {activeLocations.map((location) => {
            const active = location.key === selectedLocation;

            return (
              <button
                key={location.key}
                className={`min-h-10 rounded-full border px-3.5 text-sm font-medium transition ${
                  active
                    ? "border-panda-lime bg-white text-panda-ink shadow-sm ring-2 ring-panda-lime/35"
                    : "border-panda-line bg-white/80 text-panda-muted hover:border-panda-lime hover:text-panda-ink"
                }`}
                type="button"
                onClick={() => setSelectedLocation(location.key)}
              >
                {location.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
