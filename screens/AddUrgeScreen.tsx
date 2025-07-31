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
} from "react-native";
import { COMMON_URGES } from "../types";
import { useSettings } from "../hooks/useSettings";

interface AddUrgeScreenProps {
  onUrgeSelected: (urge: string) => void;
  onBack: () => void;
  currentSelectedUrges?: string[];
}

const AddUrgeScreen: React.FC<AddUrgeScreenProps> = ({
  onUrgeSelected,
  onBack,
  currentSelectedUrges = [],
}) => {
  const [customUrge, setCustomUrge] = useState("");
  const [selectedUrge, setSelectedUrge] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { settings, updateSettings } = useSettings();

  // Filter out urges that are already in user's selected list
  const availableUrges = COMMON_URGES.filter(
    (urge) => !currentSelectedUrges.includes(urge)
  );

  const handleUrgeSelect = (urge: string) => {
    setSelectedUrge(urge);
    setCustomUrge("");
  };

  const handleCustomUrgeChange = (text: string) => {
    setCustomUrge(text);
    setSelectedUrge("");
  };

  const handleConfirm = async () => {
    const urgeToAdd = customUrge.trim() || selectedUrge;
    if (urgeToAdd) {
      setIsLoading(true);
      try {
        // Add the new urge to user's selected urges
        const currentUrges = settings?.selectedUrges || [];

        // Check if urge already exists
        if (currentUrges.includes(urgeToAdd)) {
          // Just select it without adding
          onUrgeSelected(urgeToAdd);
          return;
        }

        const updatedUrges = [...currentUrges, urgeToAdd];

        await updateSettings({
          ...settings,
          selectedUrges: updatedUrges,
        });

        // Call the callback to set this urge in QuickLog
        onUrgeSelected(urgeToAdd);
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

      <View className="flex-1 px-6">
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
          <ScrollView
            className="flex-1 mb-4"
            showsVerticalScrollIndicator={false}
          >
            {availableUrges.map((urge, index) => (
              <TouchableOpacity
                key={index}
                className="p-4 rounded-lg mb-3"
                style={{
                  backgroundColor:
                    selectedUrge === urge
                      ? "#FFFFFF"
                      : "rgba(255, 255, 255, 0.2)",
                }}
                onPress={() => handleUrgeSelect(urge)}
              >
                <Text
                  className={`text-xl ${
                    selectedUrge === urge ? "text-gray-800" : "text-white"
                  }`}
                >
                  {urge}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View className="flex-1 justify-center items-center p-6">
            <Text className="text-white text-center opacity-75 text-lg">
              All common urges are already in your list. Create a custom urge
              above.
            </Text>
          </View>
        )}
      </View>

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
