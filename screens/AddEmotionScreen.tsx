// screens/AddEmotionScreen.tsx

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
import { COMMON_EMOTIONS } from "../types";
import { useSettings } from "../hooks/useSettings";
import { Ionicons } from "@expo/vector-icons";

interface AddEmotionScreenProps {
  onEmotionSelected: (emotion: string, icon?: string) => void;
  onBack: () => void;
  currentSelectedEmotions?: string[];
  preFilledText?: string;
}

// Curated list of icons that make sense for emotions/feelings
const AVAILABLE_ICONS = [
  "happy-outline",
  "sad-outline",
  "heart-outline",
  "heart-dislike-outline", // Instead of heart-broken-outline
  "heart-half-outline",
  "sunny-outline",
  "cloudy-outline",
  "rainy-outline",
  "thunderstorm-outline",
  "partly-sunny-outline",
  "moon-outline",
  "star-outline",
  "flame-outline",
  "flash-outline",
  "snow-outline",
  "leaf-outline",
  "flower-outline",
  "rose-outline",
  "diamond-outline",
  "trophy-outline",
  "medal-outline",
  "ribbon-outline",
  "gift-outline",
  "balloon-outline",
  "rocket-outline",
  "warning-outline",
  "alert-circle-outline",
  "information-circle-outline",
  "help-circle-outline",
  "checkmark-circle-outline",
  "close-circle-outline",
  "add-circle-outline",
  "remove-circle-outline",
  "refresh-outline",
  "sync-outline",
  "pause-circle-outline",
  "play-circle-outline",
  "stop-circle-outline",
  "battery-charging-outline",
  "battery-dead-outline",
  "battery-full-outline",
  "battery-half-outline",
  "bulb-outline",
  "flashlight-outline",
  "eye-outline",
  "eye-off-outline",
  "glasses-outline",
  "accessibility-outline",
  "fitness-outline",
  "walk-outline",
  "bicycle-outline",
  "car-outline",
  "airplane-outline",
  "boat-outline",
  "train-outline",
  "bus-outline",
  "home-outline",
  "business-outline",
  "school-outline",
  "library-outline",
  "medical-outline",
  "restaurant-outline",
  "cafe-outline",
  "wine-outline",
  "beer-outline",
  "people-outline",
  "person-outline",
  "chatbubble-outline",
  "chatbubbles-outline",
  "call-outline",
  "videocam-outline",
  "camera-outline",
  "musical-notes-outline",
  "headset-outline",
  "volume-high-outline",
  "volume-low-outline",
  "volume-mute-outline",
  "book-outline",
  "journal-outline",
  "newspaper-outline",
  "pencil-outline",
  "brush-outline",
  "color-palette-outline",
  "image-outline",
  "images-outline",
  "film-outline",
  "tv-outline",
  "game-controller-outline",
  "phone-portrait-outline",
  "tablet-portrait-outline",
  "laptop-outline",
  "desktop-outline",
  "watch-outline",
  "time-outline",
  "stopwatch-outline",
  "timer-outline",
  "hourglass-outline",
  "calendar-outline",
  "today-outline",
  "alarm-outline",
  "notifications-outline",
  "mail-outline",
  "chatbubble-ellipses-outline",
  "shield-outline",
  "lock-closed-outline",
  "lock-open-outline",
  "key-outline",
  "finger-print-outline",
  "scan-outline",
  "search-outline",
  "filter-outline",
  "options-outline",
  "settings-outline",
  "cog-outline",
  "build-outline",
  "hammer-outline",
  "construct-outline",
  "pizza-outline",
  "fast-food-outline",
  "ice-cream-outline",
  "nutrition-outline",
  "fitness-outline",
  "barbell-outline",
  "american-football-outline",
  "basketball-outline",
  "football-outline",
  "golf-outline",
  "baseball-outline", // Instead of tennis-outline
  "bed-outline",
  "umbrella-outline",
  "glasses-outline",
  "shirt-outline",
  "bag-outline",
  "briefcase-outline",
  "card-outline",
  "cash-outline",
  "wallet-outline",
  "pricetag-outline",
  "storefront-outline",
  "cart-outline",
  "bag-handle-outline",
  "location-outline",
  "map-outline",
  "compass-outline",
  "navigate-outline",
  "pin-outline",
  "flag-outline",
  "globe-outline",
  "earth-outline",
  "telescope-outline",
  "magnet-outline",
  "hardware-chip-outline",
  "qr-code-outline",
  "barcode-outline",
  "calculator-outline",
  "trending-up-outline",
  "trending-down-outline",
  "stats-chart-outline",
  "bar-chart-outline",
  "pie-chart-outline",
  "analytics-outline",
  "cloud-outline",
  "cloud-download-outline",
  "cloud-upload-outline",
  "download-outline",
  "cloud-upload-outline", // Instead of upload-outline
  "share-outline",
  "copy-outline",
  "duplicate-outline",
  "archive-outline",
  "folder-outline",
  "document-outline",
  "documents-outline",
  "clipboard-outline",
  "list-outline",
  "paw-outline",
  "bug-outline",
  "fish-outline",
  "leaf-outline",
  "bonfire-outline", // Instead of tree-outline
  "bonfire-outline",
  "water-outline",
  "earth-outline",
  "planet-outline",
  "radio-outline",
  "wifi-outline",
  "bluetooth-outline",
  "cellular-outline",
  "battery-charging-outline",
  "power-outline",
  "flash-off-outline",
  "flashlight-outline",
  "contrast-outline",
  "invert-mode-outline",
];

