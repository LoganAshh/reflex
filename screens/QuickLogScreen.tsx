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
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "#ffffff",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              What's the urge?
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: "rgba(255, 255, 255, 0.9)",
                textAlign: "center",
                marginBottom: 32,
              }}
            >
              Name it to tame it
            </Text>

            <TextInput
              className="border border-white border-opacity-30 rounded-lg p-4 mb-6"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                fontSize: 20,
                color: "#ffffff",
              }}
              placeholder="Describe your urge..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={urge}
              onChangeText={setUrge}
            />

            <Text
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: "500",
                marginBottom: 16,
                fontSize: 18,
              }}
            >
              Common urges:
            </Text>
            <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
              {commonUrges.map((commonUrge, index) => (
                <TouchableOpacity
                  key={index}
                  className={`p-4 rounded-lg mb-3 ${
                    urge === commonUrge ? "bg-white" : "bg-white bg-opacity-20"
                  }`}
                  onPress={() => setUrge(commonUrge)}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      color: urge === commonUrge ? "#1f2937" : "#ffffff",
                    }}
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
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "#ffffff",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              Where are you?
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: "rgba(255, 255, 255, 0.9)",
                textAlign: "center",
                marginBottom: 32,
              }}
            >
              Location patterns matter
            </Text>

            <TextInput
              className="border border-white border-opacity-30 rounded-lg p-4 mb-6"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                fontSize: 20,
                color: "#ffffff",
              }}
              placeholder="Where did this happen?"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={location}
              onChangeText={setLocation}
            />

            <Text
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: "500",
                marginBottom: 16,
                fontSize: 18,
              }}
            >
              Common locations:
            </Text>
            <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
              {commonLocations.map((commonLocation, index) => (
                <TouchableOpacity
                  key={index}
                  className={`p-4 rounded-lg mb-3 ${
                    location === commonLocation
                      ? "bg-white"
                      : "bg-white bg-opacity-20"
                  }`}
                  onPress={() => setLocation(commonLocation)}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      color:
                        location === commonLocation ? "#1f2937" : "#ffffff",
                    }}
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
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "#ffffff",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              What triggered it?
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: "rgba(255, 255, 255, 0.9)",
                textAlign: "center",
                marginBottom: 32,
              }}
            >
              Understanding triggers builds awareness
            </Text>

            <TextInput
              className="border border-white border-opacity-30 rounded-lg p-4 mb-6"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                fontSize: 20,
                color: "#ffffff",
              }}
              placeholder="What sparked this urge?"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={trigger}
              onChangeText={setTrigger}
            />

            <Text
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: "500",
                marginBottom: 16,
                fontSize: 18,
              }}
            >
              Common triggers:
            </Text>
            <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
              {commonTriggers.map((commonTrigger, index) => (
                <TouchableOpacity
                  key={index}
                  className={`p-4 rounded-lg mb-3 ${
                    trigger === commonTrigger
                      ? "bg-white"
                      : "bg-white bg-opacity-20"
                  }`}
                  onPress={() => setTrigger(commonTrigger)}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      color: trigger === commonTrigger ? "#1f2937" : "#ffffff",
                    }}
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
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "#ffffff",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              Did you act on it?
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: "rgba(255, 255, 255, 0.9)",
                textAlign: "center",
                marginBottom: 32,
              }}
            >
              No judgment - just awareness
            </Text>

            <View className="space-y-6">
              <TouchableOpacity
                className={`p-6 rounded-lg border-2 ${
                  actedOn === true
                    ? "bg-red-500 border-red-400"
                    : "bg-white bg-opacity-20 border-white border-opacity-30"
                }`}
                onPress={() => setActedOn(true)}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "500",
                    textAlign: "center",
                    color: "#ffffff",
                  }}
                >
                  Yes, I acted on it
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`p-6 rounded-lg border-2 ${
                  actedOn === false
                    ? "bg-green-500 border-green-400"
                    : "bg-white bg-opacity-20 border-white border-opacity-30"
                }`}
                onPress={() => setActedOn(false)}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "500",
                    textAlign: "center",
                    color: "#ffffff",
                  }}
                >
                  No, I resisted
                </Text>
              </TouchableOpacity>
            </View>

            {actedOn === false && (
              <View className="mt-8 p-6 bg-green-500 bg-opacity-30 rounded-lg border border-green-400 border-opacity-50">
                <Text
                  style={{
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: 20,
                    textAlign: "center",
                  }}
                >
                  🎉 Great job resisting!
                </Text>
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    textAlign: "center",
                    marginTop: 8,
                    fontSize: 18,
                  }}
                >
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
          <Text style={{ fontSize: 24, fontWeight: "600", color: "#ffffff" }}>
            Quick Log
          </Text>
          <Text style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: 18 }}>
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
              <Text
                style={{
                  textAlign: "center",
                  color: "#ffffff",
                  fontWeight: "600",
                  fontSize: 20,
                }}
              >
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
              style={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: 20,
                color: "#185e66",
              }}
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
