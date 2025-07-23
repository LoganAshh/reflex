import React from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";

const PatternDashboard: React.FC = () => {
  const mockStats = {
    totalUrges: 47,
    urgesResisted: 32,
    successRate: 68,
    commonTriggers: [
      { trigger: "Boredom", count: 15 },
      { trigger: "Stress", count: 12 },
      { trigger: "Anxiety", count: 8 },
    ],
    commonUrges: [
      { urge: "Scroll Instagram", count: 18 },
      { urge: "Check phone", count: 14 },
      { urge: "Open fridge", count: 9 },
    ],
    weeklyTrend: [
      { day: "Mon", count: 3 },
      { day: "Tue", count: 7 },
      { day: "Wed", count: 4 },
      { day: "Thu", count: 8 },
      { day: "Fri", count: 6 },
      { day: "Sat", count: 5 },
      { day: "Sun", count: 2 },
    ],
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <Text className="text-3xl font-bold text-white text-center">
          Your Patterns
        </Text>
        <Text className="text-xl text-white text-center mt-2 opacity-90">
          Discover insights from your data
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Success Rate Card */}
        <View className="bg-white bg-opacity-10 rounded-2xl p-6 mb-6 border border-white border-opacity-20">
          <Text className="text-2xl font-bold text-white text-center mb-4">
            📊 Your Success Rate
          </Text>
          <View className="items-center">
            <Text className="text-5xl font-bold text-white mb-2">
              {mockStats.successRate}%
            </Text>
            <Text className="text-white text-lg opacity-90 text-center">
              {mockStats.urgesResisted} out of {mockStats.totalUrges} urges
              resisted
            </Text>

            <View className="w-full bg-white bg-opacity-20 rounded-full h-4 mt-4">
              <View
                className="bg-green-400 h-4 rounded-full"
                style={{ width: `${mockStats.successRate}%` }}
              />
            </View>
          </View>
        </View>

        {/* Common Triggers */}
        <View className="bg-white bg-opacity-10 rounded-2xl p-6 mb-6 border border-white border-opacity-20">
          <Text className="text-2xl font-bold text-white mb-4 text-center">
            🎯 Common Triggers
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
                  <View className="w-20 bg-white bg-opacity-20 rounded-full h-3 mr-3">
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

        {/* Common Urges */}
        <View className="bg-white bg-opacity-10 rounded-2xl p-6 mb-6 border border-white border-opacity-20">
          <Text className="text-2xl font-bold text-white mb-4 text-center">
            📱 Most Frequent Urges
          </Text>
          <View className="space-y-4">
            {mockStats.commonUrges.map((item, index) => (
              <View
                key={index}
                className="flex-row justify-between items-center"
              >
                <Text className="text-white font-semibold text-lg">
                  {item.urge}
                </Text>
                <View className="flex-row items-center">
                  <View className="w-20 bg-white bg-opacity-20 rounded-full h-3 mr-3">
                    <View
                      className="bg-blue-400 h-3 rounded-full"
                      style={{ width: `${(item.count / 18) * 100}%` }}
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

        {/* Weekly Trend */}
        <View className="bg-white bg-opacity-10 rounded-2xl p-6 mb-6 border border-white border-opacity-20">
          <Text className="text-2xl font-bold text-white mb-4 text-center">
            📈 Weekly Trend
          </Text>
          <View className="flex-row justify-between items-end h-32">
            {mockStats.weeklyTrend.map((item, index) => (
              <View key={index} className="flex-1 items-center">
                <View
                  className="bg-purple-400 rounded-t w-8 mb-2"
                  style={{ height: `${(item.count / 8) * 80}%`, minHeight: 8 }}
                />
                <Text className="text-white text-sm opacity-90">
                  {item.day}
                </Text>
                <Text className="text-white text-xs opacity-75">
                  {item.count}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Insights */}
        <View className="bg-white bg-opacity-15 rounded-2xl p-6 mb-8 border border-white border-opacity-30">
          <Text className="text-white font-bold text-center mb-3 text-xl">
            💡 Key Insight
          </Text>
          <Text className="text-white text-center text-lg opacity-90 leading-6">
            You're most vulnerable to urges on Thursdays when feeling stressed.
            Consider planning mindful activities for Thursday evenings.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PatternDashboard;
