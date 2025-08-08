// screens/QuickLogScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from "react-native";
import * as Haptics from 'expo-haptics';
import {
  COMMON_URGES,
  COMMON_LOCATIONS,
  COMMON_TRIGGERS,
  COMMON_EMOTIONS,
} from "../types";
import { useSettings } from "../hooks/useSettings";
import { useReplacementActions } from "../hooks/useReplacementActions";
import AddUrgeScreen from "./AddUrgeScreen";
import AddTriggerScreen from "./AddTriggerScreen";
import AddLocationScreen from "./AddLocationScreen";
import AddEmotionScreen from "./AddEmotionScreen";
import QuickLogSteps from "../components/QuickLogSteps";

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

  // Helper function to get default limited items
  const getDefaultTriggers = () => COMMON_TRIGGERS.slice(0, 4).map((t) => t.text);
  const getDefaultLocations = () => COMMON_LOCATIONS.slice(0, 4).map((l) => l.text);
  const getDefaultEmotions = () => COMMON_EMOTIONS.slice(0, 4).map((e) => e.text);

  // Load user's selected urges and custom icons when component mounts or settings change
  useEffect(() => {
    const loadFilteredUrges = () => {
      if (settings?.selectedUrges && settings.selectedUrges.length > 0) {
        if (filteredUrges.length === 0) {
          setFilteredUrges(settings.selectedUrges);
        } else {
          const currentSet = new Set(filteredUrges);
          const settingsSet = new Set(settings.selectedUrges);
          const areSameUrges =
            currentSet.size === settingsSet.size &&
            [...currentSet].every((urge) => settingsSet.has(urge));

          if (!areSameUrges) {
            setFilteredUrges(settings.selectedUrges);
          }
        }
      } else if (filteredUrges.length === 0) {
        setFilteredUrges(COMMON_URGES.map((u) => u.text));
      }

      // Load custom icons from settings
      if ((settings as any)?.customUrgeIcons) {
        setCustomUrgeIcons((settings as any).customUrgeIcons);
      }
      if ((settings as any)?.customTriggerIcons) {
        setCustomTriggerIcons((settings as any).customTriggerIcons);
      }
      if ((settings as any)?.customLocationIcons) {
        setCustomLocationIcons((settings as any).customLocationIcons);
      }
      if ((settings as any)?.customEmotionIcons) {
        setCustomEmotionIcons((settings as any).customEmotionIcons);
      }
    };

    loadFilteredUrges();
  }, [settings?.selectedUrges, (settings as any)?.customUrgeIcons, (settings as any)?.customTriggerIcons, (settings as any)?.customLocationIcons, (settings as any)?.customEmotionIcons]);

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
        return !!replacementAction || actedOn === true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 6 && isStepValid()) {
      // Add haptic feedback for successful next
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
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

    // Add haptic feedback for successful submission
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    console.log("Submitting urge log:", {
      urge,
      location,
      trigger,
      emotion,
      actedOn,
      replacementAction,
      notes,
    });

    updateRecentChoices();

    // Reset form
    setCurrentStep(1);
    setUrge("");
    setLocation("");
    setTrigger("");
    setEmotion("");
    setActedOn(null);
    setReplacementAction("");
    setNotes("");
  };

  const updateRecentChoices = async () => {
    try {
      const currentSettings = settings || {};
      const updatedSettings = {
        ...currentSettings,
        selectedUrges: moveToTop(urge, filteredUrges),
        recentTriggers: moveToTop(
          trigger,
          (currentSettings as any).recentTriggers || getDefaultTriggers()
        ),
        recentLocations: moveToTop(
          location,
          (currentSettings as any).recentLocations || getDefaultLocations()
        ),
        recentEmotions: moveToTop(
          emotion,
          (currentSettings as any).recentEmotions || getDefaultEmotions()
        ),
      };

      await updateSettings(updatedSettings);
      setFilteredUrges(moveToTop(urge, filteredUrges));
    } catch (error) {
      console.error("Error updating recent choices:", error);
    }
  };

  const moveToTop = (item: string, array: string[]): string[] => {
    if (!item) return array;
    if (array.length > 0 && array[0] === item) {
      return array;
    }
    const filtered = array.filter((arrayItem) => arrayItem !== item);
    return [item, ...filtered];
  };

  // Add screen handlers
  const [preFilledUrgeText, setPreFilledUrgeText] = useState<string>("");
  const [preFilledTriggerText, setPreFilledTriggerText] = useState<string>("");
  const [preFilledLocationText, setPreFilledLocationText] = useState<string>("");
  const [preFilledEmotionText, setPreFilledEmotionText] = useState<string>("");

  const handleAddUrgePress = (preFilledText?: string) => {
    setPreFilledUrgeText(preFilledText || "");
    setShowAddUrgeScreen(true);
  };

  const handleUrgeSelected = async (selectedUrge: string, selectedIcon?: string) => {
    if (selectedIcon) {
      const newCustomIcons = {
        ...customUrgeIcons,
        [selectedUrge]: selectedIcon
      };
      
      setCustomUrgeIcons(newCustomIcons);
      
      try {
        await updateSettings({
          ...settings,
          customUrgeIcons: newCustomIcons,
        } as any);
      } catch (error) {
        console.error("Error saving custom icon:", error);
      }
    }

    const updatedUrges = [selectedUrge, ...filteredUrges.filter(urge => urge !== selectedUrge)];
    setFilteredUrges(updatedUrges);
    setUrge(selectedUrge);
    setShowAddUrgeScreen(false);

    try {
      await updateSettings({ 
        ...settings,
        selectedUrges: updatedUrges,
        ...(selectedIcon && { customUrgeIcons: { ...customUrgeIcons, [selectedUrge]: selectedIcon } })
      } as any);
    } catch (error) {
      console.error("Error saving new urge:", error);
    }
  };

  // Similar handlers for other add screens...
  const handleAddTriggerPress = (preFilledText?: string) => {
    setPreFilledTriggerText(preFilledText || "");
    setShowAddTriggerScreen(true);
  };

  const handleTriggerSelected = async (selectedTrigger: string, selectedIcon?: string) => {
    if (selectedIcon) {
      const newCustomIcons = {
        ...customTriggerIcons,
        [selectedTrigger]: selectedIcon
      };
      
      setCustomTriggerIcons(newCustomIcons);
      
      try {
        await updateSettings({
          ...settings,
          customTriggerIcons: newCustomIcons,
        } as any);
      } catch (error) {
        console.error("Error saving custom trigger icon:", error);
      }
    }

    setTrigger(selectedTrigger);
    setShowAddTriggerScreen(false);

    try {
      const currentTriggers = (settings as any)?.recentTriggers || getDefaultTriggers();
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

  const handleAddLocationPress = (preFilledText?: string) => {
    setPreFilledLocationText(preFilledText || "");
    setShowAddLocationScreen(true);
  };

  const handleLocationSelected = async (selectedLocation: string, selectedIcon?: string) => {
    if (selectedIcon) {
      const newCustomIcons = {
        ...customLocationIcons,
        [selectedLocation]: selectedIcon
      };
      
      setCustomLocationIcons(newCustomIcons);
      
      try {
        await updateSettings({
          ...settings,
          customLocationIcons: newCustomIcons,
        } as any);
      } catch (error) {
        console.error("Error saving custom location icon:", error);
      }
    }

    setLocation(selectedLocation);
    setShowAddLocationScreen(false);

    try {
      const currentLocations = (settings as any)?.recentLocations || getDefaultLocations();
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

  const handleAddEmotionPress = (preFilledText?: string) => {
    setPreFilledEmotionText(preFilledText || "");
    setShowAddEmotionScreen(true);
  };

  const handleEmotionSelected = async (selectedEmotion: string, selectedIcon?: string) => {
    if (selectedIcon) {
      const newCustomIcons = {
        ...customEmotionIcons,
        [selectedEmotion]: selectedIcon
      };
      
      setCustomEmotionIcons(newCustomIcons);
      
      try {
        await updateSettings({
          ...settings,
          customEmotionIcons: newCustomIcons,
        } as any);
      } catch (error) {
        console.error("Error saving custom emotion icon:", error);
      }
    }

    setEmotion(selectedEmotion);
    setShowAddEmotionScreen(false);

    try {
      const currentEmotions = (settings as any)?.recentEmotions || getDefaultEmotions();
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

  // Back handlers for add screens
  const handleAddUrgeBack = () => {
    setShowAddUrgeScreen(false);
    setPreFilledUrgeText("");
  };

  const handleAddTriggerBack = () => {
    setShowAddTriggerScreen(false);
    setPreFilledTriggerText("");
  };

  const handleAddLocationBack = () => {
    setShowAddLocationScreen(false);
    setPreFilledLocationText("");
  };

  const handleAddEmotionBack = () => {
    setShowAddEmotionScreen(false);
    setPreFilledEmotionText("");
  };

  // Render add screens
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

  if (showAddEmotionScreen) {
    const currentEmotions = (settings as any)?.recentEmotions || getDefaultEmotions();
    
    return (
      <AddEmotionScreen
        onEmotionSelected={handleEmotionSelected}
        onBack={handleAddEmotionBack}
        currentSelectedEmotions={currentEmotions}
        preFilledText={preFilledEmotionText}
      />
    );
  }

  if (showAddLocationScreen) {
    const currentLocations = (settings as any)?.recentLocations || getDefaultLocations();
    
    return (
      <AddLocationScreen
        onLocationSelected={handleLocationSelected}
        onBack={handleAddLocationBack}
        currentSelectedLocations={currentLocations}
        preFilledText={preFilledLocationText}
      />
    );
  }

  if (showAddTriggerScreen) {
    const currentTriggers = (settings as any)?.recentTriggers || getDefaultTriggers();
    
    return (
      <AddTriggerScreen
        onTriggerSelected={handleTriggerSelected}
        onBack={handleAddTriggerBack}
        currentSelectedTriggers={currentTriggers}
        preFilledText={preFilledTriggerText}
      />
    );
  }

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
            style={{
              width: `${(currentStep / (actedOn === false ? 6 : 5)) * 100}%`,
            }}
          />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6">
        <QuickLogSteps
          currentStep={currentStep}
          urge={urge}
          setUrge={setUrge}
          trigger={trigger}
          setTrigger={setTrigger}
          location={location}
          setLocation={setLocation}
          emotion={emotion}
          setEmotion={setEmotion}
          actedOn={actedOn}
          setActedOn={setActedOn}
          replacementAction={replacementAction}
          setReplacementAction={setReplacementAction}
          notes={notes}
          setNotes={setNotes}
          filteredUrges={filteredUrges}
          customUrgeIcons={customUrgeIcons}
          customTriggerIcons={customTriggerIcons}
          customLocationIcons={customLocationIcons}
          customEmotionIcons={customEmotionIcons}
          settings={settings}
          replacementActions={replacementActions}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          handleAddUrgePress={handleAddUrgePress}
          handleAddTriggerPress={handleAddTriggerPress}
          handleAddLocationPress={handleAddLocationPress}
          handleAddEmotionPress={handleAddEmotionPress}
        />
      </View>

      {/* Bottom Navigation */}
      <View className="px-6 py-4 border-t border-white border-opacity-20">
        <View className="flex-row space-x-3">
          {currentStep > 1 && (
            <TouchableOpacity
              className="flex-1 rounded-lg py-4 border border-white border-opacity-50"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
              onPress={handleBack}
            >
              <Text className="text-center text-white font-semibold text-2xl">
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
                : "#10B981",
            }}
            onPress={
              currentStep === 6 || (currentStep === 5 && actedOn === true)
                ? handleSubmit
                : handleNext
            }
            disabled={!isStepValid()}
          >
            <Text
              className="text-center font-semibold text-2xl"
              style={{
                color: !isStepValid() ? "rgba(255, 255, 255, 0.7)" : "#FFFFFF",
              }}
            >
              {currentStep === 6 || (currentStep === 5 && actedOn === true)
                ? "Save Log"
                : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QuickLogScreen;