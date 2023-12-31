import { View, Text, TextInput, StyleSheet, Button, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth, DataStore } from "aws-amplify";
import { User } from "../../models";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const { sub, setDbUser, dbUser } = useAuthContext();
  const [name, setName] = useState(dbUser?.name || "");
  const [address, setAddress] = useState(dbUser?.address || "");
  const [lat, setLat] = useState(dbUser?.lat + "" || "0");
  const [lng, setLng] = useState(dbUser?.lng + "" || "0");

  const navigation = useNavigation();

  const onSave = async () => {
    console.log(dbUser);
    if (!dbUser) {
      await createUser();
    } else {
      await updateUser();
    }

    // navigation.goBack();
  };

  const createUser = async () => {
    try {
      const user = await DataStore.save(
        new User({
          name,
          address,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          sub,
        })
      );

      setDbUser(user);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const updateUser = async () => {
    try {
      const originalUser = await DataStore.query(User, dbUser.id);
      const updateUser = await DataStore.save(
        User.copyOf(originalUser, (updated) => {
          updated.name = name;
          updated.address = address;
          updated.lat = parseFloat(lat);
          updated.lng = parseFloat(lng);
        })
      );

      setDbUser(updateUser);

      updateUser && navigation.goBack();
    } catch (e) {
      Alert.alert("Message", e.message);
    }
    // const user = await DataStore.save(
    //   User.copyOf(dbUser, (updated) => {
    //     (updated.name = name),
    //       (updated.address = address),
    //       (updated.lat = parseFloat(lat)),
    //       (updated.lng = parseFloat(lng));
    //   })
    // );
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
        style={styles.input}
      />
      <TextInput
        value={lat}
        onChangeText={setLat}
        placeholder="Latitude"
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        value={lng}
        onChangeText={setLng}
        placeholder="Longitude"
        style={styles.input}
      />
      <Button onPress={onSave} title="Save" style={{ margin: 10 }} />
      <Button onPress={() => Auth.signOut()} title="Sign Out" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },
});

export default Profile;
