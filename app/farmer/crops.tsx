// app/farmer/crops.tsx - Crop Management Page
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useLanguage } from "../i18n/LanguageContext";
import BackHeader from "../../components/BackHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Crop {
  id: string;
  name: string;
  type: string;
  plantingDate: string;
  expectedHarvest: string;
  area: string;
  status: "growing" | "harvested";
}

export default function CropManagement() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    plantingDate: "",
    expectedHarvest: "",
    area: "",
    status: "growing" as "growing" | "harvested",
  });

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    try {
      const stored = await AsyncStorage.getItem("farmer_crops");
      if (stored) {
        setCrops(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load crops:", e);
    }
  };

  const saveCrops = async (newCrops: Crop[]) => {
    try {
      await AsyncStorage.setItem("farmer_crops", JSON.stringify(newCrops));
      setCrops(newCrops);
    } catch (e) {
      console.warn("Failed to save crops:", e);
    }
  };

  const handleAdd = () => {
    setEditingCrop(null);
    setFormData({
      name: "",
      type: "",
      plantingDate: "",
      expectedHarvest: "",
      area: "",
      status: "growing",
    });
    setModalVisible(true);
  };

  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      type: crop.type,
      plantingDate: crop.plantingDate,
      expectedHarvest: crop.expectedHarvest,
      area: crop.area,
      status: crop.status,
    });
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      language === "mr" ? "पीक हटवा" : "Delete Crop",
      language === "mr" ? "तुम्हाला खात्री आहे?" : "Are you sure?",
      [
        { text: language === "mr" ? "रद्द करा" : "Cancel", style: "cancel" },
        {
          text: language === "mr" ? "हटवा" : "Delete",
          style: "destructive",
          onPress: () => {
            const updated = crops.filter((c) => c.id !== id);
            saveCrops(updated);
          },
        },
      ]
    );
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.type.trim()) {
      Alert.alert(
        language === "mr" ? "त्रुटी" : "Error",
        language === "mr" ? "कृपया सर्व आवश्यक क्षेत्रे भरा" : "Please fill all required fields"
      );
      return;
    }

    if (editingCrop) {
      const updated = crops.map((c) =>
        c.id === editingCrop.id ? { ...formData, id: editingCrop.id } : c
      );
      saveCrops(updated);
    } else {
      const newCrop: Crop = {
        ...formData,
        id: `crop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
      saveCrops([...crops, newCrop]);
    }

    setModalVisible(false);
    Alert.alert(
      language === "mr" ? "यश" : "Success",
      language === "mr" 
        ? editingCrop ? "पीक अपडेट झाले!" : "पीक जोडले गेले!"
        : editingCrop ? "Crop updated!" : "Crop added!"
    );
  };

  const getStatusColor = (status: string) => {
    return status === "growing" ? "#10B981" : "#F59E0B";
  };

  const getStatusText = (status: string) => {
    if (language === "mr") {
      return status === "growing" ? "वाढत आहे" : "कापणी झाली";
    }
    return status === "growing" ? "Growing" : "Harvested";
  };

  return (
    <View style={styles.container}>
      <BackHeader title={t("cropManagement") || "Crop Management"} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name="sprout" size={32} color="#2E7D32" />
          </View>
          <Text style={styles.headerTitle}>
            {language === "mr" ? "माझी पिके" : "My Crops"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {language === "mr" 
              ? "तुमच्या सर्व पिकांची माहिती व्यवस्थापित करा"
              : "Manage all your crop information"}
          </Text>
        </View>

        {/* Add Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <LinearGradient colors={["#2E7D32", "#4CAF50"]} style={styles.addButtonGradient}>
            <MaterialCommunityIcons name="plus-circle" size={24} color="#fff" />
            <Text style={styles.addButtonText}>
              {t("addNewCrop") || "Add New Crop"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Crops List */}
        {crops.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="sprout-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>
              {t("noCrops") || "No crops added yet"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {t("addYourFirstCrop") || "Add your first crop to get started"}
            </Text>
          </View>
        ) : (
          <View style={styles.cropsList}>
            {crops.map((crop, index) => (
              <Animated.View
                key={crop.id}
                entering={FadeInUp.delay(index * 100)}
                style={styles.cropCard}
              >
                <View style={styles.cropHeader}>
                  <View style={styles.cropIcon}>
                    <MaterialCommunityIcons name="sprout" size={24} color="#2E7D32" />
                  </View>
                  <View style={styles.cropInfo}>
                    <Text style={styles.cropName}>{crop.name}</Text>
                    <Text style={styles.cropType}>{crop.type}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(crop.status) + "20" }]}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(crop.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(crop.status) }]}>
                      {getStatusText(crop.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cropDetails}>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="calendar" size={16} color="#6B7280" />
                    <Text style={styles.detailLabel}>
                      {t("plantingDate") || "Planting Date"}: {crop.plantingDate || "-"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="calendar-check" size={16} color="#6B7280" />
                    <Text style={styles.detailLabel}>
                      {t("expectedHarvest") || "Expected Harvest"}: {crop.expectedHarvest || "-"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="vector-square" size={16} color="#6B7280" />
                    <Text style={styles.detailLabel}>
                      {t("area") || "Area"}: {crop.area || "-"} {language === "mr" ? "हेक्टर" : "Hectares"}
                    </Text>
                  </View>
                </View>

                <View style={styles.cropActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEdit(crop)}
                  >
                    <Feather name="edit" size={18} color="#3B82F6" />
                    <Text style={[styles.actionText, { color: "#3B82F6" }]}>
                      {language === "mr" ? "संपादन" : "Edit"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(crop.id)}
                  >
                    <Feather name="trash-2" size={18} color="#EF4444" />
                    <Text style={[styles.actionText, { color: "#EF4444" }]}>
                      {language === "mr" ? "हटवा" : "Delete"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCrop
                  ? language === "mr" ? "पीक संपादन करा" : "Edit Crop"
                  : language === "mr" ? "नवीन पीक जोडा" : "Add New Crop"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t("cropName") || "Crop Name"} *
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder={language === "mr" ? "उदा. तांदूळ" : "e.g. Rice"}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t("cropType") || "Crop Type"} *
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.type}
                  onChangeText={(text) => setFormData({ ...formData, type: text })}
                  placeholder={language === "mr" ? "उदा. धान्ये" : "e.g. Grains"}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t("plantingDate") || "Planting Date"}
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.plantingDate}
                  onChangeText={(text) => setFormData({ ...formData, plantingDate: text })}
                  placeholder={language === "mr" ? "DD/MM/YYYY" : "DD/MM/YYYY"}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t("expectedHarvest") || "Expected Harvest"}
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.expectedHarvest}
                  onChangeText={(text) => setFormData({ ...formData, expectedHarvest: text })}
                  placeholder={language === "mr" ? "DD/MM/YYYY" : "DD/MM/YYYY"}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t("area") || "Area (Hectares)"}
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.area}
                  onChangeText={(text) => setFormData({ ...formData, area: text })}
                  placeholder={language === "mr" ? "हेक्टरमध्ये क्षेत्र" : "Area in hectares"}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t("status") || "Status"}
                </Text>
                <View style={styles.statusButtons}>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      formData.status === "growing" && styles.statusButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, status: "growing" })}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        formData.status === "growing" && styles.statusButtonTextActive,
                      ]}
                    >
                      {language === "mr" ? "वाढत आहे" : "Growing"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      formData.status === "harvested" && styles.statusButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, status: "harvested" })}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        formData.status === "harvested" && styles.statusButtonTextActive,
                      ]}
                    >
                      {language === "mr" ? "कापणी झाली" : "Harvested"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>
                  {language === "mr" ? "रद्द करा" : "Cancel"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <LinearGradient colors={["#2E7D32", "#4CAF50"]} style={styles.saveButtonGradient}>
                  <Text style={styles.saveButtonText}>
                    {language === "mr" ? "जतन करा" : "Save"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContent: { padding: 16, paddingTop: 10 },
  headerSection: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 20,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2E7D32",
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  addButton: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  cropsList: {
    gap: 12,
  },
  cropCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cropHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cropIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
  },
  cropType: {
    fontSize: 14,
    color: "#6B7280",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  cropDetails: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
    marginBottom: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#374151",
  },
  cropActions: {
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
  },
  modalForm: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statusButtons: {
    flexDirection: "row",
    gap: 12,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  statusButtonActive: {
    backgroundColor: "#E8F5E9",
    borderColor: "#2E7D32",
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
  },
  statusButtonTextActive: {
    color: "#2E7D32",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6B7280",
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  saveButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
  },
});














