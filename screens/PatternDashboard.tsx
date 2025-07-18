import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";

interface UrgeLog {
  id: string;
  urge: string;
  location: string;
  trigger: string;
  actedOn: boolean;
  timestamp: Date;
}

interface DashboardStats {
  totalUrges: number;
  urgesResisted: number;
  successRate: number;
  commonTriggers: { trigger: string; count: number }[];
  commonUrges: { urge: string; count: number }[];
  hourlyHeatmap: { hour: number; count: number }[];
  weeklyTrend: { day: string; count: number }[];
}

const PatternDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "all">("week");
  const [stats, setStats] = useState<DashboardStats>({
    totalUrges: 0,
    urgesResisted: 0,
    successRate: 0,
    commonTriggers: [],
    commonUrges: [],
    hourlyHeatmap: [],
    weeklyTrend: [],
  });

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from your storage/database
    const mockStats: DashboardStats = {
      totalUrges: 47,
      urgesResisted: 23,
      successRate: 49,
      commonTriggers: [
        { trigger: "Boredom", count: 15 },
        { trigger: "Stress", count: 12 },
        { trigger: "Loneliness", count: 8 },
        { trigger: "Notification", count: 7 },
        { trigger: "Anxiety", count: 5 },
      ],
      commonUrges: [
        { urge: "Scroll Instagram", count: 18 },
        { urge: "Check phone", count: 12 },
        { urge: "Open fridge", count: 9 },
        { urge: "Text someone", count: 5 },
        { urge: "Watch porn", count: 3 },
      ],
      hourlyHeatmap: [
        { hour: 0, count: 0 },
        { hour: 1, count: 0 },
        { hour: 2, count: 0 },
        { hour: 3, count: 0 },
        { hour: 4, count: 0 },
        { hour: 5, count: 0 },
        { hour: 6, count: 1 },
        { hour: 7, count: 2 },
        { hour: 8, count: 1 },
        { hour: 9, count: 3 },
        { hour: 10, count: 4 },
        { hour: 11, count: 6 },
        { hour: 12, count: 3 },
        { hour: 13, count: 2 },
        { hour: 14, count: 4 },
        { hour: 15, count: 5 },
        { hour: 16, count: 3 },
        { hour: 17, count: 2 },
        { hour: 18, count: 4 },
        { hour: 19, count: 5 },
        { hour: 20, count: 7 },
        { hour: 21, count: 8 },
        { hour: 22, count: 6 },
        { hour: 23, count: 2 },
      ],
      weeklyTrend: [
        { day: "Mon", count: 8 },
        { day: "Tue", count: 6 },
        { day: "Wed", count: 7 },
        { day: "Thu", count: 9 },
        { day: "Fri", count: 5 },
        { day: "Sat", count: 8 },
        { day: "Sun", count: 4 },
      ],
    };
    setStats(mockStats);
  }, [timeframe]);

  const renderStatCard = (
    title: string,
    value: string,
    subtitle?: string,
    color = "blue"
  ) => (
    <View
      className={`bg-white rounded-lg p-4 border-l-4 border-${color}-500 shadow-sm`}
    >
      <Text className="text-gray-600 text-sm font-medium">{title}</Text>
      <Text className="text-2xl font-bold text-gray-800 mt-1">{value}</Text>
      {subtitle && (
        <Text className="text-gray-500 text-xs mt-1">{subtitle}</Text>
      )}
    </View>
  );

  const renderHeatmap = () => {
    const maxCount = Math.max(...stats.hourlyHeatmap.map((h) => h.count));

    return (
      <View className="bg-white rounded-lg p-4 shadow-sm">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Time of Day Heatmap
        </Text>
        <View className="flex-row flex-wrap">
          {stats.hourlyHeatmap.map((hour) => {
            const intensity = maxCount > 0 ? hour.count / maxCount : 0;
            const backgroundColor =
              intensity > 0.7
                ? "#ef4444"
                : intensity > 0.4
                  ? "#f97316"
                  : intensity > 0.1
                    ? "#eab308"
                    : "#e5e7eb";

            return (
              <View key={hour.hour} className="items-center m-1">
                <View className="w-6 h-6 rounded" style={{ backgroundColor }} />
                <Text className="text-xs text-gray-600 mt-1">
                  {hour.hour.toString().padStart(2, "0")}
                </Text>
              </View>
            );
          })}
        </View>
        <View className="flex-row justify-between mt-3">
          <Text className="text-xs text-gray-500">Less</Text>
          <View className="flex-row space-x-1">
            {["#e5e7eb", "#eab308", "#f97316", "#ef4444"].map((color, i) => (
              <View
                key={i}
                className="w-3 h-3 rounded"
                style={{ backgroundColor: color }}
              />
            ))}
          </View>
          <Text className="text-xs text-gray-500">More</Text>
        </View>
      </View>
    );
  };

  const renderTopList = (
    title: string,
    items: { trigger?: string; urge?: string; count: number }[]
  ) => (
    <View className="bg-white rounded-lg p-4 shadow-sm">
      <Text className="text-lg font-bold text-gray-800 mb-4">{title}</Text>
      {items.map((item, index) => (
        <View
          key={index}
          className="flex-row items-center justify-between py-2"
        >
          <Text className="text-gray-700 flex-1">
            {item.trigger || item.urge}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-gray-500 text-sm mr-2">{item.count}</Text>
            <View className="w-16 h-2 bg-gray-200 rounded-full">
              <View
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `${(item.count / items[0].count) * 100}%` }}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderWeeklyTrend = () => (
    <View className="bg-white rounded-lg p-4 shadow-sm">
      <Text className="text-lg font-bold text-gray-800 mb-4">Weekly Trend</Text>
      <View className="flex-row justify-between items-end h-32">
        {stats.weeklyTrend.map((day, index) => {
          const maxCount = Math.max(...stats.weeklyTrend.map((d) => d.count));
          const height = (day.count / maxCount) * 100;

          return (
            <View key={index} className="items-center flex-1">
              <View
                className="w-8 bg-blue-500 rounded-t"
                style={{ height: `${height}%` }}
              />
              <Text className="text-xs text-gray-600 mt-2">{day.day}</Text>
              <Text className="text-xs text-gray-500">{day.count}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Patterns</Text>
        <Text className="text-gray-600 mt-1">Understand your urges</Text>

        {/* Timeframe selector */}
        <View className="flex-row mt-4 bg-gray-100 rounded-lg p-1">
          {(["week", "month", "all"] as const).map((period) => (
            <TouchableOpacity
              key={period}
              className={`flex-1 py-2 px-4 rounded-md ${
                timeframe === period ? "bg-white shadow-sm" : ""
              }`}
              onPress={() => setTimeframe(period)}
            >
              <Text
                className={`text-center capitalize ${
                  timeframe === period
                    ? "text-blue-600 font-medium"
                    : "text-gray-600"
                }`}
              >
                {period === "all" ? "All Time" : `This ${period}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6 space-y-4">
        {/* Key Stats */}
        <View className="space-y-3">
          <View className="flex-row space-x-3">
            {renderStatCard("Total Urges", stats.totalUrges.toString())}
            {renderStatCard(
              "Resisted",
              stats.urgesResisted.toString(),
              "urges",
              "green"
            )}
          </View>
          <View className="flex-row space-x-3">
            {renderStatCard(
              "Success Rate",
              `${stats.successRate}%`,
              "resistance rate",
              "purple"
            )}
            {renderStatCard("Avg/Day", "6.7", "urges per day", "orange")}
          </View>
        </View>

        {/* Heatmap */}
        {renderHeatmap()}

        {/* Weekly Trend */}
        {renderWeeklyTrend()}

        {/* Top Triggers */}
        {renderTopList("Most Common Triggers", stats.commonTriggers)}

        {/* Top Urges */}
        {renderTopList("Most Common Urges", stats.commonUrges)}

        {/* Insights */}
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            💡 Insights
          </Text>
          <View className="space-y-3">
            <View className="bg-blue-50 p-3 rounded-lg">
              <Text className="text-blue-800 font-medium">Peak Hours</Text>
              <Text className="text-blue-700 text-sm mt-1">
                Most urges happen between 9-11 PM. Consider a wind-down routine.
              </Text>
            </View>
            <View className="bg-yellow-50 p-3 rounded-lg">
              <Text className="text-yellow-800 font-medium">
                Trigger Pattern
              </Text>
              <Text className="text-yellow-700 text-sm mt-1">
                Boredom triggers 32% of your urges. Try keeping a list of
                engaging activities.
              </Text>
            </View>
            <View className="bg-green-50 p-3 rounded-lg">
              <Text className="text-green-800 font-medium">Progress</Text>
              <Text className="text-green-700 text-sm mt-1">
                Your resistance rate improved by 15% this week. Keep it up!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PatternDashboard;
