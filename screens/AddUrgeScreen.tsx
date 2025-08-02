// screens/AddUrgeScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
  Dimensions,
} from "react-native";
import { COMMON_URGES } from "../types";
import { useSettings } from "../hooks/useSettings";
import { Ionicons } from "@expo/vector-icons";

interface AddUrgeScreenProps {
  onUrgeSelected: (urge: string, icon?: string) => void;
  onBack: () => void;
  currentSelectedUrges?: string[];
}

// Curated list of icons that make sense for urges/behaviors
// Note: For now, custom icons are only used in the UI and passed via callback
// To fully persist custom icons, the UserSettings type would need to be extended
const AVAILABLE_ICONS = [
  "alert-circle-outline",
  "cafe-outline",
  "wine-outline",
  "restaurant-outline",
  "fast-food-outline",
  "ice-cream-outline",
  "pizza-outline",
  "beer-outline",
  "remove-circle-outline",
  "phone-portrait-outline",
  "game-controller-outline",
  "tv-outline",
  "laptop-outline",
  "card-outline",
  "cash-outline",
  "cart-outline",
  "bag-outline",
  "shirt-outline",
  "car-outline",
  "fitness-outline",
  "bed-outline",
  "time-outline",
  "chatbubble-outline",
  "people-outline",
  "person-outline",
  "heart-outline",
  "happy-outline",
  "sad-outline",
  "flame-outline",
  "flash-outline",
  "warning-outline",
  "help-circle-outline",
  "information-circle-outline",
  "star-outline",
  "bookmark-outline",
  "flag-outline",
  "pin-outline",
  "home-outline",
  "business-outline",
  "school-outline",
  "library-outline",
  "medical-outline",
  "walk-outline",
  "bicycle-outline",
  "airplane-outline",
  "boat-outline",
  "train-outline",
  "musical-notes-outline",
  "headset-outline",
  "camera-outline",
  "videocam-outline",
  "book-outline",
  "newspaper-outline",
  "journal-outline",
  "pencil-outline",
  "brush-outline",
  "color-palette-outline",
  "hammer-outline",
  "build-outline",
  "settings-outline",
  "cog-outline",
  "refresh-outline",
  "sync-outline",
  "download-outline",
  "cloud-outline",
  "sunny-outline",
  "moon-outline",
  "partly-sunny-outline",
  "thunderstorm-outline",
  "snow-outline",
  "leaf-outline",
  "flower-outline",
  "rose-outline",
  "globe-outline",
  "location-outline",
  "map-outline",
  "compass-outline",
  "navigate-outline",
  "rocket-outline",
  "diamond-outline",
  "trophy-outline",
  "medal-outline",
  "ribbon-outline",
  "gift-outline",
  "balloon-outline",
  "egg-outline",
  "paw-outline",
  "bug-outline",
  "fish-outline",
  "bonfire-outline",
  "hardware-chip-outline",
  "telescope-outline",
  "magnet-outline",
  "battery-charging-outline",
  "bulb-outline",
  "flashlight-outline",
  "shield-outline",
  "lock-closed-outline",
  "key-outline",
  "scan-outline",
  "qr-code-outline",
  "barcode-outline",
  "calculator-outline",
  "stopwatch-outline",
  "timer-outline",
  "hourglass-outline",
  "calendar-outline",
  "today-outline",
  "checkmark-circle-outline",
  "close-circle-outline",
  "add-circle-outline",
];

