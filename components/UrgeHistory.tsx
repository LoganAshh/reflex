import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { UrgeLog } from "../types";
import { useUrgeData } from "../hooks/useUrgeData";
import {
  formatDateTime,
  formatTime,
  isToday,
  isYesterday,
} from "../utils/dateUtils";

interface UrgeHistoryProps {
  limit?: number;
  showHeader?: boolean;
}

const UrgeHistory: React.FC<UrgeHistoryProps> = ({
  limit,
  showHeader = true,
}) => {
  const { logs, deleteLog, updateLog } = useUrgeData();
  const [selectedLog, setSelectedLog] = useState<UrgeLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const displayLogs = limit ? logs.slice(0, limit) : logs;

  const groupLogsByDate = (logs: UrgeLog[]) => {
    const groups: { [key: string]: UrgeLog[] } = {};

    logs.forEach((log) => {
      let dateKey: string;
      if (isToday(log.timestamp)) {
        dateKey = "Today";
      } else if (isYesterday(log.timestamp)) {
        dateKey = "Yesterday";
      } else {
        dateKey = log.timestamp.toLocaleDateString("en", {
          weekday: "long",
          month: "short",
          day: "numeric",
        });
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(log);
    });

    return groups;
  };

  const handleLogPress = (log: UrgeLog) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const handleDeleteLog = (log: UrgeLog) => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this urge log?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteLog(log.id);
              setShowDetailModal(false);
            } catch (error) {
              Alert.alert("Error", "Failed to delete log entry");
            }
          },
        },
      ]
    );
  };

  const handleToggleActedOn = async (log: UrgeLog) => {
    try {
      const updatedLog = { ...log, actedOn: !log.actedOn };
      await updateLog(updatedLog);
      setSelectedLog(updatedLog);
    } catch (error) {
      Alert.alert("Error", "Failed to update log entry");
    }
  };

  const renderLogItem = (log: UrgeLog) => {
    const wasResisted = !log.actedOn;

    return (
      <TouchableOpacity
        key={log.id}
        className="rounded-lg p-4 mb-3 border"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderColor: "rgba(255, 255, 255, 0.25)",
        }}
        onPress={() => handleLogPress(log)}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            {/* Urge and status */}
            <View className="flex-row items-center mb-2">
              <Text className="text-lg font-semibold text-white flex-1">
                {log.urge}
              </Text>
              <View
                className={`px-2 py-1 rounded-full ${
                  wasResisted ? "bg-green-500" : "bg-red-500"
                }`}
                style={{
                  backgroundColor: wasResisted 
                    ? "rgba(34, 197, 94, 0.8)" 
                    : "rgba(239, 68, 68, 0.8)"
                }}
              >
                <Text className="text-xs font-medium text-white">
                  {wasResisted ? "Resisted" : "Acted on"}
                </Text>
              </View>
            </View>

            {/* Details */}
            <View className="flex-row items-center space-x-4 mb-2">
              <Text className="text-sm text-white opacity-75">
                ⏰ {formatTime(log.timestamp)}
              </Text>
              {log.location && (
                <Text className="text-sm text-white opacity-75">📍 {log.location}</Text>
              )}
              {log.trigger && (
                <Text className="text-sm text-white opacity-75">⚡ {log.trigger}</Text>
              )}
            </View>

            {/* Replacement action */}
            {log.replacementAction && wasResisted && (
              <View 
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.2)",
                }}
              >
                <Text className="text-green-300 text-sm">
                  ✅ {log.replacementAction}
                </Text>
              </View>
            )}

            {/* Notes */}
            {log.notes && (
              <Text className="text-sm text-white opacity-60 mt-2 italic">
                "{log.notes}"
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetailModal = () => {
    if (!selectedLog) return null;

    const wasResisted = !selectedLog.actedOn;

    return (
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-lg p-6 max-h-4/5">
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View className="flex-row justify-between items-start mb-6">
                <Text className="text-2xl font-bold text-gray-800 flex-1">
                  {selectedLog.urge}
                </Text>
                <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                  <Text className="text-gray-500 text-2xl">×</Text>
                </TouchableOpacity>
              </View>

              {/* Status Badge */}
              <View
                className={`self-start px-4 py-2 rounded-full mb-6 ${
                  wasResisted ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    wasResisted ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {wasResisted ? "✅ Resisted" : "❌ Acted On"}
                </Text>
              </View>

              {/* Details */}
              <View className="space-y-4 mb-6">
                <View>
                  <Text className="text-gray-500 text-sm font-medium mb-1">
                    Time
                  </Text>
                  <Text className="text-gray-800 text-lg">
                    {formatDateTime(selectedLog.timestamp)}
                  </Text>
                </View>

                {selectedLog.location && (
                  <View>
                    <Text className="text-gray-500 text-sm font-medium mb-1">
                      Location
                    </Text>
                    <Text className="text-gray-800 text-lg">
                      {selectedLog.location}
                    </Text>
                  </View>
                )}

                {selectedLog.trigger && (
                  <View>
                    <Text className="text-gray-500 text-sm font-medium mb-1">
                      Trigger
                    </Text>
                    <Text className="text-gray-800 text-lg">
                      {selectedLog.trigger}
                    </Text>
                  </View>
                )}

                {selectedLog.replacementAction && (
                  <View>
                    <Text className="text-gray-500 text-sm font-medium mb-1">
                      Replacement Action
                    </Text>
                    <Text className="text-gray-800 text-lg">
                      {selectedLog.replacementAction}
                    </Text>
                  </View>
                )}

                {selectedLog.notes && (
                  <View>
                    <Text className="text-gray-500 text-sm font-medium mb-1">
                      Notes
                    </Text>
                    <Text className="text-gray-800 text-lg italic">
                      "{selectedLog.notes}"
                    </Text>
                  </View>
                )}
              </View>

              {/* Actions */}
              <View className="space-y-3">
                <TouchableOpacity
                  className={`p-4 rounded-lg ${
                    wasResisted
                      ? "bg-red-50 border border-red-200"
                      : "bg-green-50 border border-green-200"
                  }`}
                  onPress={() => handleToggleActedOn(selectedLog)}
                >
                  <Text
                    className={`text-center font-semibold ${
                      wasResisted ? "text-red-700" : "text-green-700"
                    }`}
                  >
                    Mark as {wasResisted ? "Acted On" : "Resisted"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-red-50 p-4 rounded-lg border border-red-200"
                  onPress={() => handleDeleteLog(selectedLog)}
                >
                  <Text className="text-red-700 text-center font-semibold">
                    Delete Entry
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const groupedLogs = groupLogsByDate(displayLogs);

  if (displayLogs.length === 0) {
    return (
      <View 
        className="rounded-lg p-6 border"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        {showHeader && (
          <Text className="text-lg font-bold text-white mb-4">
            Recent Urges
          </Text>
        )}
        <View className="items-center py-8">
          <Text className="text-4xl mb-3">🌱</Text>
          <Text className="text-white opacity-75 text-center">
            No urges logged yet.{"\n"}Start tracking your patterns!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View 
        className="rounded-lg p-6 border"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        {showHeader && (
          <Text className="text-lg font-bold text-white mb-4">
            Recent Urges
          </Text>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          {Object.entries(groupedLogs).map(([dateKey, logs]) => (
            <View key={dateKey} className="mb-6">
              <Text className="text-sm font-semibold text-white opacity-75 mb-3 uppercase tracking-wide">
                {dateKey}
              </Text>
              {logs.map(renderLogItem)}
            </View>
          ))}
        </ScrollView>
      </View>

      {renderDetailModal()}
    </>
  );
};

export default UrgeHistory;