import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";

interface ReplacementAction {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: "mindful" | "physical" | "social" | "creative" | "productive";
  icon: string;
  difficulty: "easy" | "medium" | "hard";
}

const ReplacementActions: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [completedActions, setCompletedActions] = useState<string[]>([]);

  const categories = [
    { id: "all", label: "All", icon: "🌟" },
    { id: "mindful", label: "Mindful", icon: "🧘" },
    { id: "physical", label: "Physical", icon: "🏃" },
    { id: "social", label: "Social", icon: "👥" },
    { id: "creative", label: "Creative", icon: "🎨" },
    { id: "productive", label: "Productive", icon: "✅" },
  ];

  const actions: ReplacementAction[] = [
    {
      id: "1",
      title: "Take 5 Deep Breaths",
      description: "Focus on your breath to reset your mind",
      duration: "1-2 min",
      category: "mindful",
      icon: "🌬️",
      difficulty: "easy",
    },
    {
      id: "2",
      title: "Walk Around the Block",
      description: "Get fresh air and movement to shift energy",
      duration: "5-10 min",
      category: "physical",
      icon: "🚶",
      difficulty: "easy",
    },
    {
      id: "3",
      title: "Text Someone Positive",
      description: "Reach out to a friend or family member",
      duration: "2-5 min",
      category: "social",
      icon: "💬",
      difficulty: "easy",
    },
    {
      id: "4",
      title: "Write 3 Things You're Grateful For",
      description: "Shift focus to positive aspects of your day",
      duration: "3-5 min",
      category: "mindful",
      icon: "📝",
      difficulty: "easy",
    },
    {
      id: "5",
      title: "Do 10 Push-ups",
      description: "Quick physical activity to release tension",
      duration: "1-2 min",
      category: "physical",
      icon: "💪",
      difficulty: "medium",
    },
    {
      id: "6",
      title: "Sketch or Doodle",
      description: "Express creativity without pressure",
      duration: "5-15 min",
      category: "creative",
      icon: "✏️",
      difficulty: "easy",
    },
    {
      id: "7",
      title: "Organize Your Workspace",
      description: "Clean up for a sense of accomplishment",
      duration: "5-10 min",
      category: "productive",
      icon: "🗂️",
      difficulty: "easy",
    },
    {
      id: "8",
      title: "Call Someone You Care About",
      description: "Have a meaningful conversation",
      duration: "10-20 min",
      category: "social",
      icon: "📞",
      difficulty: "medium",
    },
    {
      id: "9",
      title: "Progressive Muscle Relaxation",
      description: "Systematically tense and release muscle groups",
      duration: "10-15 min",
      category: "mindful",
      icon: "🧘‍♀️",
      difficulty: "medium",
    },
    {
      id: "10",
      title: "Learn One New Thing",
      description: "Read an article or watch an educational video",
      duration: "10-20 min",
      category: "productive",
      icon: "📚",
      difficulty: "medium",
    },
    {
      id: "11",
      title: "Play a Musical Instrument",
      description: "Express yourself through music",
      duration: "10-30 min",
      category: "creative",
      icon: "🎵",
      difficulty: "hard",
    },
    {
      id: "12",
      title: "Plan Tomorrow's Priorities",
      description: "Get organized for the next day",
      duration: "10-15 min",
      category: "productive",
      icon: "📋",
      difficulty: "medium",
    },
  ];

  const filteredActions =
    selectedCategory === "all"
      ? actions
      : actions.filter((action) => action.category === selectedCategory);

  const handleCompleteAction = (actionId: string) => {
    setCompletedActions((prev) => [...prev, actionId]);
    Alert.alert(
      "Great Job! 🎉",
      "You successfully replaced an urge with a positive action!",
      [{ text: "OK", style: "default" }]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const renderActionCard = (action: ReplacementAction) => {
    const isCompleted = completedActions.includes(action.id);

    return (
      <View key={action.id} className="bg-white rounded-lg p-4 mb-3 shadow-sm">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <Text className="text-2xl mr-2">{action.icon}</Text>
              <Text className="text-lg font-bold text-gray-800 flex-1">
                {action.title}
              </Text>
              <View
                className={`px-2 py-1 rounded-full ${getDifficultyColor(action.difficulty)}`}
              >
                <Text className="text-xs font-medium capitalize">
                  {action.difficulty}
                </Text>
              </View>
            </View>

            <Text className="text-gray-600 mb-3">{action.description}</Text>

            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-500">
                ⏱️ {action.duration}
              </Text>

              {isCompleted ? (
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-700 text-sm font-medium">
                    ✅ Completed
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  className="bg-blue-500 px-4 py-2 rounded-lg"
                  onPress={() => handleCompleteAction(action.id)}
                >
                  <Text className="text-white font-medium">Do This</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">
          Replacement Actions
        </Text>
        <Text className="text-gray-600 mt-1">
          Transform urges into positive habits
        </Text>
      </View>

      {/* Category Filter */}
      <View className="bg-white px-6 py-4 border-b border-gray-100">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className={`px-4 py-2 rounded-full border ${
                  selectedCategory === category.id
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View className="flex-row items-center">
                  <Text className="mr-1">{category.icon}</Text>
                  <Text
                    className={`font-medium ${
                      selectedCategory === category.id
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {category.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Actions List */}
      <ScrollView className="flex-1 px-6 py-4">
        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            🚀 Quick Actions (1-2 min)
          </Text>
          {filteredActions
            .filter((action) => action.duration.includes("1-2"))
            .map(renderActionCard)}
        </View>

        {/* Medium Actions */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            ⚡ Medium Actions (5-15 min)
          </Text>
          {filteredActions
            .filter(
              (action) =>
                action.duration.includes("5-") ||
                action.duration.includes("10-") ||
                action.duration.includes("3-5")
            )
            .map(renderActionCard)}
        </View>

        {/* Longer Actions */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            🎯 Focused Actions (15+ min)
          </Text>
          {filteredActions
            .filter(
              (action) =>
                action.duration.includes("15+") ||
                action.duration.includes("20") ||
                action.duration.includes("30")
            )
            .map(renderActionCard)}
        </View>

        {/* Today's Wins */}
        {completedActions.length > 0 && (
          <View className="bg-green-50 rounded-lg p-4 mb-6">
            <Text className="text-lg font-bold text-green-800 mb-2">
              🎉 Today's Wins
            </Text>
            <Text className="text-green-700">
              You've completed {completedActions.length} replacement{" "}
              {completedActions.length === 1 ? "action" : "actions"} today!
            </Text>
            <Text className="text-green-600 text-sm mt-1">
              Each positive action rewires your brain for better habits.
            </Text>
          </View>
        )}

        {/* Tips */}
        <View className="bg-blue-50 rounded-lg p-4 mb-6">
          <Text className="text-lg font-bold text-blue-800 mb-2">
            💡 Pro Tips
          </Text>
          <View className="space-y-2">
            <Text className="text-blue-700 text-sm">
              • Start with easy actions to build momentum
            </Text>
            <Text className="text-blue-700 text-sm">
              • The goal is interrupting the automatic pattern, not perfection
            </Text>
            <Text className="text-blue-700 text-sm">
              • Even 30 seconds of breathing counts as a win
            </Text>
            <Text className="text-blue-700 text-sm">
              • Pick actions that feel good to you personally
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReplacementActions;
