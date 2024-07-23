import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, Image, Alert } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants";
import { getTravelTips } from "../../lib/appwrite";
import EmptyState from "../../components/EmptyState";

const TravelTips = () => {
  const { user } = useGlobalContext();
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const fetchTravelTips = async () => {
      try {
        const tips = await getTravelTips();
        setTips(tips);
      } catch (error) {
        console.error("Error fetching travel tips:", error);
        Alert.alert("Error", "Failed to fetch travel tips.");
      }
    };

    fetchTravelTips();
  }, []);

  return (
    <View>
      <Text>Travel Tips</Text>
    </View>
  );
};

export default TravelTips;
