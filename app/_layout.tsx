import {
  Kanit_400Regular,
  Kanit_700Bold,
  useFonts,
} from "@expo-google-fonts/kanit";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  //-----------------------------------------
  const [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Kanit_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="home"
        options={{
          title: "สถานที่ต่างๆ",
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: "Kanit_400Regular", color: "#fff" },
          headerStyle: { backgroundColor: "#cd662b" },
        }}
      />
      <Stack.Screen
        name="detail"
        options={{
          title: "รายละเอียดต่างๆ",
          headerBackButtonDisplayMode: "minimal",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Kanit_400Regular",
            color: "#fff",
          },
          headerStyle: { backgroundColor: "#cd662b" },
          headerTintColor: "#fff",
        }}
      />
    </Stack>
  );
}
