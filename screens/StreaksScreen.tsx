import React from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";

const StreaksScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <Text className="text-3xl font-bold text-white text-center">
          Your Streaks
        </Text>
        <Text className="text-xl text-white text-center mt-2 opacity-90">
          Building better habits daily
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Current Streak */}
        <View
          className="rounded-2xl p-6 mb-6 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <View className="items-center">
            <Text className="text-6xl font-bold text-white mb-2">3</Text>
            <Text className="text-2xl text-white font-semibold mb-1">
              Current Streak
            </Text>
            <Text className="text-lg text-white opacity-80">
              Days of mindful choices
            </Text>

            <View
              className="mt-6 p-4 rounded-lg border"
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.3)",
                borderColor: "rgba(52, 211, 153, 0.5)",
              }}
            >
              <Text className="text-white font-bold text-center text-lg">
                🔥 You're on fire!
              </Text>
              <Text className="text-white text-center mt-1 opacity-90">
                Keep going - you've got this! 💪
              </Text>
            </View>
          </View>
        </View>

        {/* Streak Goals */}
        <View
          className="rounded-2xl p-6 mb-6 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Text className="text-2xl font-bold text-white mb-6 text-center">
            Streak Goals
          </Text>

          <View className="space-y-6">
            <View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white font-semibold text-lg">
                  No doom scrolling
                </Text>
                <Text className="text-white opacity-75 text-lg">7/30 days</Text>
              </View>
              <View
                className="w-full rounded-full h-3"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <View
                  className="bg-blue-400 h-3 rounded-full"
                  style={{ width: "23%" }}
                />
              </View>
            </View>

            <View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white font-semibold text-lg">
                  Mindful eating
                </Text>
                <Text className="text-white opacity-75 text-lg">3/7 days</Text>
              </View>
              <View
                className="w-full rounded-full h-3"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <View
                  className="bg-green-400 h-3 rounded-full"
                  style={{ width: "43%" }}
                />
              </View>
            </View>

            <View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white font-semibold text-lg">
                  Digital wellness
                </Text>
                <Text className="text-white opacity-75 text-lg">5/14 days</Text>
              </View>
              <View
                className="w-full rounded-full h-3"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <View
                  className="bg-purple-400 h-3 rounded-full"
                  style={{ width: "36%" }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Motivation */}
        <View
          className="rounded-2xl p-6 mb-8 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderColor: "rgba(255, 255, 255, 0.3)",
          }}
        >
          <Text className="text-white font-bold text-center mb-3 text-xl">
            💪 You're rewiring your brain!
          </Text>
          <Text className="text-white text-center text-lg opacity-90 leading-6">
            Every urge you resist strengthens your self-control. You're
            literally building new neural pathways.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StreaksScreen;
