import { supabase } from "@/services/supabase";
import { ThaiProvice } from "@/types";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const [shops, setShops] = useState<ThaiProvice[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ทั้งหมด");

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
      const { data, error } = await supabase
        .from("location")
        .select("*")
        .order("name", { ascending: true });
      if (error) {
        Alert.alert("คำเตือน, เกิดข้อผิดพลาดในการดึงข้อมูล");
      } else {
        setShops(data);
      }
    };

    fetchLocation();
  }, []);

  const renderShopItem = ({ item }: { item: ThaiProvice }) => (
    <TouchableOpacity
      style={styles.CardItem}
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
        style={{ width: 100, height: 100, borderRadius: 5 }}
      />
      <View style={{ marginLeft: 10, justifyContent: "center" }}>
        <Text style={styles.textName}>{item.name}</Text>
        <Text style={styles.textAddress}>🚩 {item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
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
      <FlatList
        contentContainerStyle={{ padding: 15 }}
        showsVerticalScrollIndicator={false}
        data={filteredShops}
        keyExtractor={(item) => item.id}
        renderItem={renderShopItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  categoryContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#cd662b",
    backgroundColor: "transparent",
  },
  categoryBtnActive: {
    backgroundColor: "#cd662b",
  },
  categoryText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 14,
    color: "#cd662b",
  },
  categoryTextActive: {
    color: "#fff",
  },
  textName: {
    fontFamily: "Kanit_700Bold",
    fontSize: 16,
    color: "#cd662b",
  },
  textAddress: {
    fontFamily: "Kanit_400Regular",
    fontSize: 16,
    color: "#6e6058",
  },
  CardItem: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    margin: 7,
    padding: 10,
    borderRadius: 5,
  },
});
