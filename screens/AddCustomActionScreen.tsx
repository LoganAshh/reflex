// screens/AddCustomActionScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ReplacementAction } from "../types";

interface AddCustomActionScreenProps {
  onSave: (action: Omit<ReplacementAction, "id" | "timesUsed">) => void;
  onCancel: () => void;
}

const AddCustomActionScreen: React.FC<AddCustomActionScreenProps> = ({
  onSave,
  onCancel,
}) => {
  const [emoji, setEmoji] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "mindful" | "physical" | "social" | "creative" | "productive"
  >("mindful");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("easy");

  const categories = [
    { id: "mindful", name: "Mindful", icon: "🧘" },
    { id: "physical", name: "Physical", icon: "🏃" },
    { id: "social", name: "Social", icon: "👥" },
    { id: "creative", name: "Creative", icon: "🎨" },
    { id: "productive", name: "Productive", icon: "⚡" },
  ];

  const difficulties = [
    { id: "easy", name: "Easy", color: "bg-green-400", description: "Quick & simple" },
    { id: "medium", name: "Medium", color: "bg-yellow-400", description: "Moderate effort" },
    { id: "hard", name: "Hard", color: "bg-red-400", description: "More challenging" },
  ];

  const commonEmojis = [
    "🎯", "💫", "⭐", "🌟", "✨", "🔥", "💪", "🚀",
    "🌈", "🌸", "🌺", "🌻", "🍃", "🌿", "🌱", "🌊",
    "☀️", "🌙", "⚡", "💎", "🎨", "🎭", "🎪", "🎵",
    "📖", "✏️", "📝", "🔮", "🎲", "🧩", "🎪", "🎊"
  ];

  const validateForm = () => {
    if (!emoji.trim()) {
      Alert.alert("Missing Emoji", "Please select or enter an emoji for your action.");
      return false;
    }
    if (!title.trim()) {
      Alert.alert("Missing Title", "Please enter a title for your action.");
      return false;
    }
    if (!description.trim()) {
      Alert.alert("Missing Description", "Please enter a description for your action.");
      return false;
    }
    if (!duration.trim()) {
      Alert.alert("Missing Duration", "Please enter how long this action takes.");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const newAction: Omit<ReplacementAction, "id" | "timesUsed"> = {
      title: title.trim(),
      description: description.trim(),
      duration: duration.trim(),
      category: selectedCategory,
      icon: emoji.trim(),
      difficulty: selectedDifficulty,
      effectiveness: undefined,
    };

    onSave(newAction);
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    multiline = false,
    maxLength?: number
  ) => (
    <View className="mb-6">
      <Text className="text-white font-semibold text-lg mb-3">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        className="bg-white bg-opacity-10 rounded-xl px-4 py-4 text-white text-base"
        style={{
          borderColor: "rgba(255, 255, 255, 0.3)",
          borderWidth: 1,
          minHeight: multiline ? 80 : 50,
        }}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        maxLength={maxLength}
      />
      {maxLength && (
        <Text className="text-white opacity-50 text-sm mt-1 text-right">
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
      {/* Header */}
      <View className="px-6 pt-4 pb-6 flex-row items-center justify-between">
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Add Custom Action</Text>
        <TouchableOpacity
          onPress={handleSave}
          className="bg-green-500 rounded-lg px-4 py-2"
        >
          <Text className="text-white font-semibold">Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Emoji Selection */}
        <View className="mb-6">
          <Text className="text-white font-semibold text-lg mb-3">
            Icon Emoji
          </Text>
          <TextInput
            value={emoji}
            onChangeText={setEmoji}
            placeholder="Enter an emoji (e.g., 🎯)"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            className="bg-white bg-opacity-10 rounded-xl px-4 py-4 text-white text-2xl text-center mb-4"
            style={{
              borderColor: "rgba(255, 255, 255, 0.3)",
              borderWidth: 1,
              minHeight: 60,
            }}
            maxLength={2}
          />
          
          {/* Common Emojis */}
          <Text className="text-white opacity-75 text-sm mb-3">
            Or pick from common options:
          </Text>
          <View className="flex-row flex-wrap">
            {commonEmojis.map((emojiOption, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setEmoji(emojiOption)}
                className="bg-white bg-opacity-10 rounded-lg p-3 m-1"
                style={{
                  borderColor: emoji === emojiOption ? "#10B981" : "rgba(255, 255, 255, 0.2)",
                  borderWidth: emoji === emojiOption ? 2 : 1,
                }}
              >
                <Text className="text-2xl">{emojiOption}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Title */}
        {renderInput(
          "Action Title",
          title,
          setTitle,
          "e.g., Take 5 Deep Breaths",
          false,
          50
        )}

        {/* Description */}
        {renderInput(
          "Description",
          description,
          setDescription,
          "Briefly describe what this action involves...",
          true,
          120
        )}

        {/* Duration */}
        {renderInput(
          "Duration",
          duration,
          setDuration,
          "e.g., 2-3 min, 30 seconds, 5 min",
          false,
          20
        )}

        {/* Category Selection */}
        <View className="mb-6">
          <Text className="text-white font-semibold text-lg mb-3">Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id as any)}
                  className="px-6 py-4 rounded-xl border"
                  style={{
                    backgroundColor:
                      selectedCategory === category.id
                        ? "#FFFFFF"
                        : "rgba(255, 255, 255, 0.1)",
                    borderColor:
                      selectedCategory === category.id
                        ? "#FFFFFF"
                        : "rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <View className="items-center">
                    <Text className="text-2xl mb-2">{category.icon}</Text>
                    <Text
                      className={`font-semibold ${
                        selectedCategory === category.id
                          ? "text-gray-800"
                          : "text-white"
                      }`}
                    >
                      {category.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Difficulty Selection */}
        <View className="mb-8">
          <Text className="text-white font-semibold text-lg mb-3">Difficulty</Text>
          <View className="space-y-3">
            {difficulties.map((difficulty) => (
              <TouchableOpacity
                key={difficulty.id}
                onPress={() => setSelectedDifficulty(difficulty.id as any)}
                className="rounded-xl p-4 border flex-row items-center justify-between"
                style={{
                  backgroundColor:
                    selectedDifficulty === difficulty.id
                      ? "rgba(255, 255, 255, 0.15)"
                      : "rgba(255, 255, 255, 0.05)",
                  borderColor:
                    selectedDifficulty === difficulty.id
                      ? "rgba(255, 255, 255, 0.4)"
                      : "rgba(255, 255, 255, 0.2)",
                  borderWidth: selectedDifficulty === difficulty.id ? 2 : 1,
                }}
              >
                <View className="flex-row items-center flex-1">
                  <View
                    className={`w-4 h-4 rounded-full mr-4 ${difficulty.color}`}
                  />
                  <View>
                    <Text className="text-white font-semibold text-lg">
                      {difficulty.name}
                    </Text>
                    <Text className="text-white opacity-75 text-sm">
                      {difficulty.description}
                    </Text>
                  </View>
                </View>
                {selectedDifficulty === difficulty.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preview */}
        <View className="mb-8">
          <Text className="text-white font-semibold text-lg mb-3">Preview</Text>
          <View
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderColor: "rgba(255, 255, 255, 0.3)",
            }}
          >
            <View className="flex-row items-start mb-4">
              <Text className="text-3xl mr-4">{emoji || "🎯"}</Text>
              <View className="flex-1">
                <Text className="text-white font-bold text-xl mb-1">
                  {title || "Your Action Title"}
                </Text>
                <Text className="text-white opacity-90 text-base leading-5">
                  {description || "Your action description will appear here..."}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View
                className={`px-3 py-1 rounded-full mr-3 ${
                  difficulties.find((d) => d.id === selectedDifficulty)?.color || "bg-green-400"
                }`}
              >
                <Text className="text-white text-xs font-semibold uppercase">
                  {selectedDifficulty}
                </Text>
              </View>
              <Text className="text-white opacity-75 mr-4">
                ⏱️ {duration || "Duration"}
              </Text>
              <Text className="text-white opacity-75 capitalize">
                🏷️ {selectedCategory}
              </Text>
            </View>
          </View>
        </View>

        {/* Help Text */}
        <View className="bg-white bg-opacity-10 rounded-lg p-4 mb-8">
          <View className="flex-row items-start">
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="rgba(255, 255, 255, 0.7)"
              style={{ marginRight: 12, marginTop: 2 }}
            />
            <View className="flex-1">
              <Text className="text-white opacity-75 leading-6">
                Create a custom replacement action that works for you. Keep it simple 
                and specific - the best actions are ones you can do anywhere, anytime 
                when you need to redirect your energy.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddCustomActionScreen;