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
import { useReplacementActions } from "../hooks/useReplacementActions";
import AddUrgeScreen from "./AddUrgeScreen";
import AddTriggerScreen from "./AddTriggerScreen";
import AddLocationScreen from "./AddLocationScreen";
import AddEmotionScreen from "./AddEmotionScreen";
import { Ionicons } from "@expo/vector-icons";

const QuickLogScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [urge, setUrge] = useState("");
  const [location, setLocation] = useState("");
  const [trigger, setTrigger] = useState("");
  const [emotion, setEmotion] = useState("");
  const [actedOn, setActedOn] = useState<boolean | null>(null);
  const [replacementAction, setReplacementAction] = useState("");
  const [notes, setNotes] = useState("");
  const [filteredUrges, setFilteredUrges] = useState<string[]>([]);
  const [customUrgeIcons, setCustomUrgeIcons] = useState<{ [key: string]: string }>({});
  const [customTriggerIcons, setCustomTriggerIcons] = useState<{ [key: string]: string }>({});
  const [customLocationIcons, setCustomLocationIcons] = useState<{ [key: string]: string }>({});
  const [customEmotionIcons, setCustomEmotionIcons] = useState<{ [key: string]: string }>({});
  const [showAddUrgeScreen, setShowAddUrgeScreen] = useState(false);
  const [showAddTriggerScreen, setShowAddTriggerScreen] = useState(false);
  const [showAddLocationScreen, setShowAddLocationScreen] = useState(false);
  const [showAddEmotionScreen, setShowAddEmotionScreen] = useState(false);

  const { settings, updateSettings } = useSettings();
  const { actions: replacementActions } = useReplacementActions();
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  // Load user's selected urges and custom icons when component mounts or settings change
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

      // Load custom urge icons from settings
      if ((settings as any)?.customUrgeIcons) {
        setCustomUrgeIcons((settings as any).customUrgeIcons);
      }

      // Load custom trigger icons from settings
      if ((settings as any)?.customTriggerIcons) {
        setCustomTriggerIcons((settings as any).customTriggerIcons);
      }

      // Load custom location icons from settings
      if ((settings as any)?.customLocationIcons) {
        setCustomLocationIcons((settings as any).customLocationIcons);
      }

      // Load custom emotion icons from settings
      if ((settings as any)?.customEmotionIcons) {
        setCustomEmotionIcons((settings as any).customEmotionIcons);
      }
    };

    loadFilteredUrges();
  }, [settings?.selectedUrges, (settings as any)?.customUrgeIcons, (settings as any)?.customTriggerIcons, (settings as any)?.customLocationIcons, (settings as any)?.customEmotionIcons]); // Depend on selectedUrges and all custom icon types

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
      case 6:
        return !!replacementAction || actedOn === true; // Only required if they resisted (actedOn === false)
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 6 && isStepValid()) {
      // If user acted on urge (step 5), skip replacement action step and go to submit
      if (currentStep === 5 && actedOn === true) {
        handleSubmit();
      } else {
        animateTransition(() => setCurrentStep(currentStep + 1));
      }
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
      replacementAction,
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
    setReplacementAction("");
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

  const [preFilledUrgeText, setPreFilledUrgeText] = useState<string>("");
  const [preFilledTriggerText, setPreFilledTriggerText] = useState<string>("");
  const [preFilledLocationText, setPreFilledLocationText] = useState<string>("");
  const [preFilledEmotionText, setPreFilledEmotionText] = useState<string>("");

  const handleAddUrgePress = (preFilledText?: string) => {
    setPreFilledUrgeText(preFilledText || "");
    setShowAddUrgeScreen(true);
  };

  const handleAddTriggerPress = (preFilledText?: string) => {
    setPreFilledTriggerText(preFilledText || "");
    setShowAddTriggerScreen(true);
  };

  const handleAddLocationPress = (preFilledText?: string) => {
    setPreFilledLocationText(preFilledText || "");
    setShowAddLocationScreen(true);
  };

  const handleAddEmotionPress = (preFilledText?: string) => {
    setPreFilledEmotionText(preFilledText || "");
    setShowAddEmotionScreen(true);
  };

  const handleEmotionSelected = async (selectedEmotion: string, selectedIcon?: string) => {
    // Store the custom icon if provided - both in local state and settings
    if (selectedIcon) {
      const newCustomIcons = {
        ...customEmotionIcons,
        [selectedEmotion]: selectedIcon
      };
      
      setCustomEmotionIcons(newCustomIcons);
      
      // Also save to settings for persistence
      try {
        await updateSettings({
          ...settings,
          customEmotionIcons: newCustomIcons,
        } as any);
      } catch (error) {
        console.error("Error saving custom emotion icon:", error);
      }
    }

    // Set the selected emotion and close the screen
    setEmotion(selectedEmotion);
    setShowAddEmotionScreen(false);

    // Save to settings in the background
    try {
      const currentEmotions = (settings as any)?.recentEmotions || COMMON_EMOTIONS.map((e) => e.text);
      const updatedEmotions = [selectedEmotion, ...currentEmotions.filter((e: string) => e !== selectedEmotion)];
      
      await updateSettings({ 
        ...settings,
        recentEmotions: updatedEmotions,
        ...(selectedIcon && { customEmotionIcons: { ...customEmotionIcons, [selectedEmotion]: selectedIcon } })
      } as any);
    } catch (error) {
      console.error("Error saving new emotion:", error);
    }
  };
  const handleLocationSelected = async (selectedLocation: string, selectedIcon?: string) => {
    // Store the custom icon if provided - both in local state and settings
    if (selectedIcon) {
      const newCustomIcons = {
        ...customLocationIcons,
        [selectedLocation]: selectedIcon
      };
      
      setCustomLocationIcons(newCustomIcons);
      
      // Also save to settings for persistence
      try {
        await updateSettings({
          ...settings,
          customLocationIcons: newCustomIcons,
        } as any);
      } catch (error) {
        console.error("Error saving custom location icon:", error);
      }
    }

    // Set the selected location and close the screen
    setLocation(selectedLocation);
    setShowAddLocationScreen(false);

    // Save to settings in the background
    try {
      const currentLocations = (settings as any)?.recentLocations || COMMON_LOCATIONS.map((l) => l.text);
      const updatedLocations = [selectedLocation, ...currentLocations.filter((l: string) => l !== selectedLocation)];
      
      await updateSettings({ 
        ...settings,
        recentLocations: updatedLocations,
        ...(selectedIcon && { customLocationIcons: { ...customLocationIcons, [selectedLocation]: selectedIcon } })
      } as any);
    } catch (error) {
      console.error("Error saving new location:", error);
    }
  };
  const handleTriggerSelected = async (selectedTrigger: string, selectedIcon?: string) => {
    // Store the custom icon if provided - both in local state and settings
    if (selectedIcon) {
      const newCustomIcons = {
        ...customTriggerIcons,
        [selectedTrigger]: selectedIcon
      };
      
      setCustomTriggerIcons(newCustomIcons);
      
      // Also save to settings for persistence
      try {
        await updateSettings({
          ...settings,
          customTriggerIcons: newCustomIcons,
        } as any);
      } catch (error) {
        console.error("Error saving custom trigger icon:", error);
      }
    }

    // Set the selected trigger and close the screen
    setTrigger(selectedTrigger);
    setShowAddTriggerScreen(false);

    // Save to settings in the background
    try {
      const currentTriggers = (settings as any)?.recentTriggers || COMMON_TRIGGERS.map((t) => t.text);
      const updatedTriggers = [selectedTrigger, ...currentTriggers.filter((t: string) => t !== selectedTrigger)];
      
      await updateSettings({ 
        ...settings,
        recentTriggers: updatedTriggers,
        ...(selectedIcon && { customTriggerIcons: { ...customTriggerIcons, [selectedTrigger]: selectedIcon } })
      } as any);
    } catch (error) {
      console.error("Error saving new trigger:", error);
    }
  };
  const handleUrgeSelected = async (selectedUrge: string, selectedIcon?: string) => {
    // Store the custom icon if provided - both in local state and settings
    if (selectedIcon) {
      const newCustomIcons = {
        ...customUrgeIcons,
        [selectedUrge]: selectedIcon
      };
      
      setCustomUrgeIcons(newCustomIcons);
      
      // Also save to settings for persistence
      try {
        await updateSettings({
          ...settings,
          customUrgeIcons: newCustomIcons,
        } as any);
      } catch (error) {
        console.error("Error saving custom icon:", error);
      }
    }

    // Move the selected urge to the top of the list for better UX
    const updatedUrges = [selectedUrge, ...filteredUrges.filter(urge => urge !== selectedUrge)];
    setFilteredUrges(updatedUrges);
    setUrge(selectedUrge);
    setShowAddUrgeScreen(false);

    // Save to settings in the background
    try {
      await updateSettings({ 
        ...settings,
        selectedUrges: updatedUrges,
        ...(selectedIcon && { customUrgeIcons: { ...customUrgeIcons, [selectedUrge]: selectedIcon } })
      } as any);
    } catch (error) {
      console.error("Error saving new urge:", error);
      // Optionally revert on error, but keep UI updated for now
    }
  };

  const handleAddUrgeBack = () => {
    setShowAddUrgeScreen(false);
    setPreFilledUrgeText(""); // Clear the pre-filled text
  };

  const handleAddTriggerBack = () => {
    setShowAddTriggerScreen(false);
    setPreFilledTriggerText(""); // Clear the pre-filled text
  };

  const handleAddLocationBack = () => {
    setShowAddLocationScreen(false);
    setPreFilledLocationText(""); // Clear the pre-filled text
  };

  const handleAddEmotionBack = () => {
    setShowAddEmotionScreen(false);
    setPreFilledEmotionText(""); // Clear the pre-filled text
  };

  // If showing add urge screen, render it instead
  if (showAddUrgeScreen) {
    return (
      <AddUrgeScreen
        onUrgeSelected={handleUrgeSelected}
        onBack={handleAddUrgeBack}
        currentSelectedUrges={filteredUrges}
        preFilledText={preFilledUrgeText}
      />
    );
  }

  // If showing add emotion screen, render it instead
  if (showAddEmotionScreen) {
    const currentEmotions = (settings as any)?.recentEmotions || COMMON_EMOTIONS.map((e) => e.text);
    
    return (
      <AddEmotionScreen
        onEmotionSelected={handleEmotionSelected}
        onBack={handleAddEmotionBack}
        currentSelectedEmotions={currentEmotions}
        preFilledText={preFilledEmotionText}
      />
    );
  }
  // If showing add location screen, render it instead
  if (showAddLocationScreen) {
    const currentLocations = (settings as any)?.recentLocations || COMMON_LOCATIONS.map((l) => l.text);
    
    return (
      <AddLocationScreen
        onLocationSelected={handleLocationSelected}
        onBack={handleAddLocationBack}
        currentSelectedLocations={currentLocations}
        preFilledText={preFilledLocationText}
      />
    );
  }
  // If showing add trigger screen, render it instead
  if (showAddTriggerScreen) {
    const currentTriggers = (settings as any)?.recentTriggers || COMMON_TRIGGERS.map((t) => t.text);
    
    return (
      <AddTriggerScreen
        onTriggerSelected={handleTriggerSelected}
        onBack={handleAddTriggerBack}
        currentSelectedTriggers={currentTriggers}
        preFilledText={preFilledTriggerText}
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
    // First check if we have a custom icon stored for this trigger
    if (customTriggerIcons[triggerText]) {
      return customTriggerIcons[triggerText];
    }
    
    // Otherwise, look for it in the predefined triggers
    const triggerObj = COMMON_TRIGGERS.find((t) => t.text === triggerText);
    return triggerObj?.icon || "help-circle-outline";
  };

  const getIconForLocation = (locationText: string) => {
    // First check if we have a custom icon stored for this location
    if (customLocationIcons[locationText]) {
      return customLocationIcons[locationText];
    }
    
    // Otherwise, look for it in the predefined locations
    const locationObj = COMMON_LOCATIONS.find((l) => l.text === locationText);
    return locationObj?.icon || "location-outline";
  };

  const getIconForEmotion = (emotionText: string) => {
    // First check if we have a custom icon stored for this emotion
    if (customEmotionIcons[emotionText]) {
      return customEmotionIcons[emotionText];
    }
    
    // Otherwise, look for it in the predefined emotions
    const emotionObj = COMMON_EMOTIONS.find((e) => e.text === emotionText);
    return emotionObj?.icon || "happy-outline";
  };

  const getIconForUrge = (urgeText: string) => {
    // First check if we have a custom icon stored for this urge
    if (customUrgeIcons[urgeText]) {
      return customUrgeIcons[urgeText];
    }
    
    // Otherwise, look for it in the predefined urges
    const urgeObj = COMMON_URGES.find((u) => u.text === urgeText);
    return urgeObj?.icon || "help-circle-outline";
  };

  // Helper function to filter urges based on search text
  const getFilteredUrgesForSearch = (searchText: string) => {
    if (!searchText.trim()) {
      return filteredUrges;
    }
    
    const searchLower = searchText.toLowerCase();
    return filteredUrges.filter(urge => 
      urge.toLowerCase().includes(searchLower)
    );
  };

  // Helper function to filter triggers based on search text
  const getFilteredTriggersForSearch = (searchText: string) => {
    if (!searchText.trim()) {
      return commonTriggers;
    }
    
    const searchLower = searchText.toLowerCase();
    const filtered = commonTriggers.filter((trigger: string) => 
      trigger.toLowerCase().includes(searchLower)
    );
    
    // If exact match exists, don't filter (show all options)
    const exactMatch = commonTriggers.find((trigger: string) => 
      trigger.toLowerCase() === searchLower
    );
    
    return exactMatch ? commonTriggers : filtered;
  };

  // Helper function to filter locations based on search text
  const getFilteredLocationsForSearch = (searchText: string) => {
    if (!searchText.trim()) {
      return commonLocations;
    }
    
    const searchLower = searchText.toLowerCase();
    const filtered = commonLocations.filter((location: string) => 
      location.toLowerCase().includes(searchLower)
    );
    
    // If exact match exists, don't filter (show all options)
    const exactMatch = commonLocations.find((location: string) => 
      location.toLowerCase() === searchLower
    );
    
    return exactMatch ? commonLocations : filtered;
  };

  // Helper function to filter emotions based on search text
  const getFilteredEmotionsForSearch = (searchText: string) => {
    if (!searchText.trim()) {
      return commonEmotions;
    }
    
    const searchLower = searchText.toLowerCase();
    const filtered = commonEmotions.filter((emotion: string) => 
      emotion.toLowerCase().includes(searchLower)
    );
    
    // If exact match exists, don't filter (show all options)
    const exactMatch = commonEmotions.find((emotion: string) => 
      emotion.toLowerCase() === searchLower
    );
    
    return exactMatch ? commonEmotions : filtered;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        // Only filter while typing, not after selecting an existing urge
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

                {/* Add option to use other urges */}
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
              // Show when search has no results
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

              {/* Add option to use other triggers */}
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
              
              {/* Add option to use other locations */}
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
              
              {/* Add option to use other emotions */}
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
        // Show replacement actions step only if user resisted the urge
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
            <Text className="text-4xl font-bold text-white text-center mb-4 mt-8">
              Try a replacement action
            </Text>
            <Text className="text-xl text-white text-center mb-8 opacity-90">
              Channel that energy into something positive
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

                {/* Skip option */}
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

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#185e66" }}>
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-semibold text-white">Quick Log</Text>
          <Text className="text-white text-lg opacity-75">
            {currentStep} of {actedOn === false ? "6" : "5"}
          </Text>
        </View>

        {/* Progress bar */}
        <View className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-4">
          <View
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / (actedOn === false ? 6 : 5)) * 100}%` }}
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
            onPress={currentStep === 6 || (currentStep === 5 && actedOn === true) ? handleSubmit : handleNext}
            disabled={!isStepValid()}
          >
            <Text
              className="text-center font-semibold text-xl"
              style={{
                color: !isStepValid() ? "rgba(255, 255, 255, 0.7)" : "#185e66",
              }}
            >
              {currentStep === 6 || (currentStep === 5 && actedOn === true) ? "Save Log" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QuickLogScreen;