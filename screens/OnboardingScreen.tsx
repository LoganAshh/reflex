// src/screens/OnboardingScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useOnboarding } from "../hooks/useOnboarding";

const { width } = Dimensions.get("window");

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  tips: string[];
}

const OnboardingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { completeOnboarding } = useOnboarding();

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to Reflex",
      subtitle: "Your mindful urge companion",
      description:
        "Reflex helps you build self-awareness and transform automatic urges into conscious choices.",
      icon: "🧠",
      tips: [
        "Track urges without judgment",
        "Discover your patterns",
        "Build healthier responses",
      ],
    },
    {
      id: "how-it-works",
      title: "How It Works",
      subtitle: "Simple, powerful tracking",
      description:
        "When you feel an urge, quickly log it. Over time, you'll see patterns and build better habits.",
      icon: "📝",
      tips: [
        "Log urges in under 30 seconds",
        "See patterns in your behavior",
        "Replace urges with positive actions",
      ],
    },
    {
      id: "privacy",
      title: "Your Privacy Matters",
      subtitle: "Data stays on your device",
      description:
        "All your data is stored locally on your phone. We never collect or share your personal information.",
      icon: "🔒",
      tips: [
        "No account required",
        "No data sent to servers",
        "You control your information",
      ],
    },
    {
      id: "patterns",
      title: "Discover Patterns",
      subtitle: "Insights from your data",
      description:
        "See when, where, and why urges happen. Understanding patterns is the first step to change.",
      icon: "📊",
      tips: ["Time-based patterns", "Common triggers", "Success rate tracking"],
    },
    {
      id: "actions",
      title: "Replacement Actions",
      subtitle: "Build positive habits",
      description:
        "Instead of just resisting urges, replace them with healthy alternatives that make you feel good.",
      icon: "⚡",
      tips: ["Breathing exercises", "Physical movement", "Social connections"],
    },
  ];

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

  const handleComplete = async () => {
    try {
      await completeOnboarding();
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const renderStep = (step: OnboardingStep) => (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="items-center px-6 py-8">
        {/* Icon */}
        <View className="w-24 h-24 bg-blue-50 rounded-full items-center justify-center mb-6">
          <Text className="text-4xl">{step.icon}</Text>
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-gray-800 text-center mb-3">
          {step.title}
        </Text>

        {/* Subtitle */}
        <Text className="text-lg text-blue-600 text-center mb-6 font-medium">
          {step.subtitle}
        </Text>

        {/* Description */}
        <Text className="text-lg text-gray-600 text-center mb-8 leading-7">
          {step.description}
        </Text>

        {/* Tips */}
        <View className="bg-gray-50 rounded-lg p-6 w-full">
          <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Key Features:
          </Text>
          {step.tips.map((tip, index) => (
            <View key={index} className="flex-row items-center mb-3">
              <View className="w-6 h-6 bg-green-100 rounded-full items-center justify-center mr-3">
                <Text className="text-green-600 font-bold text-xs">✓</Text>
              </View>
              <Text className="text-gray-700 flex-1">{tip}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={handleSkip}>
            <Text className="text-gray-500 text-lg">Skip</Text>
          </TouchableOpacity>

          <Text className="text-gray-500 text-lg">
            {currentStep + 1} of {steps.length}
          </Text>
        </View>

        {/* Progress bar */}
        <View className="w-full bg-gray-200 rounded-full h-1 mt-4">
          <View
            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">{renderStep(steps[currentStep])}</View>

      {/* Bottom Navigation */}
      <View className="px-6 py-4 bg-white border-t border-gray-100">
        <View className="flex-row space-x-3">
          {currentStep > 0 && (
            <TouchableOpacity
              className="flex-1 bg-gray-100 rounded-lg py-4"
              onPress={handleBack}
            >
              <Text className="text-center text-gray-700 font-semibold text-lg">
                Back
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="flex-1 bg-blue-500 rounded-lg py-4"
            onPress={handleNext}
          >
            <Text className="text-center text-white font-semibold text-lg">
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
