import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, TouchableOpacity, Text } from "react-native";

import { icons } from "../../constants";
import { getUserTravelEntries, signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import EmptyState from "../../components/EmptyState";
import InfoBox from "../../components/InfoBox.jsx";
import moment from "moment"; // Import moment for date formatting

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getUserTravelEntries(user.$id);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [user.$id]);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Trips Found"
            subtitle="Don't worry, We are looking forward to your trips!"
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <Text className="text-lg text-white mt-2">
              Places Visited: {posts.length}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View className="px-4 py-2 bg-white rounded-lg shadow-md mb-2">
            <Text className="text-lg font-semibold">{item.title}</Text>
            <Text className="text-sm text-gray-500">
              {moment(item.created_at).format("MMMM D, YYYY")}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
