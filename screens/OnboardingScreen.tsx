// src/screens/OnboardingScreen.tsx

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Image,
  Animated,
  Easing,
} from "react-native";
import { useOnboarding } from "../hooks/useOnboarding";
import { COMMON_URGES } from "../types";
import { storageService } from "../services/StorageService";

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
  const [selectedUrges, setSelectedUrges] = useState<string[]>([]);
  const { completeOnboarding } = useOnboarding();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

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
      id: "urge-selection",
      title: "Choose Your Focus",
      subtitle: "What urges are you mindful about?",
      description:
        "Select the urges you want to track. You can always add or remove urges later in settings.",
      icon: "🎯",
      tips: [
        "Select urges you want to be mindful about",
        "Your QuickLog will show only these urges",
        "This helps keep your tracking focused",
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
      tips: [
        "Quick 1-minute actions",
        "Proven techniques",
        "Personalized suggestions",
      ],
    },
    {
      id: "ready",
      title: "You're All Set!",
      subtitle: "Start your mindful journey",
      description:
        "Ready to build more awareness and intentional choices? Let's begin tracking your urges.",
      icon: "🚀",
      tips: [
        "Every urge logged is progress",
        "Patterns emerge over time",
        "Small changes create lasting impact",
      ],
    },
  ];

  // Update progress animation when step changes
  useEffect(() => {
    const progress = ((currentStep + 1) / steps.length) * 100;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [currentStep, progressAnim, steps.length]);

  const animateTransition = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 30,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      animateTransition(() => setCurrentStep(currentStep + 1));
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      animateTransition(() => setCurrentStep(currentStep - 1));
    }
  };

  const handleComplete = async () => {
    try {
      // Save selected urges to user settings
      const settings = await storageService.getUserSettings();
      settings.selectedUrges = selectedUrges;
      await storageService.saveUserSettings(settings);

      await completeOnboarding();
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const toggleUrgeSelection = (urge: string) => {
    setSelectedUrges((prev) =>
      prev.includes(urge) ? prev.filter((u) => u !== urge) : [...prev, urge]
    );
  };

  const renderUrgeSelectionStep = () => (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <Animated.View
        className="items-center px-6 py-8"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        }}
      >
        {/* Logo with bounce animation */}
        <Animated.View
          className="w-24 h-24 items-center justify-center mb-8 mt-8"
          style={{
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Text className="text-6xl">🎯</Text>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          className="text-4xl font-bold text-white text-center mb-4"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          Choose Your Focus
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          className="text-2xl text-white text-center mb-8 font-medium opacity-90"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: Animated.add(slideAnim, 10) }],
          }}
        >
          What urges are you mindful about?
        </Animated.Text>

        {/* Description */}
        <Animated.Text
          className="text-lg text-white text-center mb-8 leading-7 opacity-80"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: Animated.add(slideAnim, 20) }],
          }}
        >
          Select the urges you want to track. You can always add or remove urges
          later in settings.
        </Animated.Text>

        {/* Selection count */}
        <View className="mb-6 bg-white bg-opacity-20 rounded-lg px-4 py-2">
          <Text className="text-white font-medium text-center">
            {selectedUrges.length} urge{selectedUrges.length !== 1 ? "s" : ""}{" "}
            selected
          </Text>
        </View>

        {/* Urge selection grid */}
        <View className="w-full">
          {COMMON_URGES.map((urge, index) => {
            const isSelected = selectedUrges.includes(urge);
            return (
              <TouchableOpacity
                key={index}
                className="p-4 rounded-lg mb-3 border"
                style={{
                  backgroundColor: isSelected
                    ? "#FFFFFF"
                    : "rgba(255, 255, 255, 0.1)",
                  borderColor: isSelected
                    ? "transparent"
                    : "rgba(255, 255, 255, 0.3)",
                }}
                onPress={() => toggleUrgeSelection(urge)}
              >
                <View className="flex-row items-center justify-between">
                  <Text
                    className={`text-lg font-medium ${
                      isSelected ? "text-gray-800" : "text-white"
                    }`}
                  >
                    {urge}
                  </Text>
                  <View
                    className="w-6 h-6 rounded-full border-2 items-center justify-center"
                    style={{
                      borderColor: isSelected
                        ? "#10B981"
                        : "rgba(255, 255, 255, 0.5)",
                      backgroundColor: isSelected ? "#10B981" : "transparent",
                    }}
                  >
                    {isSelected && (
                      <Text className="text-white text-sm font-bold">✓</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Helper text */}
        <View className="mt-6 bg-white bg-opacity-10 rounded-lg p-4">
          <Text className="text-white text-center text-sm opacity-75">
            💡 Tip: Focus on 3-5 urges to start. You can always adjust your
            selection later in settings.
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );

  const renderStep = (step: OnboardingStep) => {
    if (step.id === "urge-selection") {
      return renderUrgeSelectionStep();
    }

    return (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View
          className="items-center px-6 py-8"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          }}
        >
          {/* Logo with bounce animation */}
          <Animated.View
            className="w-24 h-24 items-center justify-center mb-16 mt-16"
            style={{
              transform: [{ scale: scaleAnim }],
            }}
          >
            <Image
              source={require("../assets/logo2.png")}
              style={{ width: 128, height: 128 }}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Title with staggered animation */}
          <Animated.Text
            className="text-4xl font-bold text-white text-center mb-8"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {step.title}
          </Animated.Text>

          {/* Subtitle with delayed animation */}
          <Animated.Text
            className="text-2xl text-white text-center mb-16 font-medium opacity-90"
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: Animated.add(slideAnim, 10),
                },
              ],
            }}
          >
            {step.subtitle}
          </Animated.Text>

          {/* Description with more delayed animation */}
          <Animated.Text
            className="text-2xl text-white text-center mb-8 leading-7 opacity-80"
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: Animated.add(slideAnim, 20),
                },
              ],
            }}
          >
            {step.description}
          </Animated.Text>
        </Animated.View>
      </ScrollView>
    );
  };

  const isNextDisabled = () => {
    // For urge selection step, require at least one urge to be selected
    if (steps[currentStep].id === "urge-selection") {
      return selectedUrges.length === 0;
    }
    return false;
  };

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

        {/* Animated Progress bar */}
        <View className="w-full bg-white bg-opacity-20 rounded-full h-1 mt-4">
          <Animated.View
            className="h-1 rounded-full"
            style={{
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
                extrapolate: "clamp",
              }),
              backgroundColor: "#10B981",
            }}
          />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">{renderStep(steps[currentStep])}</View>

      {/* Bottom Navigation with button animations */}
      <View className="px-6 py-4 border-t border-white border-opacity-20">
        <View className="flex-row space-x-3">
          {currentStep > 0 && (
            <Animated.View
              className="flex-1"
              style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }}
            >
              <TouchableOpacity
                className="rounded-lg py-4 border border-white border-opacity-50"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
                onPress={handleBack}
              >
                <Text className="text-center text-white font-semibold text-2xl">
                  Back
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <Animated.View
            className="flex-1"
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <TouchableOpacity
              className={`rounded-lg py-4 ${
                isNextDisabled() ? "bg-gray-400 opacity-50" : "bg-white"
              }`}
              onPress={handleNext}
              disabled={isNextDisabled()}
            >
              <Text
                className={`text-center font-semibold text-2xl ${
                  isNextDisabled() ? "text-gray-600" : "text-gray-800"
                }`}
                style={{ color: isNextDisabled() ? "#9CA3AF" : "#185e66" }}
              >
                {currentStep === 0
                  ? "Get Started!"
                  : currentStep === steps.length - 1
                    ? "Finish!"
                    : "Next"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
