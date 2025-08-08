import React from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";

const PatternDashboard: React.FC = () => {
  const mockStats = {
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
    
    // Individual habit streaks
    habitStreaks: [
      { habit: "Social Media", currentStreak: 3, longestStreak: 8, successRate: 75 },
      { habit: "Snacking", currentStreak: 0, longestStreak: 5, successRate: 60 },
      { habit: "Phone Checking", currentStreak: 5, longestStreak: 12, successRate: 80 },
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

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return "#10B981"; // green-500
    if (streak >= 3) return "#3B82F6"; // blue-500
    if (streak >= 1) return "#F59E0B"; // yellow-500
    return "#EF4444"; // red-500
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <Text className="text-3xl font-bold text-white text-center">
          Success Analytics
        </Text>
        <Text className="text-xl text-white text-center mt-2 opacity-90">
          Track your resistance progress
        </Text>
      </View>

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
                {mockStats.successRate}%
              </Text>
              <Text className="text-white opacity-90 text-center">
                Success Rate
              </Text>
            </View>
            
            <View className="items-center flex-1">
              <Text className="text-3xl font-bold text-green-400">
                {mockStats.currentStreak}
              </Text>
              <Text className="text-white opacity-90 text-center">
                Current Streak
              </Text>
            </View>
            
            <View className="items-center flex-1">
              <Text className="text-3xl font-bold text-yellow-400">
                {mockStats.longestStreak}
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
              style={{ width: `${mockStats.successRate}%` }}
            />
          </View>
          <Text className="text-white text-center mt-2 opacity-90">
            {mockStats.urgesResisted} of {mockStats.totalUrges} urges resisted
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
            {mockStats.successTrend.map((item, index) => (
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
            {mockStats.habitStreaks.map((habit, index) => (
              <View key={index} className="space-y-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-white font-semibold text-lg">
                    {habit.habit}
                  </Text>
                  <Text className="text-white opacity-90">
                    {habit.successRate}% success
                  </Text>
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
                      width: `${(habit.currentStreak / habit.longestStreak) * 100}%`,
                      backgroundColor: getStreakColor(habit.currentStreak)
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Resistance Progress */}
        <View
          className="rounded-2xl p-6 mb-6 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Text className="text-2xl font-bold text-white mb-4 text-center">
            💪 Weekly Resistance
          </Text>
          <View className="space-y-3">
            {mockStats.weeklyResistance.map((day, index) => {
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

        {/* Performance Insights */}
        <View
          className="rounded-2xl p-6 mb-6 border"
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
              • You're building momentum with Phone Checking (5-day streak)
            </Text>
            <Text className="text-white text-center opacity-90">
              • Saturday is your strongest resistance day (90% success)
            </Text>
          </View>
        </View>

        {/* Most Challenging Triggers */}
        <View
          className="rounded-2xl p-6 mb-8 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Text className="text-2xl font-bold text-white mb-4 text-center">
            🎯 Biggest Challenges
          </Text>
          <View className="space-y-4">
            {mockStats.commonTriggers.map((item, index) => (
              <View
                key={index}
                className="flex-row justify-between items-center"
              >
                <Text className="text-white font-semibold text-lg">
                  {item.trigger}
                </Text>
                <View className="flex-row items-center">
                  <View
                    className="w-20 rounded-full h-3 mr-3"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  >
                    <View
                      className="bg-orange-400 h-3 rounded-full"
                      style={{ width: `${(item.count / 15) * 100}%` }}
                    />
                  </View>
                  <Text className="text-white opacity-90 w-8">
                    {item.count}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PatternDashboard;