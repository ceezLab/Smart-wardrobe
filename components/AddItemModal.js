import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { CATEGORIES, SEASONS } from "../utils/constants";

export default function AddItemModal({ visible, onClose, onSave, editItem }) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState("back");
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    season: "",
    color: "",
    brand: "",
    size: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    if (editItem) {
      setForm(editItem);
    } else {
      setForm({
        name: "",
        category: "",
        season: "",
        color: "",
        brand: "",
        size: "",
        description: "",
        image: null,
      });
    }
  }, [editItem, visible]);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5,
    });
    if (!res.canceled) {
      const uri = res.assets?.[0]?.uri;
      if (uri) setForm((f) => ({ ...f, image: uri }));
    }
  };

  const openCamera = async () => {
    if (!cameraPermission || !cameraPermission.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert(
          "Camera permission needed",
          "Please enable camera access to take a photo."
        );
        return;
      }
    }
    setIsCameraOpen(true);
  };

  const flipCamera = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo?.uri) {
          setForm((f) => ({ ...f, image: photo.uri }));
          setIsCameraOpen(false);
        }
      } catch (e) {
        console.warn("Failed to take photo", e);
      }
    }
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      Alert.alert("Missing name", "Please enter an item name.");
      return;
    }
    onSave(editItem ? { ...form, id: editItem.id } : form);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {editItem ? "Edit Item" : "Add Item"}
          </Text>
          <ScrollView>
            <TextInput
              placeholder="Name"
              value={form.name}
              onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
              style={styles.input}
              placeholderTextColor="#d3d0d0"
            />
            <TextInput
              placeholder="Brand (optional)"
              value={form.brand}
              onChangeText={(t) => setForm((f) => ({ ...f, brand: t }))}
              style={styles.input}
              placeholderTextColor="#d3d0d0"
            />
            <TextInput
              placeholder="Size (optional)"
              value={form.size}
              onChangeText={(t) => setForm((f) => ({ ...f, size: t }))}
              style={styles.input}
              placeholderTextColor="#d3d0d0"
            />
            <TextInput
              placeholder="Color"
              value={form.color}
              onChangeText={(t) => setForm((f) => ({ ...f, color: t }))}
              style={styles.input}
              placeholderTextColor="#d3d0d0"
            />
            <TextInput
              placeholder="Category (tops/bottoms/dresses/outerwear/shoes/accessories)"
              value={form.category}
              onChangeText={(t) =>
                setForm((f) => ({ ...f, category: t.toLowerCase() }))
              }
              style={styles.input}
              placeholderTextColor="#d3d0d0"
            />
            <TextInput
              placeholder="Season (spring/summer/fall/winter/all-season)"
              value={form.season}
              onChangeText={(t) =>
                setForm((f) => ({ ...f, season: t.toLowerCase() }))
              }
              style={styles.input}
              placeholderTextColor="#d3d0d0"
            />
            <TextInput
              placeholder="Description"
              value={form.description}
              onChangeText={(t) => setForm((f) => ({ ...f, description: t }))}
              style={[styles.input, { height: 80 }]}
              multiline
              placeholderTextColor="#d3d0d0"
            />
            <TouchableOpacity onPress={pickImage} style={styles.buttonPrimary}>
              <Text style={styles.buttonText}>
                {form.image ? "Change Image" : "Pick Image"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openCamera}
              style={styles.buttonSecondary}
            >
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            {isCameraOpen && (
              <View style={styles.cameraWrapper}>
                <CameraView
                  ref={cameraRef}
                  style={styles.camera}
                  facing={facing}
                />
                <View style={styles.cameraControls}>
                  <TouchableOpacity
                    onPress={flipCamera}
                    style={styles.smallButton}
                  >
                    <Text style={styles.buttonText}>Flip</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={takePhoto}
                    style={styles.smallButton}
                  >
                    <Text style={styles.buttonText}>Capture</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsCameraOpen(false)}
                    style={styles.smallButton}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {form.image ? (
              <Image source={{ uri: form.image }} style={styles.preview} />
            ) : null}

            <View style={styles.row}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.button, styles.cancel]}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={styles.buttonPrimary}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    maxHeight: "90%",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: "#333",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancel: { backgroundColor: "#999" },
  buttonPrimary: {
    backgroundColor: "#6a5acd",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonSecondary: {
    backgroundColor: "#444",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    alignSelf: "center",
    marginVertical: 8,
  },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  cameraWrapper: {
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  camera: {
    width: "100%",
    height: 250,
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  smallButton: {
    backgroundColor: "#6a5acd",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
});
