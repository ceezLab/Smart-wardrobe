import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import WardrobeScreen from "./screens/WardrobeScreen";
import OutfitsScreen from "./screens/OutfitsScreen";
import OutfitBuilderScreen from "./screens/OutfitBuilderScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            if (route.name === "Home") {
              return <Ionicons name="home-outline" size={size} color={color} />;
            }

            if (route.name === "Wardrobe") {
              return (
                <MaterialCommunityIcons
                  name="hanger"
                  size={size}
                  color={color}
                />
              );
            }

            if (route.name === "Outfits") {
              return (
                <MaterialCommunityIcons
                  name="tshirt-crew"
                  size={size}
                  color={color}
                />
              );
            }

            if (route.name === "Builder") {
              return (
                <Ionicons name="construct-outline" size={size} color={color} />
              );
            }

            if (route.name === "Profile") {
              return (
                <Ionicons name="person-outline" size={size} color={color} />
              );
            }

            return null;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
        <Tab.Screen name="Outfits" component={OutfitsScreen} />
        <Tab.Screen
          name="Builder"
          component={OutfitBuilderScreen}
          options={{ title: "Builder" }}
        />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
