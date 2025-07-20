import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Modal,
  Alert,
} from "react-native";
import { useUrgeData } from "../hooks/useUrgeData";
import { COMMON_URGES } from "../types";

interface FloatingActionButtonProps {
  visible?: boolean;
  onPress?: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  visible = true,
  onPress,
}) => {
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [scale] = useState(new Animated.Value(1));
  const { addUrgeLog } = useUrgeData();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      setShowQuickLog(true);
    }

    // Scale animation
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleQuickLog = async (urge: string) => {
    try {
      await addUrgeLog({
        urge,
        location: "",
        trigger: "",
        actedOn: null, // Will be handled by validation
        notes: "Quick logged",
      });

      setShowQuickLog(false);
      Alert.alert(
        "Logged! 📝",
        `"${urge}" has been recorded. You can add more details later.`
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to log urge. Please try the full logging flow."
      );
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Floating Action Button */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 90, // Above tab bar
          right: 20,
          transform: [{ scale }],
        }}
      >
        <TouchableOpacity
          className="w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-lg"
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Text className="text-white text-2xl">📝</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Quick Log Modal */}
      <Modal
        visible={showQuickLog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQuickLog(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-6">
          <View className="bg-white rounded-lg p-6 w-full max-w-sm">
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
              Quick Log Urge
            </Text>

            <Text className="text-gray-600 mb-6 text-center">
              What urge are you feeling right now?
            </Text>

            <View className="space-y-3 mb-6">
              {COMMON_URGES.slice(0, 6).map((urge, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  onPress={() => handleQuickLog(urge)}
                >
                  <Text className="text-gray-800 text-center font-medium">
                    {urge}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 bg-gray-100 p-3 rounded-lg"
                onPress={() => setShowQuickLog(false)}
              >
                <Text className="text-gray-700 font-medium text-center">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-blue-500 p-3 rounded-lg"
                onPress={() => {
                  setShowQuickLog(false);
                  // Navigate to full log screen
                  if (onPress) onPress();
                }}
              >
                <Text className="text-white font-medium text-center">
                  Full Log
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default FloatingActionButton;
