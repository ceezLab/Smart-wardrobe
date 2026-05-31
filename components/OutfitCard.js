import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function OutfitCard({
  outfit,
  itemsById,
  onDelete,
  onToggleFavorite,
  onLogWear,
}) {
  const parts = useMemo(() => {
    const get = (id) => (id ? itemsById[id] : null);
    return {
      top: get(outfit.topId),
      bottom: get(outfit.bottomId),
      shoes: get(outfit.shoesId),
      outerwear: get(outfit.outerwearId),
    };
  }, [outfit, itemsById]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Outfit</Text>
      <Text style={styles.meta}>Top: {parts.top?.name || "—"}</Text>
      <Text style={styles.meta}>Bottom: {parts.bottom?.name || "—"}</Text>
      <Text style={styles.meta}>Shoes: {parts.shoes?.name || "—"}</Text>
      <Text style={styles.meta}>Outerwear: {parts.outerwear?.name || "—"}</Text>
      <Text style={styles.meta}>Worn: {outfit.wearCount || 0} times</Text>

      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => onToggleFavorite(outfit)}
          style={[styles.btn, styles.secondary]}
        >
          <Text style={styles.btnText}>
            {outfit.isFavorite ? "Unfavorite" : "Favorite"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onLogWear(outfit)}
          style={[styles.btn, styles.primary]}
        >
          <Text style={styles.btnText}>Log Wear</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => onDelete(outfit.id)}
        style={[styles.btn, styles.danger, { marginTop: 8 }]}
      >
        <Text style={styles.btnText}>Delete Outfit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    elevation: 2,
  },
  title: { fontWeight: "800", fontSize: 16, marginBottom: 6 },
  meta: { color: "#555", marginBottom: 2 },
  row: { flexDirection: "row", gap: 8, marginTop: 6 },
  btn: { flex: 1, padding: 10, borderRadius: 8, alignItems: "center" },
  primary: { backgroundColor: "#6a5acd" },
  secondary: { backgroundColor: "#888" },
  danger: { backgroundColor: "#ff4d4d" },
  btnText: { color: "#fff", fontWeight: "700" },
});
