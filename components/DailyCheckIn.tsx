import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import { useUrgeData } from "../hooks/useUrgeData";
import { getRandomMotivationalQuote } from "../utils/analytics";

interface DailyCheckInProps {
  visible: boolean;
  onComplete: () => void;
  onDismiss: () => void;
}

interface CheckInData {
  mood: number; // 1-5 scale
  energy: number; // 1-5 scale
  stress: number; // 1-5 scale
  goals: string;
  reflection: string;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({
  visible,
  onComplete,
  onDismiss,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [checkInData, setCheckInData] = useState<CheckInData>({
    mood: 3,
    energy: 3,
    stress: 3,
    goals: "",
    reflection: "",
  });

  const { getTodaysLogs } = useUrgeData();
  const todaysLogs = getTodaysLogs();
  const todaysWins = todaysLogs.filter((log) => !log.actedOn);
  const successRate =
    todaysLogs.length > 0
      ? Math.round((todaysWins.length / todaysLogs.length) * 100)
      : 0;

  const steps = ["mood", "energy", "stress", "goals", "reflection", "summary"];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save check-in data (could expand this to storage)
    console.log("Check-in completed:", checkInData);
    onComplete();
  };

  const renderScaleSelector = (
    title: string,
    subtitle: string,
    value: number,
    onChange: (value: number) => void,
    labels: string[]
  ) => (
    <View className="items-center">
      <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
        {title}
      </Text>
      <Text className="text-gray-600 mb-8 text-center">{subtitle}</Text>

      <View className="w-full">
        <View className="flex-row justify-between mb-4">
          {labels.map((label, index) => (
            <TouchableOpacity
              key={index}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                value === index + 1 ? "bg-blue-500" : "bg-gray-200"
              }`}
              onPress={() => onChange(index + 1)}
            >
              <Text
                className={`font-bold ${
                  value === index + 1 ? "text-white" : "text-gray-600"
                }`}
              >
                {index + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row justify-between">
          {labels.map((label, index) => (
            <Text
              key={index}
              className="text-xs text-gray-500 text-center w-12"
            >
              {label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep = () => {
    switch (steps[currentStep]) {
      case "mood":
        return renderScaleSelector(
          "How's your mood?",
          "Rate how you're feeling right now",
          checkInData.mood,
          (value) => setCheckInData((prev) => ({ ...prev, mood: value })),
          ["😔", "😕", "😐", "😊", "😄"]
        );

      case "energy":
        return renderScaleSelector(
          "Energy level?",
          "How energized do you feel?",
          checkInData.energy,
          (value) => setCheckInData((prev) => ({ ...prev, energy: value })),
          ["😴", "😑", "😐", "💪", "⚡"]
        );

      case "stress":
        return renderScaleSelector(
          "Stress level?",
          "How stressed are you feeling?",
          checkInData.stress,
          (value) => setCheckInData((prev) => ({ ...prev, stress: value })),
          ["😌", "🙂", "😐", "😰", "🤯"]
        );

      case "goals":
        return (
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Today's Intention
            </Text>
            <Text className="text-gray-600 mb-8 text-center">
              What's one thing you want to focus on today?
            </Text>

            <TextInput
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-lg"
              placeholder="I want to focus on..."
              value={checkInData.goals}
              onChangeText={(text) =>
                setCheckInData((prev) => ({ ...prev, goals: text }))
              }
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        );

      case "reflection":
        return (
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Quick Reflection
            </Text>
            <Text className="text-gray-600 mb-8 text-center">
              How are you feeling about your progress lately?
            </Text>

            <TextInput
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-lg"
              placeholder="I've been noticing..."
              value={checkInData.reflection}
              onChangeText={(text) =>
                setCheckInData((prev) => ({ ...prev, reflection: text }))
              }
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        );

      case "summary":
        return (
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
              You're doing great! 🎉
            </Text>

            {/* Today's Stats */}
            <View className="bg-blue-50 rounded-lg p-6 w-full mb-6">
              <Text className="text-lg font-semibold text-blue-800 mb-4 text-center">
                Today's Progress
              </Text>

              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-blue-600">
                    {todaysLogs.length}
                  </Text>
                  <Text className="text-blue-700 text-sm">Urges Logged</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-green-600">
                    {todaysWins.length}
                  </Text>
                  <Text className="text-green-700 text-sm">Resisted</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-purple-600">
                    {successRate}%
                  </Text>
                  <Text className="text-purple-700 text-sm">Success Rate</Text>
                </View>
              </View>
            </View>

            {/* Motivational Quote */}
            <View className="bg-gray-50 rounded-lg p-4 w-full">
              <Text className="text-gray-700 text-center italic">
                "{getRandomMotivationalQuote()}"
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-6">
        <View className="bg-white rounded-lg p-6 w-full max-w-sm">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-semibold text-gray-800">
              Daily Check-in
            </Text>
            <TouchableOpacity onPress={onDismiss}>
              <Text className="text-gray-500 text-xl">×</Text>
            </TouchableOpacity>
          </View>

          {/* Progress */}
          <View className="mb-8">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 text-sm">
                Step {currentStep + 1} of {steps.length}
              </Text>
            </View>
            <View className="w-full bg-gray-200 rounded-full h-2">
              <View
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </View>
          </View>

          {/* Content */}
          <View className="mb-8 min-h-48">{renderStep()}</View>

          {/* Navigation */}
          <View className="flex-row space-x-3">
            {currentStep > 0 && (
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-lg py-3"
                onPress={handleBack}
              >
                <Text className="text-center text-gray-700 font-medium">
                  Back
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="flex-1 bg-blue-500 rounded-lg py-3"
              onPress={handleNext}
            >
              <Text className="text-center text-white font-medium">
                {currentStep === steps.length - 1 ? "Complete" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DailyCheckIn;
