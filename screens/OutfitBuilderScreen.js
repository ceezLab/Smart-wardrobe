import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { getClothingItems, addOutfit } from "../utils/storage";

export default function OutfitBuilderScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState({
    topId: null,
    bottomId: null,
    shoesId: null,
    outerwearId: null,
  });

  useEffect(() => {
    const load = async () => setItems(await getClothingItems());
    const unsub = navigation.addListener("focus", load);
    load();
    return unsub;
  }, [navigation]);

  const byCategory = useMemo(() => {
    const g = { tops: [], bottoms: [], shoes: [], outerwear: [], other: [] };
    items.forEach((it) => {
      const cat = (it.category || "").toLowerCase();
      if (cat.includes("top")) g.tops.push(it);
      else if (
        cat.includes("bottom") ||
        cat.includes("pant") ||
        cat.includes("jean")
      )
        g.bottoms.push(it);
      else if (cat.includes("shoe")) g.shoes.push(it);
      else if (cat.includes("outer")) g.outerwear.push(it);
      else g.other.push(it);
    });
    return g;
  }, [items]);

  const save = async () => {
    if (!selected.topId || !selected.bottomId) {
      Alert.alert("Missing pieces", "Pick at least a top and a bottom.");
      return;
    }
    await addOutfit({ ...selected, isFavorite: false, wearCount: 0 });
    Alert.alert("Outfit saved", "Your outfit has been created.", [
      { text: "OK", onPress: () => navigation.navigate("Outfits") },
    ]);
  };

  const Slot = ({ label, listKey, data }) => (
    <View style={styles.slot}>
      <Text style={styles.slotTitle}>{label}</Text>
      <FlatList
        horizontal
        data={data}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => {
          const active = selected[listKey] === item.id;
          return (
            <TouchableOpacity
              onPress={() => setSelected((s) => ({ ...s, [listKey]: item.id }))}
              style={[styles.item, active && styles.itemActive]}
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.placeholder]}>
                  <Text style={{ color: "#666" }}>{item.name}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text style={styles.header}>Build Outfit</Text>
      <Slot label="Top" listKey="topId" data={byCategory.tops} />
      <Slot label="Bottom" listKey="bottomId" data={byCategory.bottoms} />
      <Slot
        label="Shoes (optional)"
        listKey="shoesId"
        data={byCategory.shoes}
      />
      <Slot
        label="Outerwear (optional)"
        listKey="outerwearId"
        data={byCategory.outerwear}
      />

      <TouchableOpacity onPress={save} style={styles.saveBtn}>
        <Text style={{ color: "#fff", fontWeight: "800" }}>Save Outfit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f6ff" },
  header: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 16,
  },
  slot: { marginBottom: 12 },
  slotTitle: { fontWeight: "800", marginBottom: 6 },
  item: {
    marginRight: 10,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  itemActive: { borderColor: "#6a5acd" },
  image: { width: 90, height: 90 },
  placeholder: {
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: "#6a5acd",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },
});
