import { supabase } from "@/services/supabase";
import { ThaiProvice } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";

const { height } = Dimensions.get("window");

export default function Detail() {

  const params = useLocalSearchParams();
  const { id } = useLocalSearchParams();
  const [place, setPlace] = useState<ThaiProvice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      
      setIsLoading(true);
      const { data, error } = await supabase
        .from("location")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลสถานที่นี้ได้");
        router.back();
      } else {
        setPlace(data);
      }
      setIsLoading(false);
    };

    fetchDetail();
  }, [id]);

  const handleOpenMapApp = () => {
    const googleMap = `https://maps.google.com/?q=${params.latitude},${params.longitude}`;
    const appleMap = `https://maps.apple.com/?q=${params.latitude},${params.longitude}`;
    Linking.canOpenURL(googleMap).then((supported) => {
      if (supported) {
        Linking.openURL(googleMap);
      } else {
        Linking.openURL(appleMap);
      }
    });
  };


  const callPhone = () => {
    if (place?.phone) {
      Linking.openURL(`tel:${place.phone}`);
    } else {
      Alert.alert("ขออภัย", "ไม่มีข้อมูลเบอร์โทรศัพท์");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#cd662b" />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  if (!place) return null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: place.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{place.category}</Text>
          </View>
          <Text style={styles.title}>{place.name}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color="#cd662b" />
            <Text style={styles.infoText}>{place.address}</Text>
          </View>
          {place.phone && (
            <TouchableOpacity style={styles.infoRow} onPress={callPhone}>
              <Ionicons name="call" size={20} color="#cd662b" />
              <Text style={[styles.infoText, { color: "#cd662b", textDecorationLine: 'underline' }]}>
                {place.phone}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>รายละเอียด</Text>
          <Text style={styles.descriptionText}>
            {place.description || "ไม่มีรายละเอียดสำหรับสถานที่นี้"}
          </Text>
          <View style={{ height: 80 }} /> 
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.mapButton} onPress={handleOpenMapApp}>
          <Ionicons name="map-outline" size={24} color="#fff" />
          <Text style={styles.mapButtonText}>ดูเส้นทางบนแผนที่</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  loadingText: {
    fontFamily: "Kanit_400Regular",
    marginTop: 10,
    color: "#6e6058",
  },
  imageContainer: {
    width: "100%",
    height: height * 0.45,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50, 
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 30,
    minHeight: height * 0.6,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF0E6",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
  },
  categoryText: {
    fontFamily: "Kanit_400Regular",
    color: "#cd662b",
    fontSize: 14,
  },
  title: {
    fontFamily: "Kanit_700Bold",
    fontSize: 28,
    color: "#333",
    marginBottom: 15,
    lineHeight: 36,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingRight: 20,
  },
  infoText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 16,
    color: "#6e6058",
    marginLeft: 10,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 20,
  },
  sectionTitle: {
    fontFamily: "Kanit_700Bold",
    fontSize: 20,
    color: "#333",
    marginBottom: 10,
  },
  descriptionText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 16,
    color: "#555",
    lineHeight: 26,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 25,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  mapButton: {
    backgroundColor: "#cd662b",
    flexDirection: "row",
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#cd662b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mapButtonText: {
    fontFamily: "Kanit_700Bold",
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
});