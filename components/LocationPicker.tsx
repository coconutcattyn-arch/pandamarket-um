"use client";

import { useMemo, useState } from "react";
import { LocationGroupLabel, LocationLabel, T } from "@/components/I18nProvider";
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
      <span className="mb-2 block text-sm font-medium text-panda-ink"><T k="form.location" /></span>
      <input name={name} type="hidden" value={selectedLocation} />

      <div className="space-y-3 rounded-[1.25rem] border border-panda-line/80 bg-[#FFF8EC] p-3">
        {!selectedLocationInGroups ? (
          <div className="rounded-full border border-[#FFB48B] bg-white px-3 py-2 text-sm font-semibold text-panda-ink shadow-sm">
            <T k="common.currentSelected" />: {getLocationLabel(selectedLocation)}
          </div>
        ) : null}

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 no-scrollbar">
          {locationGroups.map((group) => {
            const active = group.key === activeGroup.key;

            return (
              <button
                key={group.key}
                className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition ${
                  active
                    ? "border-[#FF5A4F] bg-[#FF5A4F] text-white shadow-[0_10px_22px_rgba(255,90,79,0.2)]"
                    : "border-panda-line/80 bg-white text-panda-muted shadow-sm hover:border-[#FFD1B8] hover:text-panda-ink"
                }`}
                type="button"
                onClick={() => handleGroupChange(group.key)}
              >
                <LocationGroupLabel value={group.key} />
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
                    ? "border-[#FF5A4F] bg-white text-[#FF4F45] shadow-sm ring-2 ring-[#FFD1B8]"
                    : "border-panda-line/80 bg-white/90 text-panda-muted shadow-sm hover:border-[#FFD1B8] hover:text-panda-ink"
                }`}
                type="button"
                onClick={() => setSelectedLocation(location.key)}
              >
                <LocationLabel value={location.key} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
