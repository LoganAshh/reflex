import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { TextInput } from "react-native";

interface UrgeLog {
  id: string;
  urge: string;
  location: string;
  trigger: string;
  actedOn: boolean;
  timestamp: Date;
}

const QuickLogScreen: React.FC = () => {
  const [urge, setUrge] = useState("");
  const [location, setLocation] = useState("");
  const [trigger, setTrigger] = useState("");
  const [actedOn, setActedOn] = useState<boolean | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Common urges for quick selection
  const commonUrges = [
    "Scroll Instagram",
    "Check phone",
    "Open fridge",
    "Text someone",
    "Watch porn",
    "Vape/smoke",
    "Online shopping",
    "Eat snacks",
  ];

  // Common locations
  const commonLocations = [
    "Home",
    "Work",
    "Gym",
    "Commuting",
    "Bedroom",
    "Kitchen",
    "Bathroom",
  ];

  // Common triggers
  const commonTriggers = [
    "Boredom",
    "Loneliness",
    "Stress",
    "Notification",
    "Advertisement",
    "Anxiety",
    "Habit",
    "Procrastination",
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!urge || actedOn === null) {
      Alert.alert("Missing Information", "Please complete all required fields");
      return;
    }

    // Here you would save to your storage/database
    const logEntry: UrgeLog = {
      id: Date.now().toString(),
      urge,
      location,
      trigger,
      actedOn,
      timestamp: new Date(),
    };

    console.log("Logging urge:", logEntry);
    Alert.alert("Logged!", "Your urge has been recorded", [
      {
        text: "OK",
        onPress: () => {
          // Reset form
          setUrge("");
          setLocation("");
          setTrigger("");
          setActedOn(null);
          setCurrentStep(1);
        },
      },
    ]);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              What did you feel the urge to do?
            </Text>
            <Text className="text-gray-600 mb-6">
              Be specific about the impulse you noticed
            </Text>

            <TextInput
              className="border border-gray-300 rounded-lg p-4 text-lg mb-4"
              placeholder="Type your urge..."
              value={urge}
              onChangeText={setUrge}
              multiline
              numberOfLines={2}
            />

            <Text className="text-gray-700 font-medium mb-3">
              Common urges:
            </Text>
            <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
              {commonUrges.map((commonUrge, index) => (
                <TouchableOpacity
                  key={index}
                  className={`p-3 rounded-lg mb-2 ${
                    urge === commonUrge ? "bg-blue-500" : "bg-gray-100"
                  }`}
                  onPress={() => setUrge(commonUrge)}
                >
                  <Text
                    className={`${
                      urge === commonUrge ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {commonUrge}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      case 2:
        return (
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              Where were you?
            </Text>
            <Text className="text-gray-600 mb-6">
              Location context can reveal patterns
            </Text>

            <TextInput
              className="border border-gray-300 rounded-lg p-4 text-lg mb-4"
              placeholder="Enter location..."
              value={location}
              onChangeText={setLocation}
            />

            <Text className="text-gray-700 font-medium mb-3">
              Common locations:
            </Text>
            <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
              {commonLocations.map((commonLocation, index) => (
                <TouchableOpacity
                  key={index}
                  className={`p-3 rounded-lg mb-2 ${
                    location === commonLocation ? "bg-blue-500" : "bg-gray-100"
                  }`}
                  onPress={() => setLocation(commonLocation)}
                >
                  <Text
                    className={`${
                      location === commonLocation
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    {commonLocation}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      case 3:
        return (
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              What triggered it?
            </Text>
            <Text className="text-gray-600 mb-6">
              Understanding triggers helps build awareness
            </Text>

            <TextInput
              className="border border-gray-300 rounded-lg p-4 text-lg mb-4"
              placeholder="What sparked this urge?"
              value={trigger}
              onChangeText={setTrigger}
            />

            <Text className="text-gray-700 font-medium mb-3">
              Common triggers:
            </Text>
            <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
              {commonTriggers.map((commonTrigger, index) => (
                <TouchableOpacity
                  key={index}
                  className={`p-3 rounded-lg mb-2 ${
                    trigger === commonTrigger ? "bg-blue-500" : "bg-gray-100"
                  }`}
                  onPress={() => setTrigger(commonTrigger)}
                >
                  <Text
                    className={`${
                      trigger === commonTrigger ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {commonTrigger}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      case 4:
        return (
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              Did you act on it?
            </Text>
            <Text className="text-gray-600 mb-6">
              No judgment - just awareness
            </Text>

            <View className="space-y-4">
              <TouchableOpacity
                className={`p-6 rounded-lg border-2 ${
                  actedOn === true
                    ? "bg-red-50 border-red-500"
                    : "bg-gray-50 border-gray-300"
                }`}
                onPress={() => setActedOn(true)}
              >
                <Text
                  className={`text-xl font-medium ${
                    actedOn === true ? "text-red-700" : "text-gray-700"
                  }`}
                >
                  Yes, I acted on it
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`p-6 rounded-lg border-2 ${
                  actedOn === false
                    ? "bg-green-50 border-green-500"
                    : "bg-gray-50 border-gray-300"
                }`}
                onPress={() => setActedOn(false)}
              >
                <Text
                  className={`text-xl font-medium ${
                    actedOn === false ? "text-green-700" : "text-gray-700"
                  }`}
                >
                  No, I resisted
                </Text>
              </TouchableOpacity>
            </View>

            {actedOn === false && (
              <View className="mt-6 p-4 bg-green-50 rounded-lg">
                <Text className="text-green-800 font-medium">
                  🎉 Great job resisting!
                </Text>
                <Text className="text-green-700 mt-1">
                  You're building stronger self-awareness
                </Text>
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-800">Quick Log</Text>
          <Text className="text-gray-500">{currentStep} of 4</Text>
        </View>

        {/* Progress bar */}
        <View className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <View
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6 py-6">{renderStep()}</ScrollView>

      {/* Bottom buttons */}
      <View className="px-6 py-4 bg-white border-t border-gray-200">
        <View className="flex-row space-x-3">
          {currentStep > 1 && (
            <TouchableOpacity
              className="flex-1 bg-gray-100 rounded-lg py-4"
              onPress={handleBack}
            >
              <Text className="text-center text-gray-700 font-medium">
                Back
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="flex-1 bg-blue-500 rounded-lg py-4"
            onPress={currentStep === 4 ? handleSubmit : handleNext}
            disabled={
              (currentStep === 1 && !urge) ||
              (currentStep === 4 && actedOn === null)
            }
          >
            <Text className="text-center text-white font-medium">
              {currentStep === 4 ? "Log Urge" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default QuickLogScreen;
