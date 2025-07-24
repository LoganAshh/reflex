// components/UrgeSelectionSettings.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { COMMON_URGES } from "../types";
import { useSettings } from "../hooks/useSettings";

interface UrgeSelectionSettingsProps {
  onClose?: () => void;
  showHeader?: boolean;
}

const UrgeSelectionSettings: React.FC<UrgeSelectionSettingsProps> = ({
  onClose,
  showHeader = true,
}) => {
  const { settings, updateSettings } = useSettings();
  const [selectedUrges, setSelectedUrges] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settings?.selectedUrges) {
      setSelectedUrges([...settings.selectedUrges]);
    }
  }, [settings]);

  const toggleUrgeSelection = (urge: string) => {
    const newSelection = selectedUrges.includes(urge)
      ? selectedUrges.filter((u) => u !== urge)
      : [...selectedUrges, urge];

    setSelectedUrges(newSelection);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateSettings({ selectedUrges });
      setHasChanges(false);
      Alert.alert(
        "Settings Saved",
        "Your urge tracking preferences have been updated.",
        [{ text: "OK", onPress: onClose }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save settings. Please try again.");
    }
  };

  const handleSelectAll = () => {
    setSelectedUrges([...COMMON_URGES]);
    setHasChanges(true);
  };

  const handleSelectNone = () => {
    setSelectedUrges([]);
    setHasChanges(true);
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to cancel?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Cancel",
            style: "destructive",
            onPress: () => {
              setSelectedUrges(settings?.selectedUrges || []);
              setHasChanges(false);
              onClose?.();
            },
          },
        ]
      );
    } else {
      onClose?.();
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
      {showHeader && (
        <View className="px-6 pt-4 pb-2 border-b border-white border-opacity-20">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={handleCancel}>
              <Text className="text-white text-lg">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-white text-xl font-semibold">
              Urge Selection
            </Text>
            <TouchableOpacity onPress={handleSave} disabled={!hasChanges}>
              <Text
                className={`text-lg ${hasChanges ? "text-white" : "text-gray-400"}`}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView className="flex-1 px-6 py-4">
        {/* Header section */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-white mb-2">
            Choose Your Focus
          </Text>
          <Text className="text-white opacity-75 text-lg leading-6">
            Select the urges you want to track. Only selected urges will appear
            in your QuickLog for focused tracking.
          </Text>
        </View>

        {/* Selection count and quick actions */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <Text className="text-white font-medium">
                {selectedUrges.length} of {COMMON_URGES.length} selected
              </Text>
            </View>

            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={handleSelectAll}
                className="bg-white bg-opacity-20 rounded-lg px-3 py-2"
              >
                <Text className="text-white text-sm">Select All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSelectNone}
                className="bg-white bg-opacity-20 rounded-lg px-3 py-2"
              >
                <Text className="text-white text-sm">Select None</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Urge selection list */}
        <View className="mb-6">
          {COMMON_URGES.map((urge, index) => {
            const isSelected = selectedUrges.includes(urge);
            return (
              <TouchableOpacity
                key={index}
                className="p-4 rounded-lg mb-3 border"
                style={{
                  backgroundColor: isSelected
                    ? "#FFFFFF"
                    : "rgba(255, 255, 255, 0.1)",
                  borderColor: isSelected
                    ? "transparent"
                    : "rgba(255, 255, 255, 0.3)",
                }}
                onPress={() => toggleUrgeSelection(urge)}
              >
                <View className="flex-row items-center justify-between">
                  <Text
                    className={`text-lg font-medium ${
                      isSelected ? "text-gray-800" : "text-white"
                    }`}
                  >
                    {urge}
                  </Text>
                  <View
                    className="w-6 h-6 rounded-full border-2 items-center justify-center"
                    style={{
                      borderColor: isSelected
                        ? "#10B981"
                        : "rgba(255, 255, 255, 0.5)",
                      backgroundColor: isSelected ? "#10B981" : "transparent",
                    }}
                  >
                    {isSelected && (
                      <Text className="text-white text-sm font-bold">✓</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Helper text */}
        <View className="mb-8 bg-white bg-opacity-10 rounded-lg p-4">
          <Text className="text-white text-center text-sm opacity-75">
            💡 Tip: Focus on 3-5 urges for the best tracking experience. You can
            always adjust your selection later.
          </Text>
        </View>

        {/* Save button for non-modal usage */}
        {!showHeader && (
          <TouchableOpacity
            className={`rounded-lg py-4 mb-4 ${
              hasChanges ? "bg-white" : "bg-gray-400 opacity-50"
            }`}
            onPress={handleSave}
            disabled={!hasChanges}
          >
            <Text
              className={`text-center font-semibold text-lg ${
                hasChanges ? "text-gray-800" : "text-gray-600"
              }`}
            >
              Save Changes
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UrgeSelectionSettings;
