// screens/QuickLogScreen.tsx

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
  Alert,
} from "react-native";
import {
  COMMON_URGES,
  COMMON_LOCATIONS,
  COMMON_TRIGGERS,
  COMMON_EMOTIONS,
} from "../types";
import { storageService } from "../services/StorageService";
import { useSettings } from "../hooks/useSettings";
import AddUrgeScreen from "./AddUrgeScreen";
import { Ionicons } from "@expo/vector-icons";

const QuickLogScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [urge, setUrge] = useState("");
  const [location, setLocation] = useState("");
  const [trigger, setTrigger] = useState("");
  const [emotion, setEmotion] = useState("");
  const [actedOn, setActedOn] = useState<boolean | null>(null);
  const [notes, setNotes] = useState("");
  const [filteredUrges, setFilteredUrges] = useState<string[]>([]);
  const [showAddUrgeScreen, setShowAddUrgeScreen] = useState(false);

  const { settings, updateSettings } = useSettings();
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  // Load user's selected urges when component mounts or settings change
  useEffect(() => {
    const loadFilteredUrges = () => {
      if (settings?.selectedUrges && settings.selectedUrges.length > 0) {
        // Only update if our local state is empty or if settings changed
        // Don't override if we already have the same urges (to preserve order)
        if (filteredUrges.length === 0) {
          setFilteredUrges(settings.selectedUrges);
        } else {
          // Check if the urges are the same (regardless of order) before updating
          const currentSet = new Set(filteredUrges);
          const settingsSet = new Set(settings.selectedUrges);
          const areSameUrges =
            currentSet.size === settingsSet.size &&
            [...currentSet].every((urge) => settingsSet.has(urge));

          // Only update if the actual urges changed, not just the order
          if (!areSameUrges) {
            setFilteredUrges(settings.selectedUrges);
          }
        }
      } else if (filteredUrges.length === 0) {
        // Fallback to all common urges if no selection (for existing users)
        setFilteredUrges(COMMON_URGES.map((u) => u.text));
      }
    };

    loadFilteredUrges();
  }, [settings?.selectedUrges]); // Only depend on selectedUrges, not all settings

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

  // Check if current step is valid to proceed
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!urge;
      case 2:
        return !!trigger;
      case 3:
        return !!location;
      case 4:
        return !!emotion;
      case 5:
        return actedOn !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 5 && isStepValid()) {
      animateTransition(() => setCurrentStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      animateTransition(() => setCurrentStep(currentStep - 1));
    }
  };

  const handleSubmit = () => {
    if (!isStepValid()) return;

    // Submit logic here
    console.log("Submitting urge log:", {
      urge,
      location,
      trigger,
      emotion,
      actedOn,
      notes,
    });

    // Update recent choices for next time
    updateRecentChoices();

    setCurrentStep(1);
    setUrge("");
    setLocation("");
    setTrigger("");
    setEmotion("");
    setActedOn(null);
    setNotes("");
  };

  // Function to move selected choices to the top of their respective lists
  const updateRecentChoices = async () => {
    try {
      const currentSettings = settings || {};

      // Update recent choices in settings
      const updatedSettings = {
        ...currentSettings,
        selectedUrges: moveToTop(urge, filteredUrges), // Move selected urge to top of user's urges
        recentTriggers: moveToTop(
          trigger,
          (currentSettings as any).recentTriggers ||
            COMMON_TRIGGERS.map((t) => t.text)
        ),
        recentLocations: moveToTop(
          location,
          (currentSettings as any).recentLocations ||
            COMMON_LOCATIONS.map((l) => l.text)
        ),
        recentEmotions: moveToTop(
          emotion,
          (currentSettings as any).recentEmotions ||
            COMMON_EMOTIONS.map((e) => e.text)
        ),
      };

      await updateSettings(updatedSettings);

      // Also update local state immediately for better UX
      setFilteredUrges(moveToTop(urge, filteredUrges));
    } catch (error) {
      console.error("Error updating recent choices:", error);
    }
  };

  // Helper function to move an item to the top of an array
  const moveToTop = (item: string, array: string[]): string[] => {
    if (!item) return array;

    // If the item is already at the top, don't change anything
    if (array.length > 0 && array[0] === item) {
      return array;
    }

    // Remove the item if it exists and add it to the front
    const filtered = array.filter((arrayItem) => arrayItem !== item);
    return [item, ...filtered];
  };

  const handleAddUrgePress = () => {
    setShowAddUrgeScreen(true);
  };

  const handleUrgeSelected = async (selectedUrge: string) => {
    // Immediately update local state for instant UI response
    const updatedUrges = [...filteredUrges, selectedUrge];
    setFilteredUrges(updatedUrges);
    setUrge(selectedUrge);
    setShowAddUrgeScreen(false);

    // Save to settings in the background
    try {
      await updateSettings({ selectedUrges: updatedUrges });
    } catch (error) {
      console.error("Error saving new urge:", error);
      // Optionally revert on error, but keep UI updated for now
    }
  };

  const handleAddUrgeBack = () => {
    setShowAddUrgeScreen(false);
  };

  // If showing add urge screen, render it instead
  if (showAddUrgeScreen) {
    return (
      <AddUrgeScreen
        onUrgeSelected={handleUrgeSelected}
        onBack={handleAddUrgeBack}
        currentSelectedUrges={filteredUrges}
      />
    );
  }

  const commonLocations =
    (settings as any)?.recentLocations || COMMON_LOCATIONS.map((l) => l.text);
  const commonTriggers =
    (settings as any)?.recentTriggers || COMMON_TRIGGERS.map((t) => t.text);
  const commonEmotions =
    (settings as any)?.recentEmotions || COMMON_EMOTIONS.map((e) => e.text);

  // Helper functions to get icons for items
  const getIconForTrigger = (triggerText: string) => {
    const triggerObj = COMMON_TRIGGERS.find((t) => t.text === triggerText);
    return triggerObj?.icon || "help-circle-outline";
  };

  const getIconForLocation = (locationText: string) => {
    const locationObj = COMMON_LOCATIONS.find((l) => l.text === locationText);
    return locationObj?.icon || "location-outline";
  };

  const getIconForEmotion = (emotionText: string) => {
    const emotionObj = COMMON_EMOTIONS.find((e) => e.text === emotionText);
    return emotionObj?.icon || "happy-outline";
  };

  const getIconForUrge = (urgeText: string) => {
    const urgeObj = COMMON_URGES.find((u) => u.text === urgeText);
    return urgeObj?.icon || "help-circle-outline";
  };

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
                {filteredUrges.map((filteredUrge: string, index: number) => (
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
                    <View className="flex-row items-center">
                      <Ionicons
                        name={getIconForUrge(filteredUrge)}
                        size={24}
                        color={urge === filteredUrge ? "#374151" : "#FFFFFF"}
                        style={{ marginRight: 12 }}
                      />
                      <Text
                        className={`text-xl ${
                          urge === filteredUrge ? "text-gray-800" : "text-white"
                        }`}
                      >
                        {filteredUrge}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}

                {/* Add option to use other urges */}
                <TouchableOpacity
                  className="p-3 rounded-lg mb-3 border border-white border-opacity-30"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  onPress={handleAddUrgePress}
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
            <Text className="text-4xl font-bold text-white text-center mb-4 mt-8">
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
              {commonTriggers.map((commonTrigger: string, index: number) => (
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
                  <View className="flex-row items-center">
                    <Ionicons
                      name={getIconForTrigger(commonTrigger)}
                      size={24}
                      color={trigger === commonTrigger ? "#374151" : "#FFFFFF"}
                      style={{ marginRight: 12 }}
                    />
                    <Text
                      className={`text-xl ${
                        trigger === commonTrigger
                          ? "text-gray-800"
                          : "text-white"
                      }`}
                    >
                      {commonTrigger}
                    </Text>
                  </View>
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
            <Text className="text-4xl font-bold text-white text-center mb-4 mt-8">
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
              {commonLocations.map((commonLocation: string, index: number) => (
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
                  <View className="flex-row items-center">
                    <Ionicons
                      name={getIconForLocation(commonLocation)}
                      size={24}
                      color={
                        location === commonLocation ? "#374151" : "#FFFFFF"
                      }
                      style={{ marginRight: 12 }}
                    />
                    <Text
                      className={`text-xl ${
                        location === commonLocation
                          ? "text-gray-800"
                          : "text-white"
                      }`}
                    >
                      {commonLocation}
                    </Text>
                  </View>
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
            <Text className="text-4xl font-bold text-white text-center mb-4 mt-8">
              How were you feeling?
            </Text>
            <Text className="text-xl text-white text-center mb-8 opacity-90">
              Emotions often drive our urges
            </Text>

            <TextInput
              className="border border-white border-opacity-30 rounded-lg p-4 text-xl mb-6 text-white"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              placeholder="Describe your emotional state..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={emotion}
              onChangeText={setEmotion}
            />

            <Text className="text-white font-medium mb-4 text-lg opacity-90">
              Common emotions:
            </Text>
            <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
              {commonEmotions.map((commonEmotion: string, index: number) => (
                <TouchableOpacity
                  key={index}
                  className="p-4 rounded-lg mb-3"
                  style={{
                    backgroundColor:
                      emotion === commonEmotion
                        ? "#FFFFFF"
                        : "rgba(255, 255, 255, 0.2)",
                  }}
                  onPress={() => setEmotion(commonEmotion)}
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name={getIconForEmotion(commonEmotion)}
                      size={24}
                      color={emotion === commonEmotion ? "#374151" : "#FFFFFF"}
                      style={{ marginRight: 12 }}
                    />
                    <Text
                      className={`text-xl ${
                        emotion === commonEmotion
                          ? "text-gray-800"
                          : "text-white"
                      }`}
                    >
                      {commonEmotion}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        );

      case 5:
        return (
          <Animated.View
            className="flex-1"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text className="text-4xl font-bold text-white text-center mb-4 mt-8">
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
                    actedOn === true ? "#FFFFFF" : "rgba(255, 255, 255, 0.2)",
                  borderColor:
                    actedOn === true ? "#FFFFFF" : "rgba(255, 255, 255, 0.3)",
                }}
                onPress={() => setActedOn(true)}
              >
                <Text
                  className={`text-center text-2xl font-semibold ${
                    actedOn === true ? "text-gray-800" : "text-white"
                  }`}
                >
                  ✅ I acted on it
                </Text>
                <Text
                  className={`text-center mt-2 ${
                    actedOn === true ? "text-gray-600" : "text-white opacity-75"
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
            {currentStep} of 5
          </Text>
        </View>

        {/* Progress bar */}
        <View className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-4">
          <View
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
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
              !isStepValid() ? "opacity-50" : ""
            }`}
            style={{
              backgroundColor: !isStepValid()
                ? "rgba(255, 255, 255, 0.3)"
                : "#FFFFFF",
            }}
            onPress={currentStep === 5 ? handleSubmit : handleNext}
            disabled={!isStepValid()}
          >
            <Text
              className="text-center font-semibold text-xl"
              style={{
                color: !isStepValid() ? "rgba(255, 255, 255, 0.7)" : "#185e66",
              }}
            >
              {currentStep === 5 ? "Save Log" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QuickLogScreen;
