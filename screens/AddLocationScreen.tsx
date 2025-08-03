// screens/AddLocationScreen.tsx

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
import { COMMON_LOCATIONS } from "../types";
import { useSettings } from "../hooks/useSettings";
import { Ionicons } from "@expo/vector-icons";

interface AddLocationScreenProps {
  onLocationSelected: (location: string, icon?: string) => void;
  onBack: () => void;
  currentSelectedLocations?: string[];
  preFilledText?: string;
}

// Curated list of icons that make sense for locations/places
const AVAILABLE_ICONS = [
  "home-outline",
  "business-outline",
  "school-outline",
  "library-outline",
  "medical-outline",
  "restaurant-outline",
  "cafe-outline",
  "fast-food-outline",
  "pizza-outline",
  "ice-cream-outline",
  "storefront-outline",
  "bag-outline",
  "cart-outline",
  "car-outline",
  "bus-outline",
  "train-outline",
  "airplane-outline",
  "boat-outline",
  "bicycle-outline",
  "walk-outline",
  "fitness-outline",
  "basketball-outline",
  "football-outline",
  "bed-outline",
  "tv-outline",
  "game-controller-outline",
  "laptop-outline",
  "phone-portrait-outline",
  "headset-outline",
  "musical-notes-outline",
  "camera-outline",
  "videocam-outline",
  "book-outline",
  "journal-outline",
  "newspaper-outline",
  "pencil-outline",
  "brush-outline",
  "color-palette-outline",
  "hammer-outline",
  "build-outline",
  "settings-outline",
  "cog-outline",
  "location-outline",
  "map-outline",
  "compass-outline",
  "navigate-outline",
  "pin-outline",
  "flag-outline",
  "star-outline",
  "bookmark-outline",
  "heart-outline",
  "happy-outline",
  "sad-outline",
  "people-outline",
  "person-outline",
  "chatbubble-outline",
  "wine-outline",
  "beer-outline",
  "globe-outline",
  "earth-outline",
  "sunny-outline",
  "moon-outline",
  "partly-sunny-outline",
  "cloud-outline",
  "thunderstorm-outline",
  "snow-outline",
  "leaf-outline",
  "flower-outline",
  "rose-outline",
  "tree-outline",
  "water-outline",
  "flame-outline",
  "flash-outline",
  "diamond-outline",
  "trophy-outline",
  "medal-outline",
  "ribbon-outline",
  "gift-outline",
  "balloon-outline",
  "rocket-outline",
  "bulb-outline",
  "flashlight-outline",
  "battery-charging-outline",
  "hardware-chip-outline",
  "telescope-outline",
  "magnet-outline",
  "shield-outline",
  "lock-closed-outline",
  "key-outline",
  "scan-outline",
  "qr-code-outline",
  "barcode-outline",
  "calculator-outline",
  "time-outline",
  "stopwatch-outline",
  "timer-outline",
  "hourglass-outline",
  "calendar-outline",
  "today-outline",
  "refresh-outline",
  "sync-outline",
  "download-outline",
  "cloud-download-outline",
  "information-circle-outline",
  "help-circle-outline",
  "alert-circle-outline",
  "warning-outline",
  "checkmark-circle-outline",
  "close-circle-outline",
  "add-circle-outline",
  "remove-circle-outline",
  "shirt-outline",
  "bag-handle-outline",
  "briefcase-outline",
  "paw-outline",
  "bug-outline",
  "fish-outline",
  "bonfire-outline",
  "egg-outline",
];

const AddLocationScreen: React.FC<AddLocationScreenProps> = ({
  onLocationSelected,
  onBack,
  currentSelectedLocations = [],
  preFilledText = "",
}) => {
  const [customLocation, setCustomLocation] = useState(preFilledText);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("help-circle-outline");
  const [showIconPicker, setShowIconPicker] = useState(
    preFilledText.length > 0
  );
  const [isLoading, setIsLoading] = useState(false);
  const { settings, updateSettings } = useSettings();

  // Filter out locations that are already in user's selected list
  const availableLocations = COMMON_LOCATIONS.filter(
    (location) => !currentSelectedLocations.includes(location.text)
  );

  const handleLocationSelect = (locationText: string) => {
    setSelectedLocation(locationText);
    setCustomLocation("");
    setShowIconPicker(false);
  };

  const handleCustomLocationChange = (text: string) => {
    setCustomLocation(text);
    setSelectedLocation("");
    // Show icon picker when user starts typing custom location
    if (text.trim().length > 0 && !showIconPicker) {
      setShowIconPicker(true);
    }
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
  };

  const handleConfirm = async () => {
    const locationToAdd = customLocation.trim() || selectedLocation;
    if (locationToAdd) {
      setIsLoading(true);
      try {
        // For custom locations, we need to store both the text and icon
        // For predefined locations, we use their existing icon
        const isCustomLocation = customLocation.trim().length > 0;
        const iconToUse = isCustomLocation ? selectedIcon : undefined;

        // Add the new location to user's recent locations
        const currentLocations =
          (settings as any)?.recentLocations ||
          COMMON_LOCATIONS.map((l) => l.text);

        // Check if location already exists
        if (currentLocations.includes(locationToAdd)) {
          // Just select it without adding
          onLocationSelected(locationToAdd, iconToUse);
          return;
        }

        const newLocationsList = [locationToAdd, ...currentLocations];

        await updateSettings({
          ...settings,
          recentLocations: newLocationsList,
        } as any);

        // Call the callback to set this location in QuickLog
        onLocationSelected(locationToAdd, iconToUse);
      } catch (error) {
        Alert.alert("Error", "Failed to save the location. Please try again.", [
          { text: "OK" },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isValidSelection = () => {
    return (
      !isLoading &&
      (customLocation.trim().length > 0 || selectedLocation.length > 0)
    );
  };

  const getIconForLocation = (locationText: string) => {
    const locationObj = COMMON_LOCATIONS.find((l) => l.text === locationText);
    return locationObj?.icon || "location-outline";
  };

  const renderIconPicker = () => {
    const screenWidth = Dimensions.get("window").width;
    const iconSize = 40;
    const padding = 24; // 12px on each side
    const gap = 12;
    const iconsPerRow = Math.floor(
      (screenWidth - padding * 2) / (iconSize + gap)
    );

    return (
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white font-medium text-lg">
            Choose an icon:
          </Text>
          <TouchableOpacity
            onPress={() => setShowIconPicker(false)}
            className="p-2"
          >
            <Text className="text-white opacity-75">Hide</Text>
          </TouchableOpacity>
        </View>

        {/* Icon grid */}
        <ScrollView
          className="max-h-64 rounded-lg p-3 border border-white border-opacity-30"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap justify-center">
            {AVAILABLE_ICONS.map((iconName, index) => (
              <TouchableOpacity
                key={index}
                className="p-2 m-1 rounded-lg"
                style={{
                  backgroundColor:
                    selectedIcon === iconName
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
                    color={
                      selectedIcon === iconName
                        ? "#FFFFFF"
                        : "rgba(255, 255, 255, 0.7)"
                    }
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
          <Text className="text-2xl font-semibold text-white">
            Add Location
          </Text>
          <View style={{ width: 50 }} />
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-white text-center mb-4">
          Choose or create a location
        </Text>
        <Text className="text-lg text-white text-center mb-8 opacity-90">
          Select from common locations or create your own
        </Text>

        <View className="mb-8">
          <Text className="text-white font-medium mb-3 text-lg">
            Create custom location:
          </Text>
          <TextInput
            className="border border-white border-opacity-30 rounded-lg p-4 text-xl text-white"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            placeholder="Type your own location..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={customLocation}
            onChangeText={handleCustomLocationChange}
            returnKeyType="done"
          />

          {/* Icon picker for custom locations */}
          {showIconPicker &&
            customLocation.trim().length > 0 &&
            renderIconPicker()}
        </View>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-white opacity-30" />
          <Text className="mx-4 text-white opacity-75">OR</Text>
          <View className="flex-1 h-px bg-white opacity-30" />
        </View>

        <Text className="text-white font-medium mb-4 text-lg">
          Choose from available locations:
        </Text>

        {availableLocations.length > 0 ? (
          <View className="mb-4">
            {availableLocations.map((location, index) => (
              <TouchableOpacity
                key={index}
                className="p-4 rounded-lg mb-3"
                style={{
                  backgroundColor:
                    selectedLocation === location.text
                      ? "#FFFFFF"
                      : "rgba(255, 255, 255, 0.2)",
                }}
                onPress={() => handleLocationSelect(location.text)}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={location.icon as any}
                    size={24}
                    color={
                      selectedLocation === location.text ? "#374151" : "#FFFFFF"
                    }
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    className={`text-xl ${
                      selectedLocation === location.text
                        ? "text-gray-800"
                        : "text-white"
                    }`}
                  >
                    {location.text}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="flex-1 justify-center items-center p-6">
            <Text className="text-white text-center opacity-75 text-lg">
              All common locations are already in your list. Create a custom
              location above.
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
            {isLoading ? "Adding..." : "Add This Location"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddLocationScreen;
