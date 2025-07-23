import React, { useState } from "react";
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

const QuickLogScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [urge, setUrge] = useState("");
  const [location, setLocation] = useState("");
  const [trigger, setTrigger] = useState("");
  const [actedOn, setActedOn] = useState<boolean | null>(null);
  const [notes, setNotes] = useState("");

  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

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

  const commonUrges = [
    "Scroll Instagram",
    "Check phone",
    "Open fridge",
    "Text someone",
    "Watch TikTok",
  ];
  const commonLocations = ["Home", "Work", "Bedroom", "Kitchen", "Commuting"];
  const commonTriggers = [
    "Boredom",
    "Stress",
    "Loneliness",
    "Anxiety",
    "Notification",
  ];

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
            <Text className="text-4xl font-bold text-white text-center mb-4">
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
              Common urges:
            </Text>
            <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
              {commonUrges.map((commonUrge, index) => (
                <TouchableOpacity
                  key={index}
                  className="p-4 rounded-lg mb-3"
                  style={{
                    backgroundColor:
                      urge === commonUrge
                        ? "#FFFFFF"
                        : "rgba(255, 255, 255, 0.2)",
                  }}
                  onPress={() => setUrge(commonUrge)}
                >
                  <Text
                    className={`text-xl ${
                      urge === commonUrge ? "text-gray-800" : "text-white"
                    }`}
                  >
                    {commonUrge}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
              No judgment - just awareness
            </Text>

            <View className="space-y-6">
              <TouchableOpacity
                className="p-6 rounded-lg border-2"
                style={{
                  backgroundColor:
                    actedOn === true ? "#EF4444" : "rgba(255, 255, 255, 0.2)",
                  borderColor:
                    actedOn === true ? "#F87171" : "rgba(255, 255, 255, 0.3)",
                }}
                onPress={() => setActedOn(true)}
              >
                <Text className="text-2xl font-medium text-center text-white">
                  Yes, I acted on it
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="p-6 rounded-lg border-2"
                style={{
                  backgroundColor:
                    actedOn === false ? "#10B981" : "rgba(255, 255, 255, 0.2)",
                  borderColor:
                    actedOn === false ? "#34D399" : "rgba(255, 255, 255, 0.3)",
                }}
                onPress={() => setActedOn(false)}
              >
                <Text className="text-2xl font-medium text-center text-white">
                  No, I resisted
                </Text>
              </TouchableOpacity>
            </View>

            {actedOn === false && (
              <View
                className="mt-8 p-6 rounded-lg border"
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.3)",
                  borderColor: "rgba(52, 211, 153, 0.5)",
                }}
              >
                <Text className="text-white font-bold text-xl text-center">
                  🎉 Great job resisting!
                </Text>
                <Text className="text-white text-center mt-2 text-lg opacity-90">
                  You're building stronger self-awareness
                </Text>
              </View>
            )}
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
      <ScrollView className="flex-1 px-6 py-8">{renderStep()}</ScrollView>

      {/* Bottom buttons */}
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
            className="flex-1 bg-white rounded-lg py-4"
            onPress={currentStep === 4 ? handleSubmit : handleNext}
            disabled={
              (currentStep === 1 && !urge) ||
              (currentStep === 2 && !location) ||
              (currentStep === 3 && !trigger) ||
              (currentStep === 4 && actedOn === null)
            }
          >
            <Text
              className="text-center font-semibold text-xl"
              style={{ color: "#185e66" }}
            >
              {currentStep === 4 ? "Log Urge" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QuickLogScreen;
