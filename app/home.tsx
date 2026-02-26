import { supabase } from "@/services/supabase";
import { ThaiProvice } from "@/types";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; 

export default function Home() {
  const [shops, setShops] = useState<ThaiProvice[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ทั้งหมด");
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  const categories = useMemo(() => {
    const unique = Array.from(new Set(shops.map((s) => s.category)));
    return ["ทั้งหมด", ...unique];
  }, [shops]);

  const filteredShops = useMemo(() => {
    if (selectedCategory === "ทั้งหมด") return shops;
    return shops.filter((s) => s.category === selectedCategory);
  }, [shops, selectedCategory]);

  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("location")
        .select("*")
        .order("name", { ascending: true });
      if (error) {
        Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลสถานที่ได้ กรุณาลองใหม่อีกครั้ง");
      } else {
        setShops(data);
      }
      setIsLoading(false);
    };

    fetchLocation();
  }, []);

  const renderShopItem = ({ item }: { item: ThaiProvice }) => (
    <TouchableOpacity
      style={styles.cardItem}
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: "/detail",
          params: {
            id: item.id,
            name: item.name,
            description: item.description,
            category: item.category,
            address: item.address,
            latitude: item.latitude,
            longitude: item.longitude,
            image_url: item.image_url,
            phone: item.phone,
          },
        })
      }
    >
      <Image
        source={{ uri: item.image_url }}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.textCategory}>{item.category}</Text>
        <Text style={styles.textName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.addressContainer}>
          <Ionicons name="location-sharp" size={16} color="#cd662b" />
          <Text style={styles.textAddress} numberOfLines={2}>
            {item.address}
          </Text>
        </View>
      </View>
      <View style={styles.arrowIcon}>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>สถานที่ท่องเที่ยว</Text>
        <Text style={styles.headerSubtitle}>ค้นหาสถานที่ที่คุณอยากไป</Text>
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollViewStyle}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryBtn,
                selectedCategory === cat && styles.categoryBtnActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#cd662b" />
          <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          data={filteredShops}
          keyExtractor={(item) => item.id}
          renderItem={renderShopItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="map-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>ไม่พบสถานที่ในหมวดหมู่นี้</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontFamily: "Kanit_700Bold",
    fontSize: 24,
    color: "#333",
  },
  headerSubtitle: {
    fontFamily: "Kanit_400Regular",
    fontSize: 14,
    color: "#6e6058",
    marginTop: 2,
  },
  scrollViewStyle: {
    flexGrow: 0,
    marginBottom: 10,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    flexDirection: "row",
  },
  categoryBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: "#cd662b",
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  categoryBtnActive: {
    backgroundColor: "#cd662b",
    shadowColor: "#cd662b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, 
  },
  categoryText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 14,
    color: "#cd662b",
  },
  categoryTextActive: {
    color: "#fff",
    fontFamily: "Kanit_700Bold", 
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    paddingTop: 5,
  },
  cardItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3, 
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  textCategory: {
    fontFamily: "Kanit_400Regular",
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  textName: {
    fontFamily: "Kanit_700Bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingRight: 10,
  },
  textAddress: {
    fontFamily: "Kanit_400Regular",
    fontSize: 13,
    color: "#6e6058",
    marginLeft: 4,
    flexShrink: 1,
  },
  arrowIcon: {
    paddingLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Kanit_400Regular",
    marginTop: 10,
    color: "#6e6058",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },
});