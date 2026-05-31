import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { getClothingItems, getOutfits, getWearLogs } from "../utils/storage";
import { CATEGORIES } from "../utils/constants";

export default function ProfileScreen() {
  const [items, setItems] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const load = async () => {
      setItems(await getClothingItems());
      setOutfits(await getOutfits());
      setLogs(await getWearLogs());
    };
    const unsub = setInterval(load, 400);
    load();
    return () => clearInterval(unsub);
  }, []);

  const total = items.length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text style={styles.header}>Profile & Settings</Text>

      <View style={styles.grid}>
        <Stat label="Total Items" value={total} />
        <Stat label="Outfits" value={outfits.length} />
        <Stat
          label="Favorites"
          value={outfits.filter((o) => o.isFavorite).length}
        />
        <Stat label="Wear Logs" value={logs.length} />
      </View>

      <View style={styles.block}>
        <Text style={styles.h2}>Wardrobe Breakdown</Text>
        {CATEGORIES.map((cat) => {
          const count = items.filter((i) => i.category === cat).length;
          const pct = total ? Math.round((count / total) * 100) : 0;
          return (
            <View key={cat} style={{ marginBottom: 8 }}>
              <View style={styles.row}>
                <Text style={{ textTransform: "capitalize" }}>{cat}</Text>
                <Text>{count} items</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${pct}%` }]} />
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  stat: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    width: "48%",
    marginBottom: 10,
    elevation: 1,
  },
  statValue: { fontSize: 20, fontWeight: "800" },
  statLabel: { color: "#666", marginTop: 4 },
  block: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
  },
  h2: { fontSize: 16, fontWeight: "800", marginBottom: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  barBg: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: { height: 8, backgroundColor: "#6a5acd" },
});
