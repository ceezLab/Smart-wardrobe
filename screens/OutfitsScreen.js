import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  getClothingItems,
  getOutfits,
  deleteOutfit,
  updateOutfit,
  addWearLog,
  incrementWearCountsForOutfit,
} from "../utils/storage";
import OutfitCard from "../components/OutfitCard";

export default function OutfitsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [outfits, setOutfits] = useState([]);

  const itemsById = useMemo(
    () => Object.fromEntries(items.map((i) => [i.id, i])),
    [items]
  );

  const load = async () => {
    setItems(await getClothingItems());
    setOutfits(await getOutfits());
  };

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    load();
    return unsub;
  }, [navigation]);

  const onDelete = async (id) => {
    await deleteOutfit(id);
    setOutfits(await getOutfits());
  };

  const onToggleFavorite = async (outfit) => {
    await updateOutfit({ ...outfit, isFavorite: !outfit.isFavorite });
    setOutfits(await getOutfits());
  };

  const onLogWear = async (outfit) => {
    await addWearLog({
      id: Date.now().toString(),
      outfitId: outfit.id,
      date: new Date().toISOString(),
    });
    await incrementWearCountsForOutfit(outfit);
    await load();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      <View style={styles.row}>
        <Text style={styles.header}>Outfits</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Builder")}
          style={styles.addBtn}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>+ Create</Text>
        </TouchableOpacity>
      </View>

      {outfits.length === 0 ? (
        <Text style={{ color: "#666", marginTop: 10 }}>
          No outfits yet. Create your first!
        </Text>
      ) : (
        outfits.map((o) => (
          <OutfitCard
            key={o.id}
            outfit={o}
            itemsById={itemsById}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
            onLogWear={onLogWear}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f6ff" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: { fontSize: 22, fontWeight: "800" },
  addBtn: {
    backgroundColor: "#6a5acd",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});
