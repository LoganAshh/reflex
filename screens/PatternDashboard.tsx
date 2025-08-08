import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PatternDashboard: React.FC = () => {
  const [selectedView, setSelectedView] = useState<string>("overview");

  // Mock user's selected urges from onboarding
  const userSelectedUrges = [
    "Scroll social media",
    "Eat junk food", 
    "Use phone",
    "Drink caffeine"
  ];

  const mockOverallStats = {
    totalUrges: 47,
    urgesResisted: 32,
    successRate: 68,
    currentStreak: 5,
    longestStreak: 12,
    
    // Success rate over time (last 7 days)
    successTrend: [
      { day: "Mon", rate: 60 },
      { day: "Tue", rate: 75 },
      { day: "Wed", rate: 50 },
      { day: "Thu", rate: 80 },
      { day: "Fri", rate: 70 },
      { day: "Sat", rate: 90 },
      { day: "Sun", rate: 68 },
    ],
    
    // Weekly resistance stats
    weeklyResistance: [
      { day: "Mon", resisted: 2, total: 3 },
      { day: "Tue", resisted: 5, total: 7 },
      { day: "Wed", resisted: 2, total: 4 },
      { day: "Thu", resisted: 6, total: 8 },
      { day: "Fri", resisted: 4, total: 6 },
      { day: "Sat", resisted: 4, total: 5 },
      { day: "Sun", resisted: 1, total: 2 },
    ],
    
    commonTriggers: [
      { trigger: "Boredom", count: 15 },
      { trigger: "Stress", count: 12 },
      { trigger: "Anxiety", count: 8 },
    ],
  };

  // Mock individual habit data
  const mockHabitData = {
    "Scroll social media": {
      totalUrges: 18,
      urgesResisted: 14,
      successRate: 78,
      currentStreak: 3,
      longestStreak: 8,
      successTrend: [
        { day: "Mon", rate: 67 },
        { day: "Tue", rate: 100 },
        { day: "Wed", rate: 50 },
        { day: "Thu", rate: 75 },
        { day: "Fri", rate: 100 },
        { day: "Sat", rate: 100 },
        { day: "Sun", rate: 67 },
      ],
      weeklyResistance: [
        { day: "Mon", resisted: 2, total: 3 },
        { day: "Tue", resisted: 3, total: 3 },
        { day: "Wed", resisted: 1, total: 2 },
        { day: "Thu", resisted: 3, total: 4 },
        { day: "Fri", resisted: 2, total: 2 },
        { day: "Sat", resisted: 2, total: 2 },
        { day: "Sun", resisted: 1, total: 3 },
      ],
      commonTriggers: [
        { trigger: "Boredom", count: 8 },
        { trigger: "Waiting", count: 5 },
        { trigger: "FOMO", count: 3 },
      ],
      timePatterns: [
        { hour: "9 AM", count: 3 },
        { hour: "2 PM", count: 4 },
        { hour: "8 PM", count: 6 },
      ]
    },
    "Eat junk food": {
      totalUrges: 14,
      urgesResisted: 8,
      successRate: 57,
      currentStreak: 0,
      longestStreak: 4,
      successTrend: [
        { day: "Mon", rate: 50 },
        { day: "Tue", rate: 67 },
        { day: "Wed", rate: 33 },
        { day: "Thu", rate: 100 },
        { day: "Fri", rate: 50 },
        { day: "Sat", rate: 0 },
        { day: "Sun", rate: 100 },
      ],
      weeklyResistance: [
        { day: "Mon", resisted: 1, total: 2 },
        { day: "Tue", resisted: 2, total: 3 },
        { day: "Wed", resisted: 1, total: 3 },
        { day: "Thu", resisted: 2, total: 2 },
        { day: "Fri", resisted: 1, total: 2 },
        { day: "Sat", resisted: 0, total: 1 },
        { day: "Sun", resisted: 1, total: 1 },
      ],
      commonTriggers: [
        { trigger: "Stress", count: 6 },
        { trigger: "Boredom", count: 4 },
        { trigger: "Tiredness", count: 4 },
      ],
      timePatterns: [
        { hour: "3 PM", count: 5 },
        { hour: "9 PM", count: 4 },
        { hour: "11 PM", count: 3 },
      ]
    },
    "Use phone": {
      totalUrges: 21,
      urgesResisted: 17,
      successRate: 81,
      currentStreak: 5,
      longestStreak: 12,
      successTrend: [
        { day: "Mon", rate: 75 },
        { day: "Tue", rate: 80 },
        { day: "Wed", rate: 67 },
        { day: "Thu", rate: 100 },
        { day: "Fri", rate: 75 },
        { day: "Sat", rate: 100 },
        { day: "Sun", rate: 50 },
      ],
      weeklyResistance: [
        { day: "Mon", resisted: 3, total: 4 },
        { day: "Tue", resisted: 4, total: 5 },
        { day: "Wed", resisted: 2, total: 3 },
        { day: "Thu", resisted: 3, total: 3 },
        { day: "Fri", resisted: 3, total: 4 },
        { day: "Sat", resisted: 2, total: 2 },
        { day: "Sun", resisted: 0, total: 0 },
      ],
      commonTriggers: [
        { trigger: "Boredom", count: 9 },
        { trigger: "Habit", count: 7 },
        { trigger: "Anxiety", count: 5 },
      ],
      timePatterns: [
        { hour: "7 AM", count: 4 },
        { hour: "12 PM", count: 6 },
        { hour: "10 PM", count: 8 },
      ]
    },
    "Drink caffeine": {
      totalUrges: 12,
      urgesResisted: 7,
      successRate: 58,
      currentStreak: 1,
      longestStreak: 6,
      successTrend: [
        { day: "Mon", rate: 50 },
        { day: "Tue", rate: 0 },
        { day: "Wed", rate: 100 },
        { day: "Thu", rate: 50 },
        { day: "Fri", rate: 67 },
        { day: "Sat", rate: 100 },
        { day: "Sun", rate: 0 },
      ],
      weeklyResistance: [
        { day: "Mon", resisted: 1, total: 2 },
        { day: "Tue", resisted: 0, total: 1 },
        { day: "Wed", resisted: 1, total: 1 },
        { day: "Thu", resisted: 1, total: 2 },
        { day: "Fri", resisted: 2, total: 3 },
        { day: "Sat", resisted: 2, total: 2 },
        { day: "Sun", resisted: 0, total: 1 },
      ],
      commonTriggers: [
        { trigger: "Tiredness", count: 5 },
        { trigger: "Stress", count: 4 },
        { trigger: "Habit", count: 3 },
      ],
      timePatterns: [
        { hour: "7 AM", count: 4 },
        { hour: "2 PM", count: 5 },
        { hour: "4 PM", count: 3 },
      ]
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return "#10B981"; // green-500
    if (streak >= 3) return "#3B82F6"; // blue-500
    if (streak >= 1) return "#F59E0B"; // yellow-500
    return "#EF4444"; // red-500
  };

  const getIconForUrge = (urge: string) => {
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      "Scroll social media": "phone-portrait-outline",
      "Eat junk food": "fast-food-outline",
      "Use phone": "phone-portrait-outline",
      "Drink caffeine": "cafe-outline",
    };
    return iconMap[urge] || "help-circle-outline";
  };

  const renderTabButton = (id: string, label: string, icon?: keyof typeof Ionicons.glyphMap) => (
    <TouchableOpacity
      key={id}
      className="flex-1 py-3 px-2 mx-1"
      onPress={() => setSelectedView(id)}
    >
      <View className="items-center">
        {icon && (
          <Ionicons 
            name={icon} 
            size={16} 
            color={selectedView === id ? "#10B981" : "white"}
            style={{ marginBottom: 4 }} 
          />
        )}
        <Text 
          className={`text-xs text-center font-medium ${
            selectedView === id ? "text-green-400 opacity-100" : "text-white opacity-70"
          }`}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderOverview = () => (
    <ScrollView className="flex-1 px-6">
      {/* Overall Success Stats */}
      <View
        className="rounded-2xl p-6 mb-6 border"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <Text className="text-2xl font-bold text-white text-center mb-4">
          🎯 Overall Success
        </Text>
        
        <View className="flex-row justify-between mb-6">
          <View className="items-center flex-1">
            <Text className="text-3xl font-bold text-white">
              {mockOverallStats.successRate}%
            </Text>
            <Text className="text-white opacity-90 text-center">
              Success Rate
            </Text>
          </View>
          
          <View className="items-center flex-1">
            <Text className="text-3xl font-bold text-green-400">
              {mockOverallStats.currentStreak}
            </Text>
            <Text className="text-white opacity-90 text-center">
              Current Streak
            </Text>
          </View>
          
          <View className="items-center flex-1">
            <Text className="text-3xl font-bold text-yellow-400">
              {mockOverallStats.longestStreak}
            </Text>
            <Text className="text-white opacity-90 text-center">
              Best Streak
            </Text>
          </View>
        </View>

        <View
          className="w-full rounded-full h-4"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <View
            className="bg-green-400 h-4 rounded-full"
            style={{ width: `${mockOverallStats.successRate}%` }}
          />
        </View>
        <Text className="text-white text-center mt-2 opacity-90">
          {mockOverallStats.urgesResisted} of {mockOverallStats.totalUrges} urges resisted
        </Text>
      </View>

      {/* Success Rate Trend */}
      <View
        className="rounded-2xl p-6 mb-6 border"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <Text className="text-2xl font-bold text-white mb-4 text-center">
          📈 Success Rate Trend
        </Text>
        <View className="flex-row justify-between items-end h-32">
          {mockOverallStats.successTrend.map((item, index) => (
            <View key={index} className="flex-1 items-center">
              <View
                className="bg-blue-400 rounded-t w-8 mb-2"
                style={{ height: `${(item.rate / 100) * 80}%`, minHeight: 8 }}
              />
              <Text className="text-white text-sm opacity-90">
                {item.day}
              </Text>
              <Text className="text-white text-xs opacity-75">
                {item.rate}%
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Individual Habit Streaks */}
      <View
        className="rounded-2xl p-6 mb-6 border"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <Text className="text-2xl font-bold text-white mb-4 text-center">
          🔥 Habit Streaks
        </Text>
        <View className="space-y-4">
          {userSelectedUrges
            .map(urge => ({
              habit: urge,
              ...mockHabitData[urge as keyof typeof mockHabitData]
            }))
            .sort((a, b) => b.currentStreak - a.currentStreak)
            .map((habit, index) => (
              <TouchableOpacity
                key={index}
                className="space-y-2"
                onPress={() => setSelectedView(habit.habit)}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center flex-1">
                    <Ionicons 
                      name={getIconForUrge(habit.habit)} 
                      size={20} 
                      color="white" 
                      style={{ marginRight: 8 }} 
                    />
                    <Text className="text-white font-semibold text-lg">
                      {habit.habit}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-white opacity-90 mr-2">
                      {habit.successRate}% success
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
                  </View>
                </View>
                
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: getStreakColor(habit.currentStreak) }}
                    />
                    <Text className="text-white opacity-90">
                      Current: {habit.currentStreak} days
                    </Text>
                  </View>
                  <Text className="text-white opacity-75">
                    Best: {habit.longestStreak} days
                  </Text>
                </View>
                
                <View
                  className="w-full rounded-full h-2"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                >
                  <View
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${habit.longestStreak > 0 ? (habit.currentStreak / habit.longestStreak) * 100 : 0}%`,
                      backgroundColor: getStreakColor(habit.currentStreak)
                    }}
                  />
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </View>

      {/* Performance Insights */}
      <View
        className="rounded-2xl p-6 mb-8 border"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderColor: "rgba(255, 255, 255, 0.3)",
        }}
      >
        <Text className="text-white font-bold text-center mb-3 text-xl">
          🎖️ Performance Insights
        </Text>
        <View className="space-y-3">
          <Text className="text-white text-center opacity-90">
            • Your success rate has improved 15% this week!
          </Text>
          <Text className="text-white text-center opacity-90">
            • You're building momentum with Phone use (5-day streak)
          </Text>
          <Text className="text-white text-center opacity-90">
            • Saturday is your strongest resistance day (90% success)
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderIndividualHabit = (habitName: string) => {
    const habitData = mockHabitData[habitName as keyof typeof mockHabitData];
    
    if (!habitData) return null;

    return (
      <ScrollView className="flex-1 px-6">
        {/* Habit Header */}
        <View
          className="rounded-2xl p-6 mb-6 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <View className="flex-row items-center justify-center mb-4">
            <Ionicons 
              name={getIconForUrge(habitName)} 
              size={32} 
              color="white" 
              style={{ marginRight: 12 }} 
            />
            <Text className="text-2xl font-bold text-white text-center">
              {habitName}
            </Text>
          </View>
          
          <View className="flex-row justify-between mb-6">
            <View className="items-center flex-1">
              <Text className="text-3xl font-bold text-white">
                {habitData.successRate}%
              </Text>
              <Text className="text-white opacity-90 text-center">
                Success Rate
              </Text>
            </View>
            
            <View className="items-center flex-1">
              <Text 
                className="text-3xl font-bold"
                style={{ color: getStreakColor(habitData.currentStreak) }}
              >
                {habitData.currentStreak}
              </Text>
              <Text className="text-white opacity-90 text-center">
                Current Streak
              </Text>
            </View>
            
            <View className="items-center flex-1">
              <Text className="text-3xl font-bold text-yellow-400">
                {habitData.longestStreak}
              </Text>
              <Text className="text-white opacity-90 text-center">
                Best Streak
              </Text>
            </View>
          </View>

          <View
            className="w-full rounded-full h-4"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          >
            <View
              className="h-4 rounded-full"
              style={{ 
                width: `${habitData.successRate}%`,
                backgroundColor: getStreakColor(habitData.currentStreak)
              }}
            />
          </View>
          <Text className="text-white text-center mt-2 opacity-90">
            {habitData.urgesResisted} of {habitData.totalUrges} urges resisted
          </Text>
        </View>

        {/* Success Trend for This Habit */}
        <View
          className="rounded-2xl p-6 mb-6 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Text className="text-2xl font-bold text-white mb-4 text-center">
            📈 Weekly Success Trend
          </Text>
          <View className="flex-row justify-between items-end h-32">
            {habitData.weeklyResistance.map((item, index) => {
              const successRate = item.total > 0 ? (item.resisted / item.total) * 100 : 0;
              return (
                <View key={index} className="flex-1 items-center">
                  <View
                    className="rounded-t w-8 mb-2 relative"
                    style={{ 
                      height: `${item.total > 0 ? Math.max((item.total / 8) * 80, 16) : 16}%`,
                      backgroundColor: "rgba(255, 255, 255, 0.2)"
                    }}
                  >
                    <View
                      className="rounded-t w-full"
                      style={{ 
                        height: `${successRate}%`,
                        backgroundColor: "#10B981"
                      }}
                    />
                  </View>
                  <Text className="text-white text-sm opacity-90">
                    {habitData.successTrend[index].day}
                  </Text>
                  <Text className="text-white text-xs opacity-75">
                    {item.resisted}/{item.total}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Weekly Resistance Details */}
        <View
          className="rounded-2xl p-6 mb-6 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Text className="text-2xl font-bold text-white mb-4 text-center">
            💪 Daily Resistance
          </Text>
          <View className="space-y-3">
            {habitData.weeklyResistance.map((day, index) => {
              const daySuccessRate = day.total > 0 ? Math.round((day.resisted / day.total) * 100) : 0;
              return (
                <View key={index} className="flex-row justify-between items-center">
                  <Text className="text-white font-semibold w-12">
                    {day.day}
                  </Text>
                  
                  <View className="flex-1 mx-3">
                    <View
                      className="w-full rounded-full h-3"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                    >
                      <View
                        className="h-3 rounded-full"
                        style={{ 
                          width: `${daySuccessRate}%`,
                          backgroundColor: daySuccessRate >= 80 ? "#10B981" : 
                                          daySuccessRate >= 60 ? "#3B82F6" : 
                                          daySuccessRate >= 40 ? "#F59E0B" : "#EF4444"
                        }}
                      />
                    </View>
                  </View>
                  
                  <Text className="text-white opacity-90 w-16 text-right">
                    {day.resisted}/{day.total}
                  </Text>
                  <Text className="text-white opacity-75 w-12 text-right">
                    {daySuccessRate}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>


      </ScrollView>
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
      {/* Header */}
      <View className="px-6 pt-4 pb-4">
        <Text className="text-3xl font-bold text-white text-center">
          {selectedView === "overview" ? "Success Analytics" : selectedView}
        </Text>
        <Text className="text-xl text-white text-center mt-2 opacity-90">
          {selectedView === "overview" ? "Your overall progress" : "Individual habit insights"}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View className="px-6 pb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row">
            {renderTabButton("overview", "Overview", "analytics-outline")}
            {userSelectedUrges.map(urge => 
              renderTabButton(urge, urge.replace(/\b\w/g, l => l.toUpperCase()), getIconForUrge(urge))
            )}
          </View>
        </ScrollView>
      </View>

      {/* Content */}
      {selectedView === "overview" ? renderOverview() : renderIndividualHabit(selectedView)}
    </SafeAreaView>
  );
};

export default PatternDashboard;