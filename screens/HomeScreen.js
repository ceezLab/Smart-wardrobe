import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { getClothingItems, getOutfits, getWearLogs } from "../utils/storage";
import OutfitCard from "../components/OutfitCard";

export default function HomeScreen() {
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

  const mostWornItem = useMemo(() => {
    if (items.length === 0) return null;
    return items.reduce((a, b) => (a.wearCount > b.wearCount ? a : b));
  }, [items]);

  const colorSuggestions = useMemo(() => {
    const groups = {};
    items.forEach((it) => {
      const key = (it.color || "").toLowerCase();
      if (!key) return;
      groups[key] = groups[key] || [];
      groups[key].push(it);
    });
    return Object.entries(groups)
      .filter(([, arr]) => arr.length >= 2)
      .map(([color, arr]) => ({ color, count: arr.length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [items]);

  const recentOutfits = useMemo(() => {
    return [...outfits]
      .sort(
        (a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id)
      )
      .slice(0, 3);
  }, [outfits]);

  const itemsById = useMemo(() => {
    const map = {};
    items.forEach((it) => (map[it.id] = it));
    return map;
  }, [items]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text style={styles.title}>Smart Wardrobe</Text>
      <Text style={styles.subtitle}>Organize, track, and plan outfits</Text>

      <View style={styles.cards}>
        <Stat label="Total Items" value={items.length} />
        <Stat label="Total Outfits" value={outfits.length} />
        <Stat
          label="Favorites"
          value={outfits.filter((o) => o.isFavorite).length}
        />
        <Stat label="Logged Days" value={logs.length} />
      </View>

      <View style={styles.block}>
        <Text style={styles.h2}>Most Worn</Text>
        <Text style={styles.text}>
          {mostWornItem
            ? `${mostWornItem.name} (${mostWornItem.wearCount} times)`
            : "N/A"}
        </Text>
      </View>
      <View style={[styles.block, { marginTop: 14 }]}>
        <Text style={styles.h2}>Recent Outfits</Text>
        {recentOutfits.length === 0 ? (
          <Text style={{ color: "#666", marginTop: 10 }}>
            No outfits yet. Create your first!
          </Text>
        ) : (
          recentOutfits.map((o) => (
            <OutfitCard
              key={o.id}
              outfit={o}
              itemsById={itemsById}
              onToggleFavorite={() => {}}
              onDelete={() => {}}
              onLogWear={() => {}}
            />
          ))
        )}
      </View>

      {colorSuggestions.length > 0 && (
        <View style={styles.block}>
          <Text style={styles.h2}>Color Suggestions</Text>
          {colorSuggestions.map((c) => (
            <Text key={c.color} style={styles.text}>
              Try a {c.color} combo • {c.count} items
            </Text>
          ))}
        </View>
      )}
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
  container: {
    flex: 1,
    backgroundColor: "#f8f6ff",
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: { textAlign: "center", color: "#555", marginBottom: 16 },
  cards: {
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
  text: { color: "#444" },
});
