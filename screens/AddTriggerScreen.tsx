// screens/AddTriggerScreen.tsx

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
import { COMMON_TRIGGERS } from "../types";
import { useSettings } from "../hooks/useSettings";
import { Ionicons } from "@expo/vector-icons";

interface AddTriggerScreenProps {
  onTriggerSelected: (trigger: string, icon?: string) => void;
  onBack: () => void;
  currentSelectedTriggers?: string[];
  preFilledText?: string;
}

// Curated list of icons that make sense for triggers/situations
const AVAILABLE_ICONS = [
  "alert-circle-outline",
  "warning-outline",
  "flash-outline",
  "thunderstorm-outline",
  "flame-outline",
  "sad-outline",
  "happy-outline",
  "heart-outline",
  "heart-broken-outline",
  "people-outline",
  "person-outline",
  "chatbubble-outline",
  "notifications-outline",
  "phone-portrait-outline",
  "tv-outline",
  "laptop-outline",
  "game-controller-outline",
  "musical-notes-outline",
  "headset-outline",
  "camera-outline",
  "videocam-outline",
  "book-outline",
  "newspaper-outline",
  "journal-outline",
  "school-outline",
  "business-outline",
  "home-outline",
  "car-outline",
  "airplane-outline",
  "train-outline",
  "walk-outline",
  "bicycle-outline",
  "fitness-outline",
  "bed-outline",
  "restaurant-outline",
  "cafe-outline",
  "wine-outline",
  "beer-outline",
  "fast-food-outline",
  "pizza-outline",
  "ice-cream-outline",
  "cart-outline",
  "bag-outline",
  "card-outline",
  "cash-outline",
  "time-outline",
  "stopwatch-outline",
  "timer-outline",
  "hourglass-outline",
  "calendar-outline",
  "today-outline",
  "sunny-outline",
  "moon-outline",
  "partly-sunny-outline",
  "cloud-outline",
  "snow-outline",
  "leaf-outline",
  "flower-outline",
  "rose-outline",
  "globe-outline",
  "location-outline",
  "map-outline",
  "compass-outline",
  "navigate-outline",
  "star-outline",
  "bookmark-outline",
  "flag-outline",
  "pin-outline",
  "trophy-outline",
  "medal-outline",
  "ribbon-outline",
  "gift-outline",
  "balloon-outline",
  "diamond-outline",
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
  "settings-outline",
  "cog-outline",
  "build-outline",
  "hammer-outline",
  "brush-outline",
  "color-palette-outline",
  "pencil-outline",
  "refresh-outline",
  "sync-outline",
  "download-outline",
  "information-circle-outline",
  "help-circle-outline",
  "checkmark-circle-outline",
  "close-circle-outline",
  "add-circle-outline",
  "remove-circle-outline",
  "medical-outline",
  "library-outline",
  "paw-outline",
  "bug-outline",
  "fish-outline",
  "bonfire-outline",
  "egg-outline",
  "shirt-outline",
  "boat-outline",
];

const AddTriggerScreen: React.FC<AddTriggerScreenProps> = ({
  onTriggerSelected,
  onBack,
  currentSelectedTriggers = [],
  preFilledText = "",
}) => {
  const [customTrigger, setCustomTrigger] = useState(preFilledText);
  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("help-circle-outline");
  const [showIconPicker, setShowIconPicker] = useState(
    preFilledText.length > 0
  );
  const [isLoading, setIsLoading] = useState(false);
  const { settings, updateSettings } = useSettings();

  // Filter out triggers that are already in user's selected list
  const availableTriggers = COMMON_TRIGGERS.filter(
    (trigger) => !currentSelectedTriggers.includes(trigger.text)
  );

  const handleTriggerSelect = (triggerText: string) => {
    setSelectedTrigger(triggerText);
    setCustomTrigger("");
    setShowIconPicker(false);
  };

  const handleCustomTriggerChange = (text: string) => {
    setCustomTrigger(text);
    setSelectedTrigger("");
    // Show icon picker when user starts typing custom trigger
    if (text.trim().length > 0 && !showIconPicker) {
      setShowIconPicker(true);
    }
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
  };

  const handleConfirm = async () => {
    const triggerToAdd = customTrigger.trim() || selectedTrigger;
    if (triggerToAdd) {
      setIsLoading(true);
      try {
        // For custom triggers, we need to store both the text and icon
        // For predefined triggers, we use their existing icon
        const isCustomTrigger = customTrigger.trim().length > 0;
        const iconToUse = isCustomTrigger ? selectedIcon : undefined;

        // Add the new trigger to user's recent triggers
        const currentTriggers =
          (settings as any)?.recentTriggers ||
          COMMON_TRIGGERS.map((t) => t.text);

        // Check if trigger already exists
        if (currentTriggers.includes(triggerToAdd)) {
          // Just select it without adding
          onTriggerSelected(triggerToAdd, iconToUse);
          return;
        }

        const newTriggersList = [triggerToAdd, ...currentTriggers];

        await updateSettings({
          ...settings,
          recentTriggers: newTriggersList,
        } as any);

        // Call the callback to set this trigger in QuickLog
        onTriggerSelected(triggerToAdd, iconToUse);
      } catch (error) {
        Alert.alert("Error", "Failed to save the trigger. Please try again.", [
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
      (customTrigger.trim().length > 0 || selectedTrigger.length > 0)
    );
  };

  const getIconForTrigger = (triggerText: string) => {
    const triggerObj = COMMON_TRIGGERS.find((t) => t.text === triggerText);
    return triggerObj?.icon || "help-circle-outline";
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
          <Text className="text-2xl font-semibold text-white">Add Trigger</Text>
          <View style={{ width: 50 }} />
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-white text-center mb-4">
          Choose or create a trigger
        </Text>
        <Text className="text-lg text-white text-center mb-8 opacity-90">
          Select from common triggers or create your own
        </Text>

        <View className="mb-8">
          <Text className="text-white font-medium mb-3 text-lg">
            Create custom trigger:
          </Text>
          <TextInput
            className="border border-white border-opacity-30 rounded-lg p-4 text-xl text-white"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            placeholder="Type your own trigger..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={customTrigger}
            onChangeText={handleCustomTriggerChange}
            returnKeyType="done"
          />

          {/* Icon picker for custom triggers */}
          {showIconPicker &&
            customTrigger.trim().length > 0 &&
            renderIconPicker()}
        </View>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-white opacity-30" />
          <Text className="mx-4 text-white opacity-75">OR</Text>
          <View className="flex-1 h-px bg-white opacity-30" />
        </View>

        <Text className="text-white font-medium mb-4 text-lg">
          Choose from available triggers:
        </Text>

        {availableTriggers.length > 0 ? (
          <View className="mb-4">
            {availableTriggers.map((trigger, index) => (
              <TouchableOpacity
                key={index}
                className="p-4 rounded-lg mb-3"
                style={{
                  backgroundColor:
                    selectedTrigger === trigger.text
                      ? "#FFFFFF"
                      : "rgba(255, 255, 255, 0.2)",
                }}
                onPress={() => handleTriggerSelect(trigger.text)}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={trigger.icon as any}
                    size={24}
                    color={
                      selectedTrigger === trigger.text ? "#374151" : "#FFFFFF"
                    }
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    className={`text-xl ${
                      selectedTrigger === trigger.text
                        ? "text-gray-800"
                        : "text-white"
                    }`}
                  >
                    {trigger.text}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="flex-1 justify-center items-center p-6">
            <Text className="text-white text-center opacity-75 text-lg">
              All common triggers are already in your list. Create a custom
              trigger above.
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
            {isLoading ? "Adding..." : "Add This Trigger"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddTriggerScreen;