const AddEmotionScreen: React.FC<AddEmotionScreenProps> = ({
  onEmotionSelected,
  onBack,
  currentSelectedEmotions = [],
  preFilledText = "",
}) => {
  const [customEmotion, setCustomEmotion] = useState(preFilledText);
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("help-circle-outline");
  const [showIconPicker, setShowIconPicker] = useState(
    preFilledText.length > 0
  );
  const [isLoading, setIsLoading] = useState(false);
  const { settings, updateSettings } = useSettings();

  // Filter out emotions that are already in user's selected list
  const availableEmotions = COMMON_EMOTIONS.filter(
    (emotion) => !currentSelectedEmotions.includes(emotion.text)
  );

  const handleEmotionSelect = (emotionText: string) => {
    setSelectedEmotion(emotionText);
    setCustomEmotion("");
    setShowIconPicker(false);
  };

  const handleCustomEmotionChange = (text: string) => {
    setCustomEmotion(text);
    setSelectedEmotion("");
    // Show icon picker when user starts typing custom emotion
    if (text.trim().length > 0 && !showIconPicker) {
      setShowIconPicker(true);
    }
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
  };

  const handleConfirm = async () => {
    const emotionToAdd = customEmotion.trim() || selectedEmotion;
    if (emotionToAdd) {
      setIsLoading(true);
      try {
        // For custom emotions, we need to store both the text and icon
        // For predefined emotions, we use their existing icon
        const isCustomEmotion = customEmotion.trim().length > 0;
        const iconToUse = isCustomEmotion ? selectedIcon : undefined;

        // Add the new emotion to user's recent emotions
        const currentEmotions =
          (settings as any)?.recentEmotions ||
          COMMON_EMOTIONS.map((e) => e.text);

        // Check if emotion already exists
        if (currentEmotions.includes(emotionToAdd)) {
          // Just select it without adding
          onEmotionSelected(emotionToAdd, iconToUse);
          return;
        }

        const newEmotionsList = [emotionToAdd, ...currentEmotions];

        await updateSettings({
          ...settings,
          recentEmotions: newEmotionsList,
        } as any);

        // Call the callback to set this emotion in QuickLog
        onEmotionSelected(emotionToAdd, iconToUse);
      } catch (error) {
        Alert.alert("Error", "Failed to save the emotion. Please try again.", [
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
      (customEmotion.trim().length > 0 || selectedEmotion.length > 0)
    );
  };

  const getIconForEmotion = (emotionText: string) => {
    const emotionObj = COMMON_EMOTIONS.find((e) => e.text === emotionText);
    return emotionObj?.icon || "happy-outline";
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
          <Text className="text-2xl font-semibold text-white">Add Emotion</Text>
          <View style={{ width: 50 }} />
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-white text-center mb-4">
          Choose or create an emotion
        </Text>
        <Text className="text-lg text-white text-center mb-8 opacity-90">
          Select from common emotions or create your own
        </Text>

        <View className="mb-8">
          <Text className="text-white font-medium mb-3 text-lg">
            Create custom emotion:
          </Text>
          <TextInput
            className="border border-white border-opacity-30 rounded-lg p-4 text-xl text-white"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            placeholder="Type your own emotion..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={customEmotion}
            onChangeText={handleCustomEmotionChange}
            returnKeyType="done"
          />

          {/* Icon picker for custom emotions */}
          {showIconPicker &&
            customEmotion.trim().length > 0 &&
            renderIconPicker()}
        </View>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-white opacity-30" />
          <Text className="mx-4 text-white opacity-75">OR</Text>
          <View className="flex-1 h-px bg-white opacity-30" />
        </View>

        <Text className="text-white font-medium mb-4 text-lg">
          Choose from available emotions:
        </Text>

        {availableEmotions.length > 0 ? (
          <View className="mb-4">
            {availableEmotions.map((emotion, index) => (
              <TouchableOpacity
                key={index}
                className="p-4 rounded-lg mb-3"
                style={{
                  backgroundColor:
                    selectedEmotion === emotion.text
                      ? "#FFFFFF"
                      : "rgba(255, 255, 255, 0.2)",
                }}
                onPress={() => handleEmotionSelect(emotion.text)}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={emotion.icon as any}
                    size={24}
                    color={
                      selectedEmotion === emotion.text ? "#374151" : "#FFFFFF"
                    }
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    className={`text-xl ${
                      selectedEmotion === emotion.text
                        ? "text-gray-800"
                        : "text-white"
                    }`}
                  >
                    {emotion.text}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="flex-1 justify-center items-center p-6">
            <Text className="text-white text-center opacity-75 text-lg">
              All common emotions are already in your list. Create a custom
              emotion above.
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
              : "#10B981",
          }}
          onPress={handleConfirm}
          disabled={!isValidSelection()}
        >
          <Text
            className="text-center font-semibold text-2xl"
            style={{
              color: !isValidSelection()
                ? "rgba(255, 255, 255, 0.7)"
                : "#FFFFFF",
            }}
          >
            {isLoading ? "Adding..." : "Add This Emotion"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddEmotionScreen;