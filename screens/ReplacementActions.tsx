// screens/ReplacementActions.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { useReplacementActions } from "../hooks/useReplacementActions";
import { useSettings } from "../hooks/useSettings";
import { Ionicons } from "@expo/vector-icons";

const ReplacementActions: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { actions, loading } = useReplacementActions();
  const { settings, updateSettings } = useSettings();

  const categories = [
    { id: "all", name: "All", icon: "🌟" },
    { id: "mindful", name: "Mindful", icon: "🧘" },
    { id: "physical", name: "Physical", icon: "🏃" },
    { id: "social", name: "Social", icon: "👥" },
    { id: "creative", name: "Creative", icon: "🎨" },
    { id: "productive", name: "Productive", icon: "⚡" },
  ];

  const selectedActionIds = settings?.selectedReplacementActions || [];

  const filteredActions =
    selectedCategory === "all"
      ? actions
      : actions.filter((action) => action.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-400";
      case "medium":
        return "bg-yellow-400";
      case "hard":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  const toggleActionSelection = async (actionId: string) => {
    try {
      const currentSelections = selectedActionIds;
      const isSelected = currentSelections.includes(actionId);
      
      let updatedSelections;
      if (isSelected) {
        updatedSelections = currentSelections.filter(id => id !== actionId);
      } else {
        updatedSelections = [...currentSelections, actionId];
      }

      await updateSettings({
        ...settings,
        selectedReplacementActions: updatedSelections,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to update selection. Please try again.");
    }
  };

  const getSelectedCount = () => {
    return selectedActionIds.length;
  };

  const handleSelectAll = async () => {
    try {
      const allActionIds = filteredActions.map(action => action.id);
      await updateSettings({
        ...settings,
        selectedReplacementActions: [...new Set([...selectedActionIds, ...allActionIds])],
      });
    } catch (error) {
      Alert.alert("Error", "Failed to select all actions.");
    }
  };

  const handleSelectNone = async () => {
    try {
      const filteredActionIds = filteredActions.map(action => action.id);
      const remainingSelections = selectedActionIds.filter(id => !filteredActionIds.includes(id));
      
      await updateSettings({
        ...settings,
        selectedReplacementActions: remainingSelections,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to deselect actions.");
    }
  };

  // Helper function to get the current category name
  const getCurrentCategoryName = () => {
    const currentCategory = categories.find(cat => cat.id === selectedCategory);
    return currentCategory?.name || "";
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-xl">Loading actions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <Text className="text-3xl font-bold text-white text-center">
          Replacement Actions
        </Text>
        <Text className="text-xl text-white text-center mt-2 opacity-90">
          Choose actions that appear when you resist urges
        </Text>
        
        {/* Selection count */}
        <View className="mt-4 items-center">
          <View className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <Text className="text-black font-medium">
              {getSelectedCount()} actions selected
            </Text>
          </View>
        </View>
      </View>

      {/* Category Filter */}
      <View className="px-6 mb-6">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row space-x-3"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className="px-6 py-3 rounded-full border"
              style={{
                backgroundColor:
                  selectedCategory === category.id
                    ? "#FFFFFF"
                    : "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
              onPress={() => setSelectedCategory(category.id)}
            >
              <View className="flex-row items-center">
                <Text className="text-lg mr-2">{category.icon}</Text>
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
        </ScrollView>

        {/* Quick Actions */}
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            onPress={handleSelectAll}
            className="bg-white bg-opacity-20 rounded-lg px-4 py-2"
          >
            <Text className="text-black text-sm">
              Select All {selectedCategory === "all" ? "" : getCurrentCategoryName()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSelectNone}
            className="bg-white bg-opacity-20 rounded-lg px-4 py-2"
          >
            <Text className="text-black text-sm">
              Deselect All {selectedCategory === "all" ? "" : getCurrentCategoryName()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Actions List */}
      <ScrollView className="flex-1 px-6">
        <View className="space-y-4 pb-8">
          {filteredActions.map((action) => {
            const isSelected = selectedActionIds.includes(action.id);
            
            return (
              <TouchableOpacity
                key={action.id}
                className="rounded-2xl p-6 border"
                style={{
                  backgroundColor: isSelected 
                    ? "rgba(255, 255, 255, 0.2)" 
                    : "rgba(255, 255, 255, 0.05)",
                  borderColor: isSelected 
                    ? "rgba(255, 255, 255, 0.4)" 
                    : "rgba(255, 255, 255, 0.2)",
                  borderWidth: isSelected ? 2 : 1,
                }}
                onPress={() => toggleActionSelection(action.id)}
              >
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-row items-center flex-1">
                    <Text className="text-3xl mr-4">{action.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-white font-bold text-xl mb-1">
                        {action.title}
                      </Text>
                      <Text className="text-white opacity-90 text-base leading-5">
                        {action.description}
                      </Text>
                    </View>
                  </View>

                  {/* Selection indicator */}
                  <View
                    className="w-8 h-8 rounded-full border-2 items-center justify-center ml-4"
                    style={{
                      borderColor: isSelected ? "#10B981" : "rgba(255, 255, 255, 0.5)",
                      backgroundColor: isSelected ? "#10B981" : "transparent",
                    }}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                    )}
                  </View>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View
                      className={`px-3 py-1 rounded-full mr-3 ${getDifficultyColor(action.difficulty)}`}
                    >
                      <Text className="text-white text-xs font-semibold uppercase">
                        {action.difficulty}
                      </Text>
                    </View>
                    
                    <Text className="text-white opacity-75 mr-4">
                      ⏱️ {action.duration}
                    </Text>
                    <Text className="text-white opacity-75 capitalize">
                      🏷️ {action.category}
                    </Text>
                  </View>

                  {action.timesUsed > 0 && (
                    <Text className="text-white opacity-60 text-sm">
                      Used {action.timesUsed} times
                    </Text>
                  )}
                </View>

                {isSelected && (
                  <View className="mt-3 pt-3 border-t border-white border-opacity-20">
                    <Text className="text-green-300 text-sm text-center">
                      ✓ This action will appear when you resist urges
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Help text */}
        <View className="bg-white bg-opacity-10 rounded-lg p-4 mb-6">
          <View className="flex-row items-start">
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="rgba(255, 255, 255, 0.7)"
              style={{ marginRight: 12, marginTop: 2 }}
            />
            <View className="flex-1">
              <Text className="text-black opacity-75 leading-6">
                Select 3-5 replacement actions that you find helpful. These will appear 
                as options when you successfully resist an urge, helping you channel 
                that energy into something positive.
              </Text>
            </View>
          </View>
        </View>

        {/* Add Custom Action */}
        <TouchableOpacity
          className="rounded-2xl p-6 mb-8 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderColor: "rgba(255, 255, 255, 0.3)",
          }}
        >
          <View className="items-center">
            <Text className="text-4xl mb-3">➕</Text>
            <Text className="text-white font-bold text-xl mb-2">
              Add Custom Action
            </Text>
            <Text className="text-white opacity-90 text-center">
              Create your own replacement action that works for you
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReplacementActions;