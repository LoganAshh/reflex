// screens/AddEnvironmentScreen.tsx

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
import { COMMON_ENVIRONMENTS } from "../types";
import { useSettings } from "../hooks/useSettings";
import { Ionicons } from "@expo/vector-icons";

interface AddEnvironmentScreenProps {
  onEnvironmentSelected: (environment: string, icon?: string) => void;
  onBack: () => void;
  currentSelectedEnvironments?: string[];
  preFilledText?: string;
}

// Curated list of icons that make sense for environments/places
const AVAILABLE_ICONS = [
  "home-outline",
  "business-outline",
  "school-outline",
  "library-outline",
  "medical-outline",
  "restaurant-outline",
  "cafe-outline",
  "fast-food-outline",
  "storefront-outline",
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
  "desktop-outline",
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

const AddEnvironmentScreen: React.FC<AddEnvironmentScreenProps> = ({
  onEnvironmentSelected,
  onBack,
  currentSelectedEnvironments = [],
  preFilledText = "",
}) => {
  const [customEnvironment, setCustomEnvironment] = useState(preFilledText);
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("location-outline");
  const [showIconPicker, setShowIconPicker] = useState(
    preFilledText.length > 0
  );
  const [isLoading, setIsLoading] = useState(false);
  const { settings, updateSettings } = useSettings();

  // Filter out environments that are already in user's selected list
  const availableEnvironments = COMMON_ENVIRONMENTS.filter(
    (environment) => !currentSelectedEnvironments.includes(environment.text)
  );

  const handleEnvironmentSelect = (environmentText: string) => {
    setSelectedEnvironment(environmentText);
    setCustomEnvironment("");
    setShowIconPicker(false);
  };

  const handleCustomEnvironmentChange = (text: string) => {
    setCustomEnvironment(text);
    setSelectedEnvironment("");
    // Show icon picker when user starts typing custom environment
    if (text.trim().length > 0 && !showIconPicker) {
      setShowIconPicker(true);
    }
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
  };

  const handleConfirm = async () => {
    const environmentToAdd = customEnvironment.trim() || selectedEnvironment;
    if (environmentToAdd) {
      setIsLoading(true);
      try {
        // For custom environments, we need to store both the text and icon
        // For predefined environments, we use their existing icon
        const isCustomEnvironment = customEnvironment.trim().length > 0;
        const iconToUse = isCustomEnvironment 
          ? selectedIcon 
          : COMMON_ENVIRONMENTS.find(e => e.text === selectedEnvironment)?.icon || "location-outline";

        await onEnvironmentSelected(environmentToAdd, iconToUse);
      } catch (error) {
        Alert.alert("Error", "Failed to add environment. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderIconPicker = () => {
    const screenWidth = Dimensions.get("window").width;
    const iconSize = 48;
    const iconsPerRow = Math.floor((screenWidth - 48) / (iconSize + 16));

    return (
      <View className="mb-6">
        <Text className="text-white font-medium mb-3 text-lg">
          Choose an icon:
        </Text>
        <ScrollView
          className="max-h-64"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {AVAILABLE_ICONS.map((iconName, index) => (
              <TouchableOpacity
                key={index}
                className="mb-4 rounded-lg items-center justify-center"
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
            Add Environment
          </Text>
          <View style={{ width: 50 }} />
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-white text-center mb-4">
          Where will you go?
        </Text>
        <Text className="text-lg text-white text-center mb-8 opacity-90">
          Choose or create a new environment to switch to
        </Text>

        <View className="mb-8">
          <Text className="text-white font-medium mb-3 text-lg">
            Create custom environment:
          </Text>
          <TextInput
            className="border border-white border-opacity-30 rounded-lg p-4 text-xl text-white"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            placeholder="Type your own environment..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={customEnvironment}
            onChangeText={handleCustomEnvironmentChange}
            returnKeyType="done"
          />

          {/* Icon picker for custom environments */}
          {showIconPicker &&
            customEnvironment.trim().length > 0 &&
            renderIconPicker()}
        </View>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-white opacity-30" />
          <Text className="mx-4 text-white opacity-75">OR</Text>
          <View className="flex-1 h-px bg-white opacity-30" />
        </View>

        <Text className="text-white font-medium mb-4 text-lg">
          Choose from common environments:
        </Text>

        {availableEnvironments.length > 0 ? (
          <View className="mb-8">
            {availableEnvironments.map((environment, index) => (
              <TouchableOpacity
                key={index}
                className="p-4 rounded-lg mb-3"
                style={{
                  backgroundColor:
                    selectedEnvironment === environment.text
                      ? "#FFFFFF"
                      : "rgba(255, 255, 255, 0.2)",
                }}
                onPress={() => handleEnvironmentSelect(environment.text)}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={environment.icon as any}
                    size={24}
                    color={
                      selectedEnvironment === environment.text
                        ? "#374151"
                        : "#FFFFFF"
                    }
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    className={`text-xl ${
                      selectedEnvironment === environment.text
                        ? "text-gray-800"
                        : "text-white"
                    }`}
                  >
                    {environment.text}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="mb-8 p-6 bg-white bg-opacity-10 rounded-lg">
            <Text className="text-white text-center opacity-75">
              All common environments are already in your list.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom confirmation button */}
      <View className="px-6 py-4 border-t border-white border-opacity-20">
        <TouchableOpacity
          className={`w-full rounded-lg py-4 ${
            !customEnvironment.trim() && !selectedEnvironment
              ? "opacity-50"
              : ""
          }`}
          style={{
            backgroundColor:
              !customEnvironment.trim() && !selectedEnvironment
                ? "rgba(255, 255, 255, 0.3)"
                : "#10B981",
          }}
          onPress={handleConfirm}
          disabled={
            (!customEnvironment.trim() && !selectedEnvironment) || isLoading
          }
        >
          <Text
            className="text-center font-semibold text-xl"
            style={{
              color:
                !customEnvironment.trim() && !selectedEnvironment
                  ? "rgba(255, 255, 255, 0.7)"
                  : "#FFFFFF",
            }}
          >
            {isLoading ? "Adding..." : "Add Environment"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddEnvironmentScreen;