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
import { Ionicons } from "@expo/vector-icons";

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
    (urge) => !currentSelectedUrges.includes(urge.text)
  );

  const handleUrgeSelect = (urgeText: string) => {
    setSelectedUrge(urgeText);
    setCustomUrge("");
  };

  const handleCustomUrgeChange = (text: string) => {
    setCustomUrge(text);
    setSelectedUrge("");
  };

  const isValidSelection = () => {
    return customUrge.trim().length > 0 || selectedUrge.length > 0;
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
        Alert.alert("Error", "Failed to save the urge. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
      {/* Header */}
      <View className="px-6 pt-4 pb-2 border-b border-white border-opacity-20">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-semibold">Add Urge</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <View className="flex-1 px-6 py-6">
        {/* Custom urge input */}
        <View className="mb-8">
          <Text className="text-white font-medium mb-4 text-lg opacity-90">
            Create a custom urge:
          </Text>
          <TextInput
            className="border border-white border-opacity-30 rounded-lg p-4 text-xl text-white"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            placeholder="Type your custom urge..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={customUrge}
            onChangeText={handleCustomUrgeChange}
          />
        </View>

        {/* Separator */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-white opacity-30" />
          <Text className="text-white mx-4 opacity-75">
            or choose from below
          </Text>
          <View className="flex-1 h-px bg-white opacity-30" />
        </View>

        {/* Available urges */}
        <Text className="text-white font-medium mb-4 text-lg opacity-90">
          Common urges:
        </Text>

        {availableUrges.length > 0 ? (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
                    name={urge.icon}
                    size={24}
                    color={selectedUrge === urge.text ? "#374151" : "#FFFFFF"}
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    className={`text-xl ${
                      selectedUrge === urge.text
                        ? "text-gray-800"
                        : "text-white"
                    }`}
                  >
                    {urge.text}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View className="flex-1 justify-center items-center p-6">
            <Ionicons
              name="checkmark-circle"
              size={64}
              color="rgba(255, 255, 255, 0.5)"
            />
            <Text className="text-white text-center opacity-75 text-lg mt-4">
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
