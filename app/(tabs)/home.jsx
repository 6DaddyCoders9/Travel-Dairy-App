import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import EmptyState from "../../components/EmptyState";
import CustomButton from "../../components/CustomButton";
import { getUserTravelEntries } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useRouter } from "expo-router";
import moment from "moment";

const Home = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  // const { data: posts, refetch } = useAppwrite(getAllPosts);

  // const [refreshing, setRefreshing] = useState(false);

  // const onRefresh = async () => {
  //   setRefreshing(true);
  //   await refetch();
  //   setRefreshing(false);
  // };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="my-6 px-4 space-y-6">
          <View className="justify-between items-start flex-row">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">Welcome Back,</Text>
              <Text className="text-2xl font-psemibold text-white">{user?.username}</Text>
            </View>
            <View className="mt-1.5">
              <Image source={images.logo} className="w-[150px] -top-8" resizeMode="contain" />
            </View>
          </View>

          <CustomButton
            title="Create New Entry"
            handlePress={() => router.push('/create-entry')}
            containerStyles="mb-4"
          />

          {posts.length > 0 ? (
            posts.map((item) => (
              <TouchableOpacity key={item.$id} onPress={() => handleEntryPress(item.$id)}>
                <View className="px-4 py-2 bg-white rounded-lg shadow-md mb-2">
                  <Text className="text-sm text-gray-500">{moment(item.created_at).format("MMMM D, YYYY")}</Text>
                  <Text className="text-lg font-semibold">{item.title}</Text>
                  <Text className="text-gray-600">{item.location}</Text>
                  <Text className="mt-2">{item.content}</Text>
                  <View className="mt-2 flex-row flex-wrap">
                    {item.images.map((imageUrl, index) => (
                      <Image
                        key={index}
                        source={{ uri: imageUrl }}
                        style={{ width: 100, height: 100, marginVertical: 4, marginRight: 4 }}
                      />
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <EmptyState
              title="No Trips Found"
              subtitle="Don't worry, We are looking forward to your trips!"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
