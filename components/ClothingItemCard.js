import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function ClothingItemCard({ item, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : null}
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.meta}>Category: {item.category}</Text>
      <Text style={styles.meta}>Season: {item.season}</Text>
      {item.color ? <Text style={styles.meta}>Color: {item.color}</Text> : null}
      <Text style={styles.meta}>Worn: {item.wearCount || 0} times</Text>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => onEdit(item)}
          style={[styles.btn, styles.edit]}
        >
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(item.id)}
          style={[styles.btn, styles.del]}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
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
  image: { width: "100%", height: 140, borderRadius: 8, marginBottom: 8 },
  name: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  meta: { color: "#555", marginBottom: 2 },
  row: { flexDirection: "row", gap: 8, marginTop: 8 },
  btn: { flex: 1, padding: 10, borderRadius: 8, alignItems: "center" },
  edit: { backgroundColor: "#6a5acd" },
  del: { backgroundColor: "#ff4d4d" },
  btnText: { color: "#fff", fontWeight: "700" },
});
