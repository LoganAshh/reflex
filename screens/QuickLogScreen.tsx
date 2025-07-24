// screens/QuickLogScreen.tsx - Complete updated version with filtered urges

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";
import { COMMON_URGES, COMMON_LOCATIONS, COMMON_TRIGGERS } from "../types";
import { storageService } from "../services/StorageService";
import { useSettings } from "../hooks/useSettings";

const QuickLogScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [urge, setUrge] = useState("");
  const [location, setLocation] = useState("");
  const [trigger, setTrigger] = useState("");
  const [actedOn, setActedOn] = useState<boolean | null>(null);
  const [notes, setNotes] = useState("");
  const [filteredUrges, setFilteredUrges] = useState<string[]>([]);

  const { settings } = useSettings();
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  // Load user's selected urges when component mounts or settings change
  useEffect(() => {
    const loadFilteredUrges = () => {
      if (settings?.selectedUrges && settings.selectedUrges.length > 0) {
        // Show only the urges the user selected during onboarding
        setFilteredUrges(settings.selectedUrges);
      } else {
        // Fallback to all common urges if no selection (for existing users)
        setFilteredUrges([...COMMON_URGES]);
      }
    };

    loadFilteredUrges();
  }, [settings]);

  const animateTransition = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      animateTransition(() => setCurrentStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      animateTransition(() => setCurrentStep(currentStep - 1));
    }
  };

  const handleSubmit = () => {
    // Submit logic here
    console.log("Submitting urge log:", {
      urge,
      location,
      trigger,
      actedOn,
      notes,
    });
    setCurrentStep(1);
    setUrge("");
    setLocation("");
    setTrigger("");
    setActedOn(null);
    setNotes("");
  };

  const commonLocations = [...COMMON_LOCATIONS];
  const commonTriggers = [...COMMON_TRIGGERS];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Animated.View
            className="flex-1"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text className="text-4xl font-bold text-white text-center mb-4 mt-8">
              What's the urge?
            </Text>
            <Text className="text-xl text-white text-center mb-8 opacity-90">
              Name it to tame it
            </Text>

            <TextInput
              className="border border-white border-opacity-30 rounded-lg p-4 text-xl mb-6 text-white"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              placeholder="Describe your urge..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={urge}
              onChangeText={setUrge}
            />

            <Text className="text-white font-medium mb-4 text-lg opacity-90">
              Your urges:
            </Text>

            {filteredUrges.length > 0 ? (
              <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
                {filteredUrges.map((filteredUrge, index) => (
                  <TouchableOpacity
                    key={index}
                    className="p-4 rounded-lg mb-3"
                    style={{
                      backgroundColor:
                        urge === filteredUrge
                          ? "#FFFFFF"
                          : "rgba(255, 255, 255, 0.2)",
                    }}
                    onPress={() => setUrge(filteredUrge)}
                  >
                    <Text
                      className={`text-xl ${
                        urge === filteredUrge ? "text-gray-800" : "text-white"
                      }`}
                    >
                      {filteredUrge}
                    </Text>
                  </TouchableOpacity>
                ))}

                {/* Add option to use other urges */}
                <TouchableOpacity
                  className="p-3 rounded-lg mb-3 border border-white border-opacity-30"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  onPress={() => {
                    // Allow custom input by clearing the selection
                    setUrge("");
                  }}
                >
                  <Text className="text-white text-center opacity-75">
                    + Add a different urge
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            ) : (
              <View className="mb-4 p-6 bg-white bg-opacity-10 rounded-lg">
                <Text className="text-white text-center opacity-75">
                  No urges selected yet. Go to Settings to choose which urges
                  you want to track.
                </Text>
              </View>
            )}
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View
            className="flex-1"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text className="text-4xl font-bold text-white text-center mb-4">
              Where are you?
            </Text>
            <Text className="text-xl text-white text-center mb-8 opacity-90">
              Location patterns matter
            </Text>

            <TextInput
              className="border border-white border-opacity-30 rounded-lg p-4 text-xl mb-6 text-white"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              placeholder="Where did this happen?"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={location}
              onChangeText={setLocation}
            />

            <Text className="text-white font-medium mb-4 text-lg opacity-90">
              Common locations:
            </Text>
            <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
              {commonLocations.map((commonLocation, index) => (
                <TouchableOpacity
                  key={index}
                  className="p-4 rounded-lg mb-3"
                  style={{
                    backgroundColor:
                      location === commonLocation
                        ? "#FFFFFF"
                        : "rgba(255, 255, 255, 0.2)",
                  }}
                  onPress={() => setLocation(commonLocation)}
                >
                  <Text
                    className={`text-xl ${
                      location === commonLocation
                        ? "text-gray-800"
                        : "text-white"
                    }`}
                  >
                    {commonLocation}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View
            className="flex-1"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text className="text-4xl font-bold text-white text-center mb-4">
              What triggered it?
            </Text>
            <Text className="text-xl text-white text-center mb-8 opacity-90">
              Understanding triggers builds awareness
            </Text>

            <TextInput
              className="border border-white border-opacity-30 rounded-lg p-4 text-xl mb-6 text-white"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              placeholder="What sparked this urge?"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={trigger}
              onChangeText={setTrigger}
            />

            <Text className="text-white font-medium mb-4 text-lg opacity-90">
              Common triggers:
            </Text>
            <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
              {commonTriggers.map((commonTrigger, index) => (
                <TouchableOpacity
                  key={index}
                  className="p-4 rounded-lg mb-3"
                  style={{
                    backgroundColor:
                      trigger === commonTrigger
                        ? "#FFFFFF"
                        : "rgba(255, 255, 255, 0.2)",
                  }}
                  onPress={() => setTrigger(commonTrigger)}
                >
                  <Text
                    className={`text-xl ${
                      trigger === commonTrigger ? "text-gray-800" : "text-white"
                    }`}
                  >
                    {commonTrigger}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        );

      case 4:
        return (
          <Animated.View
            className="flex-1"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text className="text-4xl font-bold text-white text-center mb-4">
              Did you act on it?
            </Text>
            <Text className="text-xl text-white text-center mb-8 opacity-90">
              Honest tracking builds awareness
            </Text>

            <View className="space-y-4 mb-8">
              <TouchableOpacity
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor:
                    actedOn === false ? "#10B981" : "rgba(255, 255, 255, 0.2)",
                  borderColor:
                    actedOn === false ? "#10B981" : "rgba(255, 255, 255, 0.3)",
                }}
                onPress={() => setActedOn(false)}
              >
                <Text
                  className={`text-center text-2xl font-semibold ${
                    actedOn === false ? "text-white" : "text-white"
                  }`}
                >
                  🛡️ I resisted it
                </Text>
                <Text
                  className={`text-center mt-2 ${
                    actedOn === false ? "text-white" : "text-white opacity-75"
                  }`}
                >
                  Great job building awareness!
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor:
                    actedOn === true ? "#EF4444" : "rgba(255, 255, 255, 0.2)",
                  borderColor:
                    actedOn === true ? "#EF4444" : "rgba(255, 255, 255, 0.3)",
                }}
                onPress={() => setActedOn(true)}
              >
                <Text
                  className={`text-center text-2xl font-semibold ${
                    actedOn === true ? "text-white" : "text-white"
                  }`}
                >
                  ✅ I acted on it
                </Text>
                <Text
                  className={`text-center mt-2 ${
                    actedOn === true ? "text-white" : "text-white opacity-75"
                  }`}
                >
                  That's okay - awareness is progress
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              className="border border-white border-opacity-30 rounded-lg p-4 text-xl mb-6 text-white"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              placeholder="Any notes? (optional)"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-semibold text-white">Quick Log</Text>
          <Text className="text-white text-lg opacity-75">
            {currentStep} of 4
          </Text>
        </View>

        {/* Progress bar */}
        <View className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-4">
          <View
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6">{renderStep()}</View>

      {/* Bottom Navigation */}
      <View className="px-6 py-4 border-t border-white border-opacity-20">
        <View className="flex-row space-x-3">
          {currentStep > 1 && (
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
            className={`flex-1 rounded-lg py-4 ${
              (currentStep === 1 && !urge) ||
              (currentStep === 2 && !location) ||
              (currentStep === 3 && !trigger) ||
              (currentStep === 4 && actedOn === null)
                ? "bg-gray-400 opacity-50"
                : "bg-white"
            }`}
            onPress={currentStep === 4 ? handleSubmit : handleNext}
            disabled={
              (currentStep === 1 && !urge) ||
              (currentStep === 2 && !location) ||
              (currentStep === 3 && !trigger) ||
              (currentStep === 4 && actedOn === null)
            }
          >
            <Text
              className={`text-center font-semibold text-xl ${
                (currentStep === 1 && !urge) ||
                (currentStep === 2 && !location) ||
                (currentStep === 3 && !trigger) ||
                (currentStep === 4 && actedOn === null)
                  ? "text-gray-600"
                  : ""
              }`}
              style={{
                color:
                  (currentStep === 1 && !urge) ||
                  (currentStep === 2 && !location) ||
                  (currentStep === 3 && !trigger) ||
                  (currentStep === 4 && actedOn === null)
                    ? "#9CA3AF"
                    : "#185e66",
              }}
            >
              {currentStep === 4 ? "Save Log" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QuickLogScreen;
