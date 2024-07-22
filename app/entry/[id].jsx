import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getTravelEntry, updateTravelEntry, deleteTravelEntry } from "../../lib/appwrite";
import * as ImagePicker from 'expo-image-picker'; // Import the ImagePicker
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton"; // Ensure this import is correct
import { icons } from "../../constants"; // Ensure this import is correct

const EntryDetails = () => {
  const { id } = useLocalSearchParams();
  const [entry, setEntry] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]); // Add state for selected images

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const data = await getTravelEntry(id);
        setEntry(data);
      } catch (error) {
        console.error("Error fetching entry:", error);
        Alert.alert("Error", "Failed to fetch entry.");
      }
    };

    fetchEntry();
  }, [id]);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true // Allow multiple image selection
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setSelectedImages(prevImages => [...prevImages, ...newImages]);
      setEntry(prevEntry => ({ ...prevEntry, images: [...prevEntry.images, ...newImages] }));
    }
  };

  const handleUpdate = async () => {
    try {
      await updateTravelEntry(id, entry.title, entry.content, entry.location, entry.images);
      Alert.alert("Success", "Entry updated successfully.");
      router.back();
    } catch (error) {
      console.error("Error updating entry:", error);
      Alert.alert("Error", "Failed to update entry.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTravelEntry(id);
      Alert.alert("Success", "Entry deleted successfully.");
      router.back();
    } catch (error) {
      console.error("Error deleting entry:", error);
      Alert.alert("Error", "Failed to delete entry.");
    }
  };

  if (!entry) return <Text>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }} className="bg-primary">
      <View className="px-4 py-6 rounded-lg shadow-md">
        <Text className="text-2xl font-psemibold text-gray-200 mb-4">Edit Travel Entry</Text>
        <FormField
          title="Title"
          value={entry.title}
          placeholder="Enter title"
          handleChangeText={(text) => setEntry({ ...entry, title: text })}
          otherStyles="mt-4"
        />
        <FormField
          title="Content"
          value={entry.content}
          placeholder="Enter content"
          handleChangeText={(text) => setEntry({ ...entry, content: text })}
          otherStyles="mt-4"
        />
        <FormField
          title="Location"
          value={entry.location}
          placeholder="Enter location"
          handleChangeText={(text) => setEntry({ ...entry, location: text })}
          otherStyles="mt-4"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">Images</Text>
          <TouchableOpacity onPress={handleImagePick}>
            {selectedImages.length > 0 ? (
              <ScrollView horizontal contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {selectedImages.map((uri, index) => (
                  <Image
                    key={index}
                    source={{ uri }}
                    className="w-32 h-32 rounded-2xl mr-2"
                    resizeMode='cover'
                  />
                ))}
              </ScrollView>
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-100 flex-row space-x-2">
                <Image 
                  source={icons.upload}
                  resizeMode='contain'
                  className="h-5 w-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">Choose files</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Update Entry"
          handlePress={handleUpdate}
          containerStyles="mt-6"
        />
        <CustomButton
          title="Delete Entry"
          handlePress={handleDelete}
          containerStyles="mt-6"
          buttonStyles="bg-red-500"
        />
      </View>
    </ScrollView>
  );
};

export default EntryDetails;
