import "./global.css";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./navigation/AppNavigator";
import { setupNotifications } from "./services/NotificationService";

export default function App() {
  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
