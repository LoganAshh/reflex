// components/QuickLogSteps.tsx

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
} from "react-native";
import {
  COMMON_URGES,
  COMMON_LOCATIONS,
  COMMON_TRIGGERS,
  COMMON_EMOTIONS,
} from "../types";
import { Ionicons } from "@expo/vector-icons";

interface QuickLogStepsProps {
  currentStep: number;
  urge: string;
  setUrge: (urge: string) => void;
  trigger: string;
  setTrigger: (trigger: string) => void;
  location: string;
  setLocation: (location: string) => void;
  emotion: string;
  setEmotion: (emotion: string) => void;
  actedOn: boolean | null;
  setActedOn: (actedOn: boolean | null) => void;
  replacementAction: string;
  setReplacementAction: (action: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  filteredUrges: string[];
  customUrgeIcons: { [key: string]: string };
  customTriggerIcons: { [key: string]: string };
  customLocationIcons: { [key: string]: string };
  customEmotionIcons: { [key: string]: string };
  settings: any;
  replacementActions: any[];
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  handleAddUrgePress: (preFilledText?: string) => void;
  handleAddTriggerPress: (preFilledText?: string) => void;
  handleAddLocationPress: (preFilledText?: string) => void;
  handleAddEmotionPress: (preFilledText?: string) => void;
}

const QuickLogSteps: React.FC<QuickLogStepsProps> = ({
  currentStep,
  urge,
  setUrge,
  trigger,
  setTrigger,
  location,
  setLocation,
  emotion,
  setEmotion,
  actedOn,
  setActedOn,
  replacementAction,
  setReplacementAction,
  notes,
  setNotes,
  filteredUrges,
  customUrgeIcons,
  customTriggerIcons,
  customLocationIcons,
  customEmotionIcons,
  settings,
  replacementActions,
  fadeAnim,
  slideAnim,
  handleAddUrgePress,
  handleAddTriggerPress,
  handleAddLocationPress,
  handleAddEmotionPress,
}) => {
  // Helper functions to get icons for items
  const getIconForTrigger = (triggerText: string) => {
    if (customTriggerIcons[triggerText]) {
      return customTriggerIcons[triggerText];
    }
    const triggerObj = COMMON_TRIGGERS.find((t) => t.text === triggerText);
    return triggerObj?.icon || "help-circle-outline";
  };

  const getIconForLocation = (locationText: string) => {
    if (customLocationIcons[locationText]) {
      return customLocationIcons[locationText];
    }
    const locationObj = COMMON_LOCATIONS.find((l) => l.text === locationText);
    return locationObj?.icon || "location-outline";
  };

  const getIconForEmotion = (emotionText: string) => {
    if (customEmotionIcons[emotionText]) {
      return customEmotionIcons[emotionText];
    }
    const emotionObj = COMMON_EMOTIONS.find((e) => e.text === emotionText);
    return emotionObj?.icon || "happy-outline";
  };

  const getIconForUrge = (urgeText: string) => {
    if (customUrgeIcons[urgeText]) {
      return customUrgeIcons[urgeText];
    }
    const urgeObj = COMMON_URGES.find((u) => u.text === urgeText);
    return urgeObj?.icon || "help-circle-outline";
  };

  // Helper functions to filter items based on search text
  const getFilteredUrgesForSearch = (searchText: string) => {
    if (!searchText.trim()) {
      return filteredUrges;
    }
    const searchLower = searchText.toLowerCase();
    return filteredUrges.filter(urge => 
      urge.toLowerCase().includes(searchLower)
    );
  };

  const getFilteredTriggersForSearch = (searchText: string) => {
    const commonTriggers = (settings as any)?.recentTriggers || COMMON_TRIGGERS.map((t) => t.text);
    if (!searchText.trim()) {
      return commonTriggers;
    }
    const searchLower = searchText.toLowerCase();
    const filtered = commonTriggers.filter((trigger: string) => 
      trigger.toLowerCase().includes(searchLower)
    );
    const exactMatch = commonTriggers.find((trigger: string) => 
      trigger.toLowerCase() === searchLower
    );
    return exactMatch ? commonTriggers : filtered;
  };

  const getFilteredLocationsForSearch = (searchText: string) => {
    const commonLocations = (settings as any)?.recentLocations || COMMON_LOCATIONS.map((l) => l.text);
    if (!searchText.trim()) {
      return commonLocations;
    }
    const searchLower = searchText.toLowerCase();
    const filtered = commonLocations.filter((location: string) => 
      location.toLowerCase().includes(searchLower)
    );
    const exactMatch = commonLocations.find((location: string) => 
      location.toLowerCase() === searchLower
    );
    return exactMatch ? commonLocations : filtered;
  };

  const getFilteredEmotionsForSearch = (searchText: string) => {
    const commonEmotions = (settings as any)?.recentEmotions || COMMON_EMOTIONS.map((e) => e.text);
    if (!searchText.trim()) {
      return commonEmotions;
    }
    const searchLower = searchText.toLowerCase();
    const filtered = commonEmotions.filter((emotion: string) => 
      emotion.toLowerCase().includes(searchLower)
    );
    const exactMatch = commonEmotions.find((emotion: string) => 
      emotion.toLowerCase() === searchLower
    );
    return exactMatch ? commonEmotions : filtered;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        const isExistingUrge = filteredUrges.includes(urge);
        const searchFilteredUrges = getFilteredUrgesForSearch(isExistingUrge ? "" : urge);
        
        return (
          <Animated.View
            className="flex-1"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text className="text-4xl font-bold text-white text-center mb-8 mt-8">
              What's the urge?
            </Text>

            <TextInput
              className="border border-white border-opacity-30 rounded-lg p-4 text-xl mb-6 text-white"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              placeholder="Describe your urge..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={urge}
              onChangeText={setUrge}
              returnKeyType="done"
            />

            <Text className="text-white font-medium mb-4 text-lg opacity-90">
              {urge.trim() && !isExistingUrge && searchFilteredUrges.length !== filteredUrges.length
                ? `Matching urges (${searchFilteredUrges.length}):` 
                : "Your urges:"}
            </Text>

            {searchFilteredUrges.length > 0 ? (
              <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
                {searchFilteredUrges.map((filteredUrge: string, index: number) => (
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
                        name={getIconForUrge(filteredUrge) as any}
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

                <TouchableOpacity
                  className="p-3 rounded-lg mb-3 border border-white border-opacity-30"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  onPress={() => handleAddUrgePress()}
                >
                  <Text className="text-white text-center opacity-75">
                    + Add a different urge
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            ) : urge.trim() && !isExistingUrge ? (
              <View className="mb-4">
                <View className="p-6 bg-white bg-opacity-10 rounded-lg mb-3">
                  <Text className="text-black text-center opacity-75">
                    No matching urges found for "{urge}"
                  </Text>
                </View>
                
                <TouchableOpacity
                  className="p-4 rounded-lg mb-3 border border-white border-opacity-30"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  onPress={() => handleAddUrgePress(urge.trim())}
                >
                  <Text className="text-white text-center">
                    + Create "{urge}" as a custom urge
                  </Text>
                </TouchableOpacity>
              </View>
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
        const searchFilteredTriggers = getFilteredTriggersForSearch(trigger);
        const commonTriggers = (settings as any)?.recentTriggers || COMMON_TRIGGERS.map((t) => t.text);
        
        return (
          <Animated.View
            className="flex-1"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text className="text-4xl font-bold text-white text-center mb-8 mt-8">
              What triggered it?
            </Text>

            <TextInput
              className="border border-white border-opacity-30 rounded-lg p-4 text-xl mb-6 text-white"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              placeholder="What sparked this urge?"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={trigger}
              onChangeText={setTrigger}
              returnKeyType="done"
            />

            <Text className="text-white font-medium mb-4 text-lg opacity-90">
              {trigger.trim() && searchFilteredTriggers.length !== commonTriggers.length && !commonTriggers.find((t: string) => t.toLowerCase() === trigger.toLowerCase())
                ? `Matching triggers (${searchFilteredTriggers.length}):` 
                : "Common triggers:"}
            </Text>
            <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
              {searchFilteredTriggers.map((commonTrigger: string, index: number) => (
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
                      name={getIconForTrigger(commonTrigger) as any}
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

              <TouchableOpacity
                className="p-3 rounded-lg mb-3 border border-white border-opacity-30"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                onPress={() => handleAddTriggerPress()}
              >
                <Text className="text-white text-center opacity-75">
                  + Add a different trigger
                </Text>
              </TouchableOpacity>
              
              {searchFilteredTriggers.length === 0 && trigger.trim() && (
                <View className="mb-4">
                  <View className="p-6 bg-white bg-opacity-10 rounded-lg mb-3">
                    <Text className="text-black text-center opacity-75">
                      No matching triggers found for "{trigger}"
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    className="p-4 rounded-lg mb-3 border border-white border-opacity-30"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    onPress={() => handleAddTriggerPress(trigger.trim())}
                  >
                    <Text className="text-white text-center">
                      + Create "{trigger}" as a custom trigger
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        );

      case 3:
        const searchFilteredLocations = getFilteredLocationsForSearch(location);
        const commonLocations = (settings as any)?.recentLocations || COMMON_LOCATIONS.map((l) => l.text);
        
        return (
          <Animated.View
            className="flex-1"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text className="text-4xl font-bold text-white text-center mb-8 mt-8">
              Where are you?
            </Text>

            <TextInput
              className="border border-white border-opacity-30 rounded-lg p-4 text-xl mb-6 text-white"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              placeholder="Where did this happen?"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={location}
              onChangeText={setLocation}
              returnKeyType="done"
            />

            <Text className="text-white font-medium mb-4 text-lg opacity-90">
              {location.trim() && searchFilteredLocations.length !== commonLocations.length && !commonLocations.find((l: string) => l.toLowerCase() === location.toLowerCase())
                ? `Matching locations (${searchFilteredLocations.length}):` 
                : "Common locations:"}
            </Text>
            <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
              {searchFilteredLocations.map((commonLocation: string, index: number) => (
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
                      name={getIconForLocation(commonLocation) as any}
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
              
              <TouchableOpacity
                className="p-3 rounded-lg mb-3 border border-white border-opacity-30"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                onPress={() => handleAddLocationPress()}
              >
                <Text className="text-white text-center opacity-75">
                  + Add a different location
                </Text>
              </TouchableOpacity>
              
              {searchFilteredLocations.length === 0 && location.trim() && (
                <View className="mb-4">
                  <View className="p-6 bg-white bg-opacity-10 rounded-lg mb-3">
                    <Text className="text-black text-center opacity-75">
                      No matching locations found for "{location}"
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    className="p-4 rounded-lg mb-3 border border-white border-opacity-30"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    onPress={() => handleAddLocationPress(location.trim())}
                  >
                    <Text className="text-white text-center">
                      + Create "{location}" as a custom location
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        );

      case 4:
        const searchFilteredEmotions = getFilteredEmotionsForSearch(emotion);
        const commonEmotions = (settings as any)?.recentEmotions || COMMON_EMOTIONS.map((e) => e.text);
        
        return (
          <Animated.View
            className="flex-1"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text className="text-4xl font-bold text-white text-center mb-8 mt-8">
              How were you feeling?
            </Text>

            <TextInput
              className="border border-white border-opacity-30 rounded-lg p-4 text-xl mb-6 text-white"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              placeholder="Describe your emotional state..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={emotion}
              onChangeText={setEmotion}
              returnKeyType="done"
            />

            <Text className="text-white font-medium mb-4 text-lg opacity-90">
              {emotion.trim() && searchFilteredEmotions.length !== commonEmotions.length && !commonEmotions.find((e: string) => e.toLowerCase() === emotion.toLowerCase())
                ? `Matching emotions (${searchFilteredEmotions.length}):` 
                : "Common emotions:"}
            </Text>
            <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
              {searchFilteredEmotions.map((commonEmotion: string, index: number) => (
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
                      name={getIconForEmotion(commonEmotion) as any}
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
              
              <TouchableOpacity
                className="p-3 rounded-lg mb-3 border border-white border-opacity-30"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                onPress={() => handleAddEmotionPress()}
              >
                <Text className="text-white text-center opacity-75">
                  + Add a different emotion
                </Text>
              </TouchableOpacity>
              
              {searchFilteredEmotions.length === 0 && emotion.trim() && (
                <View className="mb-4">
                  <View className="p-6 bg-white bg-opacity-10 rounded-lg mb-3">
                    <Text className="text-black text-center opacity-75">
                      No matching emotions found for "{emotion}"
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    className="p-4 rounded-lg mb-3 border border-white border-opacity-30"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    onPress={() => handleAddEmotionPress(emotion.trim())}
                  >
                    <Text className="text-white text-center">
                      + Create "{emotion}" as a custom emotion
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
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
            <Text className="text-4xl font-bold text-white text-center mb-8 mt-8">
              Did you act on it?
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
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", minHeight: 80 }}
              placeholder="Any notes? (optional)"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={notes}
              onChangeText={setNotes}
              returnKeyType="done"
              blurOnSubmit={true}
            />
          </Animated.View>
        );

      case 6:
        const selectedActions = settings?.selectedReplacementActions || [];
        const availableActions = replacementActions.filter(action => 
          selectedActions.includes(action.id)
        );

        return (
          <Animated.View
            className="flex-1"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text className="text-4xl font-bold text-white text-center mb-8 mt-8">
              Try a replacement action
            </Text>

            {availableActions.length > 0 ? (
              <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
                {availableActions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    className="p-4 rounded-lg mb-3"
                    style={{
                      backgroundColor:
                        replacementAction === action.title
                          ? "#FFFFFF"
                          : "rgba(255, 255, 255, 0.2)",
                    }}
                    onPress={() => setReplacementAction(action.title)}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <Text className="text-3xl mr-4">{action.icon}</Text>
                        <View className="flex-1">
                          <Text
                            className={`text-xl font-semibold ${
                              replacementAction === action.title ? "text-gray-800" : "text-white"
                            }`}
                          >
                            {action.title}
                          </Text>
                          <Text
                            className={`text-base ${
                              replacementAction === action.title ? "text-gray-600" : "text-white opacity-75"
                            }`}
                          >
                            {action.description}
                          </Text>
                          <Text
                            className={`text-sm ${
                              replacementAction === action.title ? "text-gray-500" : "text-white opacity-60"
                            }`}
                          >
                            ⏱️ {action.duration} • {action.difficulty}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  className="p-4 rounded-lg mb-3 border border-white border-opacity-30"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  onPress={() => setReplacementAction("skipped")}
                >
                  <Text className="text-white text-center opacity-75">
                    Skip for now
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            ) : (
              <View className="mb-4 p-6 bg-white bg-opacity-10 rounded-lg">
                <Text className="text-white text-center opacity-75">
                  No replacement actions selected. Go to Settings to choose your preferred actions.
                </Text>
                <TouchableOpacity
                  className="mt-4 p-3 rounded-lg border border-white border-opacity-30"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  onPress={() => setReplacementAction("none_selected")}
                >
                  <Text className="text-white text-center opacity-75">
                    Continue without action
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return renderStep();
};

export default QuickLogSteps;