// screens/OnboardingScreen.tsx

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
import { Ionicons } from "@expo/vector-icons";
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
  iconName?: keyof typeof Ionicons.glyphMap;
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

  // Helper function to get icon for urge
  const getIconForUrge = (urgeText: string) => {
    const urgeObj = COMMON_URGES.find((u) => u.text === urgeText);
    return urgeObj?.icon || "help-circle-outline";
  };

  // Preload the logo image
  useEffect(() => {
    Image.prefetch(
      Image.resolveAssetSource(require("../assets/logo3.png")).uri
    );
  }, []);

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to Reflex!",
      subtitle: "First of all, Congrats! 🎉",
      description:
        "You have just taken the first step towards breaking your bad habits and addictions!",
      icon: "logo", // Special case for logo
    },
    {
      id: "how-it-works",
      title: "How It Works",
      subtitle: "Simple, powerful tracking",
      description:
        "When you feel an urge, quickly log it. Over time, you'll see patterns and build better habits.",
      icon: "",
      iconName: "create-outline",
    },
    {
      id: "patterns",
      title: "Discover Patterns",
      subtitle: "Insights from your data",
      description:
        "See when, where, and why urges happen. Understanding patterns is the first step to change.",
      icon: "",
      iconName: "analytics-outline",
    },
    {
      id: "actions",
      title: "Replacement Actions",
      subtitle: "Build positive habits",
      description:
        "Instead of just resisting urges, replace them with healthy alternatives that make you feel good.",
      icon: "",
      iconName: "flash-outline",
    },
    {
      id: "privacy",
      title: "Your Privacy Matters",
      subtitle: "Data stays on your device",
      description:
        "All your data is stored locally on your phone. We never collect or share your personal information.",
      icon: "",
      iconName: "lock-closed-outline",
    },
    {
      id: "pricing",
      title: "Free Forever",
      subtitle: "Core features always available",
      description:
        "Reflex's essential tracking and insights remain completely free. Premium features are optional add-ons to enhance your experience.",
      icon: "",
      iconName: "gift-outline",
    },
    {
      id: "judgment-free",
      title: "Zero Judgment Zone",
      subtitle: "A safe space for honest reflection",
      description:
        "Every urge is human. There's no shame in feeling them or even acting on them. Progress comes from awareness, not perfection.",
      icon: "",
      iconName: "heart-outline",
    },
    {
      id: "urge-selection",
      title: "Choose Your Focus",
      subtitle: "What urges are you mindful about?",
      description:
        "Select the urges you want to track. You can always add or remove urges later in settings.",
      icon: "",
      iconName: "radio-button-on-outline",
    },
    {
      id: "ready",
      title: "You're All Set!",
      subtitle: "Start your mindful journey",
      description:
        "Ready to build more awareness and intentional choices? Let's begin tracking your urges.",
      icon: "",
      iconName: "rocket-outline",
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

  const toggleUrgeSelection = (urgeText: string) => {
    setSelectedUrges((prev) =>
      prev.includes(urgeText)
        ? prev.filter((u) => u !== urgeText)
        : [...prev, urgeText]
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
        {/* Icon with bounce animation */}
        <Animated.View
          className="w-32 h-32 items-center justify-center mb-8 mt-8"
          style={{
            transform: [{ scale: scaleAnim }],
            paddingHorizontal: 8,
            paddingVertical: 8,
          }}
        >
          <Ionicons name="radio-button-on-outline" size={88} color="white" />
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
          Select up to 5 urges you want to track. You can always add or remove
          urges later in settings.
        </Animated.Text>

        {/* Selection count */}
        <View className="mb-6 bg-white bg-opacity-20 rounded-lg px-4 py-2">
          <Text className="text-black font-bold text-center">
            {selectedUrges.length} urge{selectedUrges.length !== 1 ? "s" : ""}{" "}
            selected
          </Text>
        </View>

        {/* Urge selection grid */}
        <View className="w-full">
          {COMMON_URGES.map((urge, index) => {
            const isSelected = selectedUrges.includes(urge.text);
            const isDisabled = !isSelected && selectedUrges.length >= 5;
            return (
              <TouchableOpacity
                key={index}
                className="p-4 rounded-lg mb-3 border"
                style={{
                  backgroundColor: isSelected
                    ? "#FFFFFF"
                    : isDisabled
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(255, 255, 255, 0.1)",
                  borderColor: isSelected
                    ? "transparent"
                    : isDisabled
                      ? "rgba(255, 255, 255, 0.15)"
                      : "rgba(255, 255, 255, 0.3)",
                }}
                onPress={() => !isDisabled && toggleUrgeSelection(urge.text)}
                disabled={isDisabled}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <Ionicons
                      name={urge.icon}
                      size={24}
                      color={
                        isSelected
                          ? "#374151"
                          : isDisabled
                            ? "rgba(255, 255, 255, 0.3)"
                            : "#FFFFFF"
                      }
                      style={{ marginRight: 12 }}
                    />
                    <Text
                      className={`text-lg font-medium ${
                        isSelected
                          ? "text-gray-800"
                          : isDisabled
                            ? "text-white opacity-30"
                            : "text-white"
                      }`}
                    >
                      {urge.text}
                    </Text>
                  </View>
                  <View
                    className="w-6 h-6 rounded-full border-2 items-center justify-center"
                    style={{
                      borderColor: isSelected
                        ? "#10B981"
                        : isDisabled
                          ? "rgba(255, 255, 255, 0.2)"
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
          {/* Logo/Icon with bounce animation */}
          <Animated.View
            className="w-32 h-32 items-center justify-center mb-16 mt-8"
            style={{
              transform: [{ scale: scaleAnim }],
              paddingHorizontal: 8,
              paddingVertical: 8,
            }}
          >
            {step.icon === "logo" ? (
              <Image
                source={require("../assets/logo3.png")}
                style={{ width: 128, height: 128 }}
                resizeMode="contain"
              />
            ) : (
              <Ionicons name={step.iconName!} size={88} color="white" />
            )}
          </Animated.View>

          {/* Title */}
          <Animated.Text
            className="text-4xl font-bold text-white text-center mb-16"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {step.title}
          </Animated.Text>

          {/* Subtitle */}
          <Animated.Text
            className="text-3xl text-white text-center mb-16 font-medium opacity-90"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: Animated.add(slideAnim, 10) }],
            }}
          >
            {step.subtitle}
          </Animated.Text>

          {/* Description */}
          <Animated.Text
            className="text-2xl text-white text-center mb-8 leading-7 opacity-80"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: Animated.add(slideAnim, 20) }],
            }}
          >
            {step.description}
          </Animated.Text>
        </Animated.View>
      </ScrollView>
    );
  };

  const currentStepData = steps[currentStep];
  const isUrgeSelectionStep = currentStepData?.id === "urge-selection";
  const canProceed = isUrgeSelectionStep ? selectedUrges.length > 0 : true;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
      {/* Header with progress */}
      <View className="px-6 pt-4 pb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-lg opacity-75">
            {currentStep + 1} of {steps.length}
          </Text>
          <TouchableOpacity onPress={handleSkip}>
            <Text className="text-white text-lg opacity-75">Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View className="w-full bg-white bg-opacity-20 rounded-full h-2">
          <Animated.View
            className="bg-white h-2 rounded-full"
            style={{
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
                extrapolate: "clamp",
              }),
            }}
          />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">{renderStep(currentStepData)}</View>

      {/* Bottom Navigation */}
      <View className="px-6 py-4 border-t border-white border-opacity-20">
        <View className="flex-row space-x-3">
          {currentStep > 0 && (
            <TouchableOpacity
              className="flex-1 rounded-lg py-4 border border-white border-opacity-50"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
              onPress={handleBack}
            >
              <Text className="text-center text-white font-semibold text-xl">
                Back
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className={`flex-1 rounded-lg py-4 ${!canProceed ? "opacity-50" : ""}`}
            style={{
              backgroundColor: !canProceed
                ? "rgba(255, 255, 255, 0.3)"
                : "#FFFFFF",
            }}
            onPress={handleNext}
            disabled={!canProceed}
          >
            <Text
              className="text-center font-semibold text-xl"
              style={{
                color: !canProceed ? "rgba(255, 255, 255, 0.7)" : "#185e66",
              }}
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