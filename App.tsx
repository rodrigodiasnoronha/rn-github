import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import { theme } from "./src/theme";
import { Routes } from "./src/routes";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1}} edges={["bottom"]}>
      <PaperProvider theme={theme}>
        <Routes />
      </PaperProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
