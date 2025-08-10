import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const UrgeAnalyticsScreen: React.FC = () => {
  const [selectedView, setSelectedView] = useState<string>("overview");

  // Mock user's selected urges from onboarding
  const userSelectedUrges = [
    "Scroll social media",
    "Eat junk food", 
    "Use phone",
    "Drink caffeine"
  ];

  const mockOverallAnalytics = {
    // Time patterns - when urges happen most
    timePatterns: [
      { hour: "7 AM", count: 8, percentage: 17 },
      { hour: "12 PM", count: 12, percentage: 26 },
      { hour: "3 PM", count: 9, percentage: 19 },
      { hour: "8 PM", count: 11, percentage: 23 },
      { hour: "10 PM", count: 7, percentage: 15 },
    ],
    
    // Most common triggers across all urges
    commonTriggers: [
      { trigger: "Boredom", count: 22, percentage: 47 },
      { trigger: "Stress", count: 15, percentage: 32 },
      { trigger: "Habit", count: 8, percentage: 17 },
      { trigger: "Anxiety", count: 6, percentage: 13 },
      { trigger: "Tiredness", count: 5, percentage: 11 },
    ],
    
    // Most common locations
    commonLocations: [
      { location: "Home", count: 28, percentage: 60 },
      { location: "Work", count: 12, percentage: 26 },
      { location: "Car", count: 4, percentage: 9 },
      { location: "Outside", count: 3, percentage: 6 },
    ],
    
    // Most common emotions
    commonEmotions: [
      { emotion: "Neutral", count: 18, percentage: 38 },
      { emotion: "Stressed", count: 12, percentage: 26 },
      { emotion: "Bored", count: 8, percentage: 17 },
      { emotion: "Anxious", count: 6, percentage: 13 },
      { emotion: "Tired", count: 3, percentage: 6 },
    ],

    // Day of week patterns
    dayPatterns: [
      { day: "Mon", count: 8 },
      { day: "Tue", count: 6 },
      { day: "Wed", count: 7 },
      { day: "Thu", count: 9 },
      { day: "Fri", count: 5 },
      { day: "Sat", count: 7 },
      { day: "Sun", count: 5 },
    ],
    
    // Urge frequency ranking
    urgeFrequency: [
      { urge: "Use phone", count: 21, percentage: 45 },
      { urge: "Scroll social media", count: 18, percentage: 38 },
      { urge: "Eat junk food", count: 14, percentage: 30 },
      { urge: "Drink caffeine", count: 12, percentage: 26 },
    ],
  };

  // Mock individual habit analytics data
  const mockHabitAnalytics = {
    "Scroll social media": {
      timePatterns: [
        { hour: "9 AM", count: 3, percentage: 17 },
        { hour: "2 PM", count: 4, percentage: 22 },
        { hour: "6 PM", count: 5, percentage: 28 },
        { hour: "9 PM", count: 6, percentage: 33 },
      ],
      triggers: [
        { trigger: "Boredom", count: 8, percentage: 44 },
        { trigger: "FOMO", count: 5, percentage: 28 },
        { trigger: "Waiting", count: 3, percentage: 17 },
        { trigger: "Habit", count: 2, percentage: 11 },
      ],
      locations: [
        { location: "Home", count: 12, percentage: 67 },
        { location: "Work", count: 4, percentage: 22 },
        { location: "Car", count: 2, percentage: 11 },
      ],
      emotions: [
        { emotion: "Bored", count: 8, percentage: 44 },
        { emotion: "Neutral", count: 6, percentage: 33 },
        { emotion: "Anxious", count: 3, percentage: 17 },
        { emotion: "Excited", count: 1, percentage: 6 },
      ],
      dayPatterns: [
        { day: "Mon", count: 3 },
        { day: "Tue", count: 2 },
        { day: "Wed", count: 3 },
        { day: "Thu", count: 4 },
        { day: "Fri", count: 2 },
        { day: "Sat", count: 3 },
        { day: "Sun", count: 1 },
      ],
    },
    "Eat junk food": {
      timePatterns: [
        { hour: "3 PM", count: 5, percentage: 36 },
        { hour: "9 PM", count: 4, percentage: 29 },
        { hour: "11 PM", count: 3, percentage: 21 },
        { hour: "7 PM", count: 2, percentage: 14 },
      ],
      triggers: [
        { trigger: "Stress", count: 6, percentage: 43 },
        { trigger: "Boredom", count: 4, percentage: 29 },
        { trigger: "Tiredness", count: 4, percentage: 29 },
      ],
      locations: [
        { location: "Home", count: 10, percentage: 71 },
        { location: "Work", count: 3, percentage: 21 },
        { location: "Car", count: 1, percentage: 7 },
      ],
      emotions: [
        { emotion: "Stressed", count: 6, percentage: 43 },
        { emotion: "Tired", count: 3, percentage: 21 },
        { emotion: "Neutral", count: 3, percentage: 21 },
        { emotion: "Sad", count: 2, percentage: 14 },
      ],
      dayPatterns: [
        { day: "Mon", count: 2 },
        { day: "Tue", count: 3 },
        { day: "Wed", count: 2 },
        { day: "Thu", count: 3 },
        { day: "Fri", count: 1 },
        { day: "Sat", count: 2 },
        { day: "Sun", count: 1 },
      ],
    },
    "Use phone": {
      timePatterns: [
        { hour: "7 AM", count: 4, percentage: 19 },
        { hour: "12 PM", count: 6, percentage: 29 },
        { hour: "4 PM", count: 5, percentage: 24 },
        { hour: "10 PM", count: 6, percentage: 29 },
      ],
      triggers: [
        { trigger: "Boredom", count: 9, percentage: 43 },
        { trigger: "Habit", count: 7, percentage: 33 },
        { trigger: "Anxiety", count: 5, percentage: 24 },
      ],
      locations: [
        { location: "Home", count: 12, percentage: 57 },
        { location: "Work", count: 6, percentage: 29 },
        { location: "Car", count: 2, percentage: 10 },
        { location: "Outside", count: 1, percentage: 5 },
      ],
      emotions: [
        { emotion: "Neutral", count: 9, percentage: 43 },
        { emotion: "Bored", count: 6, percentage: 29 },
        { emotion: "Anxious", count: 4, percentage: 19 },
        { emotion: "Stressed", count: 2, percentage: 10 },
      ],
      dayPatterns: [
        { day: "Mon", count: 4 },
        { day: "Tue", count: 2 },
        { day: "Wed", count: 3 },
        { day: "Thu", count: 4 },
        { day: "Fri", count: 3 },
        { day: "Sat", count: 3 },
        { day: "Sun", count: 2 },
      ],
    },
    "Drink caffeine": {
      timePatterns: [
        { hour: "7 AM", count: 4, percentage: 33 },
        { hour: "2 PM", count: 5, percentage: 42 },
        { hour: "4 PM", count: 3, percentage: 25 },
      ],
      triggers: [
        { trigger: "Tiredness", count: 5, percentage: 42 },
        { trigger: "Stress", count: 4, percentage: 33 },
        { trigger: "Habit", count: 3, percentage: 25 },
      ],
      locations: [
        { location: "Work", count: 7, percentage: 58 },
        { location: "Home", count: 4, percentage: 33 },
        { location: "Coffee shop", count: 1, percentage: 8 },
      ],
      emotions: [
        { emotion: "Tired", count: 5, percentage: 42 },
        { emotion: "Stressed", count: 4, percentage: 33 },
        { emotion: "Neutral", count: 3, percentage: 25 },
      ],
      dayPatterns: [
        { day: "Mon", count: 2 },
        { day: "Tue", count: 2 },
        { day: "Wed", count: 2 },
        { day: "Thu", count: 2 },
        { day: "Fri", count: 2 },
        { day: "Sat", count: 1 },
        { day: "Sun", count: 1 },
      ],
    }
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

  const getIconForTrigger = (trigger: string) => {
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      "Boredom": "time-outline",
      "Stress": "alert-circle-outline",
      "Habit": "repeat-outline",
      "Anxiety": "warning-outline",
      "Tiredness": "moon-outline",
      "FOMO": "eye-outline",
      "Waiting": "hourglass-outline",
    };
    return iconMap[trigger] || "help-circle-outline";
  };

  const getIconForLocation = (location: string) => {
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      "Home": "home-outline",
      "Work": "business-outline",
      "Car": "car-outline",
      "Outside": "sunny-outline",
      "Coffee shop": "cafe-outline",
    };
    return iconMap[location] || "location-outline";
  };

  const getIconForEmotion = (emotion: string) => {
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      "Neutral": "remove-outline",
      "Stressed": "flash-outline",
      "Bored": "time-outline",
      "Anxious": "warning-outline",
      "Tired": "moon-outline",
      "Excited": "happy-outline",
      "Sad": "sad-outline",
    };
    return iconMap[emotion] || "happy-outline";
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

  const renderBarChart = (data: any[], maxCount: number, colorClass: string) => (
    <View className="space-y-4">
      {data.map((item, index) => (
        <View key={index} className="space-y-2">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center flex-1">
              <Text className="text-white font-semibold text-lg">
                {item.trigger || item.location || item.emotion || item.hour}
              </Text>
            </View>
            <Text className="text-white opacity-90">
              {item.count} ({item.percentage}%)
            </Text>
          </View>
          <View
            className="w-full rounded-full h-3"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          >
            <View
              className={`${colorClass} h-3 rounded-full`}
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </View>
        </View>
      ))}
    </View>
  );

  const renderOverview = () => (
    <ScrollView className="flex-1 px-6">
      {/* Peak Times */}
      <View
        className="rounded-2xl p-6 mb-6 border"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <Text className="text-2xl font-bold text-white mb-4 text-center">
          ⏰ When Urges Happen Most
        </Text>
        {renderBarChart(mockOverallAnalytics.timePatterns, 12, "bg-blue-400")}
      </View>

      {/* Day of Week Pattern */}
      <View
        className="rounded-2xl p-6 mb-6 border"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <Text className="text-2xl font-bold text-white mb-4 text-center">
          📅 Day of Week Patterns
        </Text>
        <View className="flex-row justify-between items-end h-32 px-2">
          {mockOverallAnalytics.dayPatterns.map((item, index) => (
            <View key={index} className="items-center" style={{ width: '12%' }}>
              <View
                className="bg-purple-400 rounded-t mb-2"
                style={{ 
                  height: `${(item.count / 9) * 80}%`, 
                  minHeight: 8,
                  width: 28
                }}
              />
              <Text className="text-white text-xs opacity-90">
                {item.day}
              </Text>
              <Text className="text-white text-xs opacity-75">
                {item.count}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Most Common Triggers */}
      <View
        className="rounded-2xl p-6 mb-6 border"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <Text className="text-2xl font-bold text-white mb-4 text-center">
          🎯 Your Biggest Triggers
        </Text>
        <View className="space-y-4">
          {mockOverallAnalytics.commonTriggers.map((item, index) => (
            <View key={index} className="space-y-2">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center flex-1">
                  <Ionicons 
                    name={getIconForTrigger(item.trigger)} 
                    size={20} 
                    color="white" 
                    style={{ marginRight: 8 }} 
                  />
                  <Text className="text-white font-semibold text-lg">
                    {item.trigger}
                  </Text>
                </View>
                <Text className="text-white opacity-90">
                  {item.count} ({item.percentage}%)
                </Text>
              </View>
              <View
                className="w-full rounded-full h-3"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <View
                  className="bg-orange-400 h-3 rounded-full"
                  style={{ width: `${(item.count / 22) * 100}%` }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Most Common Locations */}
      <View
        className="rounded-2xl p-6 mb-6 border"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <Text className="text-2xl font-bold text-white mb-4 text-center">
          📍 Where Urges Happen
        </Text>
        <View className="space-y-4">
          {mockOverallAnalytics.commonLocations.map((item, index) => (
            <View key={index} className="space-y-2">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center flex-1">
                  <Ionicons 
                    name={getIconForLocation(item.location)} 
                    size={20} 
                    color="white" 
                    style={{ marginRight: 8 }} 
                  />
                  <Text className="text-white font-semibold text-lg">
                    {item.location}
                  </Text>
                </View>
                <Text className="text-white opacity-90">
                  {item.count} ({item.percentage}%)
                </Text>
              </View>
              <View
                className="w-full rounded-full h-3"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <View
                  className="bg-cyan-400 h-3 rounded-full"
                  style={{ width: `${(item.count / 28) * 100}%` }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Most Common Emotions */}
      <View
        className="rounded-2xl p-6 mb-6 border"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <Text className="text-2xl font-bold text-white mb-4 text-center">
          😊 Your Emotional States
        </Text>
        <View className="space-y-4">
          {mockOverallAnalytics.commonEmotions.map((item, index) => (
            <View key={index} className="space-y-2">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center flex-1">
                  <Ionicons 
                    name={getIconForEmotion(item.emotion)} 
                    size={20} 
                    color="white" 
                    style={{ marginRight: 8 }} 
                  />
                  <Text className="text-white font-semibold text-lg">
                    {item.emotion}
                  </Text>
                </View>
                <Text className="text-white opacity-90">
                  {item.count} ({item.percentage}%)
                </Text>
              </View>
              <View
                className="w-full rounded-full h-3"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <View
                  className="bg-pink-400 h-3 rounded-full"
                  style={{ width: `${(item.count / 18) * 100}%` }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Urge Frequency Ranking */}
      <View
        className="rounded-2xl p-6 mb-8 border"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderColor: "rgba(255, 255, 255, 0.3)",
        }}
      >
        <Text className="text-2xl font-bold text-white mb-4 text-center">
          📊 Most Frequent Urges
        </Text>
        <View className="space-y-4">
          {mockOverallAnalytics.urgeFrequency.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="space-y-2"
              onPress={() => setSelectedView(item.urge)}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center flex-1">
                  <Text className="text-yellow-400 font-bold text-lg mr-3">
                    #{index + 1}
                  </Text>
                  <Ionicons 
                    name={getIconForUrge(item.urge)} 
                    size={20} 
                    color="white" 
                    style={{ marginRight: 8 }} 
                  />
                  <Text className="text-white font-semibold text-lg">
                    {item.urge}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-white opacity-90 mr-2">
                    {item.count} times
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
                </View>
              </View>
              <View
                className="w-full rounded-full h-3"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <View
                  className="bg-yellow-400 h-3 rounded-full"
                  style={{ width: `${(item.count / 21) * 100}%` }}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderIndividualHabit = (habitName: string) => {
    const habitData = mockHabitAnalytics[habitName as keyof typeof mockHabitAnalytics];
    
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
          <Text className="text-white opacity-90 text-center">
            Understanding when and why this urge occurs
          </Text>
        </View>

        {/* Peak Times for This Habit */}
        <View
          className="rounded-2xl p-6 mb-6 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Text className="text-2xl font-bold text-white mb-4 text-center">
            ⏰ When This Happens
          </Text>
          {renderBarChart(habitData.timePatterns, Math.max(...habitData.timePatterns.map(t => t.count)), "bg-blue-400")}
        </View>

        {/* Day Pattern */}
        <View
          className="rounded-2xl p-6 mb-6 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Text className="text-2xl font-bold text-white mb-4 text-center">
            📅 Weekly Pattern
          </Text>
          <View className="flex-row justify-between items-end h-32 px-2">
            {habitData.dayPatterns.map((item, index) => (
              <View key={index} className="items-center" style={{ width: '12%' }}>
                <View
                  className="bg-purple-400 rounded-t mb-2"
                  style={{ 
                    height: `${(item.count / Math.max(...habitData.dayPatterns.map(d => d.count))) * 80}%`, 
                    minHeight: 8,
                    width: 28
                  }}
                />
                <Text className="text-white text-xs opacity-90">
                  {item.day}
                </Text>
                <Text className="text-white text-xs opacity-75">
                  {item.count}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Triggers for This Habit */}
        <View
          className="rounded-2xl p-6 mb-6 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Text className="text-2xl font-bold text-white mb-4 text-center">
            🎯 What Triggers This
          </Text>
          <View className="space-y-4">
            {habitData.triggers.map((item, index) => (
              <View key={index} className="space-y-2">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center flex-1">
                    <Ionicons 
                      name={getIconForTrigger(item.trigger)} 
                      size={20} 
                      color="white" 
                      style={{ marginRight: 8 }} 
                    />
                    <Text className="text-white font-semibold text-lg">
                      {item.trigger}
                    </Text>
                  </View>
                  <Text className="text-white opacity-90">
                    {item.count} ({item.percentage}%)
                  </Text>
                </View>
                <View
                  className="w-full rounded-full h-3"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                >
                  <View
                    className="bg-orange-400 h-3 rounded-full"
                    style={{ width: `${(item.count / Math.max(...habitData.triggers.map(t => t.count))) * 100}%` }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Locations for This Habit */}
        <View
          className="rounded-2xl p-6 mb-6 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Text className="text-2xl font-bold text-white mb-4 text-center">
            📍 Where This Happens
          </Text>
          <View className="space-y-4">
            {habitData.locations.map((item, index) => (
              <View key={index} className="space-y-2">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center flex-1">
                    <Ionicons 
                      name={getIconForLocation(item.location)} 
                      size={20} 
                      color="white" 
                      style={{ marginRight: 8 }} 
                    />
                    <Text className="text-white font-semibold text-lg">
                      {item.location}
                    </Text>
                  </View>
                  <Text className="text-white opacity-90">
                    {item.count} ({item.percentage}%)
                  </Text>
                </View>
                <View
                  className="w-full rounded-full h-3"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                >
                  <View
                    className="bg-cyan-400 h-3 rounded-full"
                    style={{ width: `${(item.count / Math.max(...habitData.locations.map(l => l.count))) * 100}%` }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Emotions for This Habit */}
        <View
          className="rounded-2xl p-6 mb-8 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Text className="text-2xl font-bold text-white mb-4 text-center">
            😊 Your Emotional State
          </Text>
          <View className="space-y-4">
            {habitData.emotions.map((item, index) => (
              <View key={index} className="space-y-2">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center flex-1">
                    <Ionicons 
                      name={getIconForEmotion(item.emotion)} 
                      size={20} 
                      color="white" 
                      style={{ marginRight: 8 }} 
                    />
                    <Text className="text-white font-semibold text-lg">
                      {item.emotion}
                    </Text>
                  </View>
                  <Text className="text-white opacity-90">
                    {item.count} ({item.percentage}%)
                  </Text>
                </View>
                <View
                  className="w-full rounded-full h-3"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                >
                  <View
                    className="bg-pink-400 h-3 rounded-full"
                    style={{ width: `${(item.count / Math.max(...habitData.emotions.map(e => e.count))) * 100}%` }}
                  />
                </View>
              </View>
            ))}
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
          {selectedView === "overview" ? "Urge Analytics" : selectedView}
        </Text>
        <Text className="text-xl text-white text-center mt-2 opacity-90">
          {selectedView === "overview" ? "Understanding the why behind urges" : "Deep dive into this habit"}
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

export default UrgeAnalyticsScreen;