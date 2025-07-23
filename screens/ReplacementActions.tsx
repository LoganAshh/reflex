import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";

const ReplacementActions: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All", icon: "🌟" },
    { id: "mindful", name: "Mindful", icon: "🧘" },
    { id: "physical", name: "Physical", icon: "🏃" },
    { id: "social", name: "Social", icon: "👥" },
    { id: "creative", name: "Creative", icon: "🎨" },
    { id: "productive", name: "Productive", icon: "⚡" },
  ];

  const actions = [
    {
      id: "1",
      title: "Deep Breathing",
      description: "Take 5 deep breaths to center yourself",
      duration: "2 minutes",
      category: "mindful",
      icon: "🌬️",
      difficulty: "easy",
    },
    {
      id: "2",
      title: "Quick Walk",
      description: "Step outside for fresh air and movement",
      duration: "10 minutes",
      category: "physical",
      icon: "🚶",
      difficulty: "easy",
    },
    {
      id: "3",
      title: "Text a Friend",
      description: "Reach out and connect with someone you care about",
      duration: "5 minutes",
      category: "social",
      icon: "💬",
      difficulty: "easy",
    },
    {
      id: "4",
      title: "Gratitude Journal",
      description: "Write down 3 things you're grateful for",
      duration: "5 minutes",
      category: "mindful",
      icon: "📝",
      difficulty: "easy",
    },
    {
      id: "5",
      title: "Stretch Session",
      description: "Simple stretches to release tension",
      duration: "8 minutes",
      category: "physical",
      icon: "🤸",
      difficulty: "medium",
    },
    {
      id: "6",
      title: "Doodle or Sketch",
      description: "Express yourself through art",
      duration: "15 minutes",
      category: "creative",
      icon: "✏️",
      difficulty: "easy",
    },
  ];

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

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <Text className="text-3xl font-bold text-white text-center">
          Replacement Actions
        </Text>
        <Text className="text-xl text-white text-center mt-2 opacity-90">
          Transform urges into positive habits
        </Text>
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
      </View>

      {/* Actions List */}
      <ScrollView className="flex-1 px-6">
        <View className="space-y-4 pb-8">
          {filteredActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              className="rounded-2xl p-6 border"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
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

                <View
                  className={`px-3 py-1 rounded-full ${getDifficultyColor(action.difficulty)}`}
                >
                  <Text className="text-white text-xs font-semibold uppercase">
                    {action.difficulty}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Text className="text-white opacity-75 mr-4">
                    ⏱️ {action.duration}
                  </Text>
                  <Text className="text-white opacity-75 capitalize">
                    🏷️ {action.category}
                  </Text>
                </View>

                <TouchableOpacity
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                >
                  <Text className="text-white font-semibold">Try It</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
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
