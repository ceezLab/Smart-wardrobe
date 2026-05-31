import AsyncStorage from "@react-native-async-storage/async-storage";
const KEYS = {
  ITEMS: "wardrobeItems",
  OUTFITS: "wardrobeOutfits",
  LOGS: "wearLogs",
};
export async function getJSON(key, fallback = []) {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}
export async function setJSON(key, value) {
  return AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getClothingItems() {
  return getJSON(KEYS.ITEMS, []);
}
export async function addClothingItem(item) {
  const list = await getClothingItems();
  const withId = { ...item, id: Date.now().toString(), wearCount: item.wearCount || 0 };
  list.unshift(withId);
  await setJSON(KEYS.ITEMS, list);
  return withId;
}
export async function updateClothingItem(updated) {
  const list = await getClothingItems();
  const newList = list.map((it) => (it.id === updated.id ? { ...it, ...updated } : it));
  await setJSON(KEYS.ITEMS, newList);
}
export async function deleteClothingItem(id) {
  const list = await getClothingItems();
  await setJSON(KEYS.ITEMS, list.filter((it) => it.id !== id));
}

export async function getOutfits() {
  return getJSON(KEYS.OUTFITS, []);
}
export async function addOutfit(outfit) {
  const list = await getOutfits();
  const withId = {
    ...outfit,
    id: Date.now().toString(),
    isFavorite: !!outfit.isFavorite,
    wearCount: outfit.wearCount || 0,
  };
  list.unshift(withId);
  await setJSON(KEYS.OUTFITS, list);
  return withId;
}
export async function updateOutfit(updated) {
  const list = await getOutfits();
  const newList = list.map((o) => (o.id === updated.id ? { ...o, ...updated } : o));
  await setJSON(KEYS.OUTFITS, newList);
}
export async function deleteOutfit(id) {
  const list = await getOutfits();
  await setJSON(KEYS.OUTFITS, list.filter((o) => o.id !== id));
}

export async function getWearLogs() {
  return getJSON(KEYS.LOGS, []);
}
export async function addWearLog(log) {
  const list = await getWearLogs();
  list.unshift(log);
  await setJSON(KEYS.LOGS, list);
}

export async function incrementWearCountsForOutfit(outfit) {
  const outfits = await getOutfits();
  const updatedOutfits = outfits.map((o) =>
    o.id === outfit.id ? { ...o, wearCount: (o.wearCount || 0) + 1 } : o
  );
  await setJSON("wardrobeOutfits", updatedOutfits);

  const items = await getClothingItems();
  const itemIds = [outfit.topId, outfit.bottomId, outfit.shoesId, outfit.outerwearId].filter(Boolean);
  const updatedItems = items.map((it) =>
    itemIds.includes(it.id) ? { ...it, wearCount: (it.wearCount || 0) + 1 } : it
  );
  await setJSON("wardrobeItems", updatedItems);

  return { updatedOutfits, updatedItems };
}