const AddUrgeScreen: React.FC<AddUrgeScreenProps> = ({
  onUrgeSelected,
  onBack,
  currentSelectedUrges = [],
}) => {
  const [customUrge, setCustomUrge] = useState("");
  const [selectedUrge, setSelectedUrge] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("help-circle-outline");
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { settings, updateSettings } = useSettings();

  // Filter out urges that are already in user's selected list
  const availableUrges = COMMON_URGES.filter(
    (urge) => !currentSelectedUrges.includes(urge.text)
  );

  const handleUrgeSelect = (urgeText: string) => {
    setSelectedUrge(urgeText);
    setCustomUrge("");
    setShowIconPicker(false);
  };

  const handleCustomUrgeChange = (text: string) => {
    setCustomUrge(text);
    setSelectedUrge("");
    // Show icon picker when user starts typing custom urge
    if (text.trim().length > 0 && !showIconPicker) {
      setShowIconPicker(true);
    }
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
  };

  const handleConfirm = async () => {
    const urgeToAdd = customUrge.trim() || selectedUrge;
    if (urgeToAdd) {
      setIsLoading(true);
      try {
        // For custom urges, we need to store both the text and icon
        // For predefined urges, we use their existing icon
        const isCustomUrge = customUrge.trim().length > 0;
        const iconToUse = isCustomUrge ? selectedIcon : undefined;

        // Add the new urge to user's selected urges
        const currentUrges = settings?.selectedUrges || [];

        // Check if urge already exists
        if (currentUrges.includes(urgeToAdd)) {
          // Just select it without adding
          onUrgeSelected(urgeToAdd, iconToUse);
          return;
        }

        const newUrgesList = [...currentUrges, urgeToAdd];

        await updateSettings({
          ...settings,
          selectedUrges: newUrgesList,
        });

        // Call the callback to set this urge in QuickLog
        onUrgeSelected(urgeToAdd, iconToUse);
      } catch (error) {
        Alert.alert("Error", "Failed to save the urge. Please try again.", [
          { text: "OK" },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isValidSelection = () => {
    return (
      !isLoading && (customUrge.trim().length > 0 || selectedUrge.length > 0)
    );
  };

  const getIconForUrge = (urgeText: string) => {
    const urgeObj = COMMON_URGES.find((u) => u.text === urgeText);
    return urgeObj?.icon || "help-circle-outline";
  };

  const renderIconPicker = () => {
    const screenWidth = Dimensions.get('window').width;
    const iconSize = 40;
    const padding = 24; // 12px on each side
    const gap = 12;
    const iconsPerRow = Math.floor((screenWidth - padding * 2) / (iconSize + gap));

    return (
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white font-medium text-lg">Choose an icon:</Text>
          <TouchableOpacity
            onPress={() => setShowIconPicker(false)}
            className="p-2"
          >
            <Text className="text-white opacity-75">Hide</Text>
          </TouchableOpacity>
        </View>
        
        {/* Selected icon preview or Add Icon prompt */}
        <View className="items-center mb-4">
          <TouchableOpacity
            className="w-16 h-16 rounded-full items-center justify-center border-2"
            style={{
              backgroundColor: selectedIcon === "help-circle-outline" 
                ? "rgba(255, 255, 255, 0.1)" 
                : "rgba(255, 255, 255, 0.2)",
              borderColor: selectedIcon === "help-circle-outline"
                ? "rgba(255, 255, 255, 0.3)"
                : "rgba(255, 255, 255, 0.5)",
              borderStyle: selectedIcon === "help-circle-outline" ? "dashed" : "solid",
            }}
            onPress={() => setShowIconPicker(!showIconPicker)}
          >
            {selectedIcon === "help-circle-outline" ? (
              <Ionicons name="add" size={32} color="rgba(255, 255, 255, 0.7)" />
            ) : (
              <Ionicons name={selectedIcon as any} size={32} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          <Text className="text-white text-sm mt-2 opacity-75">
            {selectedIcon === "help-circle-outline" ? "Add Icon" : selectedIcon}
          </Text>
        </View>

        {/* Icon grid */}
        <ScrollView 
          className="max-h-64 bg-transparent bg-opacity-10 rounded-lg p-3"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap justify-center">
            {AVAILABLE_ICONS.map((iconName, index) => (
              <TouchableOpacity
                key={index}
                className="p-2 m-1 rounded-lg"
                style={{
                  backgroundColor: selectedIcon === iconName 
                    ? "rgba(255, 255, 255, 0.3)" 
                    : "transparent",
                  width: iconSize + 16,
                  height: iconSize + 16,
                }}
                onPress={() => handleIconSelect(iconName)}
              >
                <View className="items-center justify-center flex-1">
                  <Ionicons 
                    name={iconName as any} 
                    size={24} 
                    color={selectedIcon === iconName ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)"} 
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
      <View className="px-6 pt-4 pb-6">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={onBack}>
            <Text className="text-white text-lg">← Back</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-white">Add Urge</Text>
          <View style={{ width: 50 }} />
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-white text-center mb-4">
          Choose or create an urge
        </Text>
        <Text className="text-lg text-white text-center mb-8 opacity-90">
          Select from common urges or create your own
        </Text>

        <View className="mb-8">
          <Text className="text-white font-medium mb-3 text-lg">
            Create custom urge:
          </Text>
          <TextInput
            className="border border-white border-opacity-30 rounded-lg p-4 text-xl text-white"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            placeholder="Type your own urge..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={customUrge}
            onChangeText={handleCustomUrgeChange}
          />
          
          {/* Icon picker for custom urges */}
          {showIconPicker && customUrge.trim().length > 0 && renderIconPicker()}
        </View>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-white opacity-30" />
          <Text className="mx-4 text-white opacity-75">OR</Text>
          <View className="flex-1 h-px bg-white opacity-30" />
        </View>

        <Text className="text-white font-medium mb-4 text-lg">
          Choose from available urges:
        </Text>

        {availableUrges.length > 0 ? (
          <View className="mb-4">
            {availableUrges.map((urge, index) => (
              <TouchableOpacity
                key={index}
                className="p-4 rounded-lg mb-3"
                style={{
                  backgroundColor:
                    selectedUrge === urge.text
                      ? "#FFFFFF"
                      : "rgba(255, 255, 255, 0.2)",
                }}
                onPress={() => handleUrgeSelect(urge.text)}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={urge.icon as any}
                    size={24}
                    color={selectedUrge === urge.text ? "#374151" : "#FFFFFF"}
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    className={`text-xl ${
                      selectedUrge === urge.text ? "text-gray-800" : "text-white"
                    }`}
                  >
                    {urge.text}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="flex-1 justify-center items-center p-6">
            <Text className="text-white text-center opacity-75 text-lg">
              All common urges are already in your list. Create a custom urge
              above.
            </Text>
          </View>
        )}
      </ScrollView>

      <View className="px-6 py-4 border-t border-white border-opacity-20">
        <TouchableOpacity
          className={`rounded-lg py-4 ${!isValidSelection() ? "opacity-50" : ""}`}
          style={{
            backgroundColor: !isValidSelection()
              ? "rgba(255, 255, 255, 0.3)"
              : "#FFFFFF",
          }}
          onPress={handleConfirm}
          disabled={!isValidSelection()}
        >
          <Text
            className="text-center font-semibold text-xl"
            style={{
              color: !isValidSelection()
                ? "rgba(255, 255, 255, 0.7)"
                : "#185e66",
            }}
          >
            {isLoading ? "Adding..." : "Add This Urge"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddUrgeScreen;