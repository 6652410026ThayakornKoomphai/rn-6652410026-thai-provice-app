import { router } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const logo = require("@/assets/images/thai.png");

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>NAKHON SAWAN</Text>
      <Text style={styles.caption}>เมืองสี่แคว แห่มังกร</Text>
      <Text style={styles.caption}>พักผ่อนบึงบอระเพ็ด ปลารสเด็ดปากน้ำโพ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: { width: 150, height: 150, marginBottom: 20, borderRadius: 20 },
  title: { fontFamily: "Kanit_700Bold", fontSize: 28, color: "#ed8787" },
  caption: {
    fontFamily: "Kanit_400Regular",
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },
});
