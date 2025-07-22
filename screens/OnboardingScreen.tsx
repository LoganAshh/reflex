// src/screens/OnboardingScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Image,
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
      title: "Welcome to Reflex!",
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
        <View className="w-24 h-24 items-center justify-center mb-12 mt-12">
          <Image
            source={require("../assets/logo2.png")}
            style={{ width: 128, height: 128 }}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text className="text-4xl font-bold text-white text-center mb-12">
          {step.title}
        </Text>

        {/* Subtitle */}
        <Text className="text-2xl text-white text-center mb-24 font-medium opacity-90">
          {step.subtitle}
        </Text>

        {/* Description */}
        <Text className="text-xl text-white text-center mb-8 leading-7 opacity-80">
          {step.description}
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={handleSkip}>
            <Text className="text-white text-lg opacity-75">Skip</Text>
          </TouchableOpacity>

          <Text className="text-white text-lg opacity-75">
            {currentStep + 1} of {steps.length}
          </Text>
        </View>

        {/* Progress bar */}
        <View className="w-full bg-white bg-opacity-20 rounded-full h-1 mt-4">
          <View
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              backgroundColor: "#10B981", // green color for progress
            }}
          />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">{renderStep(steps[currentStep])}</View>

      {/* Bottom Navigation */}
      <View className="px-6 py-4 border-t border-white border-opacity-20">
        <View className="flex-row space-x-3">
          {currentStep > 0 && (
            <TouchableOpacity
              className="flex-1 rounded-lg py-4 border border-white border-opacity-50"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
              onPress={handleBack}
            >
              <Text className="text-center text-white font-semibold text-lg">
                Back
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="flex-1 bg-white rounded-lg py-4"
            onPress={handleNext}
          >
            <Text
              className="text-center font-semibold text-lg"
              style={{ color: "#185e66" }}
            >
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
