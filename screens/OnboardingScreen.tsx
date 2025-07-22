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

  // Animate progress bar when step changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: ((currentStep + 1) / steps.length) * 100,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  // Initial entrance animation
  useEffect(() => {
    // Reset animations for new step
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.8);

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const animateTransition = (callback: () => void) => {
    // Animate out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
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
          className="text-xl text-white text-center mb-8 leading-7 opacity-80"
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
                <Text className="text-center text-white font-semibold text-lg">
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
              className="bg-white rounded-lg py-4"
              onPress={handleNext}
            >
              <Text
                className="text-center font-semibold text-lg"
                style={{ color: "#185e66" }}
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
