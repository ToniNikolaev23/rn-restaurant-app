import React from "react";
import { View, Text, Image } from "react-native";
import styles from "./styles";

const Header = ({ restaurant }) => {
  return (
    <View style={styles.page}>
      <Image source={{ uri: restaurant.image }} style={styles.image} />

      <View style={styles.container}>
        <Text style={styles.title}>{restaurant.name}</Text>
        <Text style={styles.subtitle}>
          ${restaurant.deliveryFee} &#8226; {restaurant.minDeliveryTime}-
          {restaurant.maxDeliveryTime} min
        </Text>
      </View>
      <Text style={styles.menuTitle}>Menu</Text>
    </View>
  );
};

export default Header;
