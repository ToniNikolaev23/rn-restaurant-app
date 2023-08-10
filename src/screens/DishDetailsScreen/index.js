import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import restaurants from "../../../assets/data/restaurants.json";
import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { DataStore } from "aws-amplify";
import { Dish } from "../../models";
import { useBasketContext } from "../../context/BasketContext";

const DishDetailsScreen = () => {
  const [dish, setDish] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigation = useNavigation();
  const route = useRoute();
  const id = route.params?.id;
  const { addDishToBasket } = useBasketContext();

  const onAddToBasketHandler = async () => {
    await addDishToBasket(dish, quantity);

    navigation.goBack();
  };

  const decreaseQuantityHandler = () => {
    setQuantity((prev) => {
      if (prev > 0) {
        return prev - 1;
      } else {
        return 0;
      }
    });
  };

  const increaseQuantityHandler = () => {
    setQuantity((prev) => prev + 1);
  };

  const getTotal = () => {
    return (dish.price * quantity).toFixed(2);
  };

  useEffect(() => {
    if (id) {
      DataStore.query(Dish, id).then(setDish);
    }
  }, [id]);

  if (!dish) {
    return <ActivityIndicator size={"large"} color="red" />;
  }
  return (
    <View style={styles.page}>
      <Text style={styles.title}>{dish.name}</Text>
      <Text style={styles.description}>{dish.description}</Text>
      <View style={styles.separator} />
      <View style={styles.row}>
        <AntDesign
          name="minuscircleo"
          size={60}
          color={"black"}
          onPress={decreaseQuantityHandler}
        />
        <Text style={styles.quantity}>{quantity}</Text>
        <AntDesign
          name="pluscircleo"
          size={60}
          color={"black"}
          onPress={increaseQuantityHandler}
        />
      </View>

      <Pressable onPress={onAddToBasketHandler} style={styles.button}>
        <Text style={styles.buttonText}>
          Add {quantity} to basket (${getTotal()})
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    paddingVertical: 30,
    padding: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    marginVertical: 10,
  },
  description: {
    color: "gray",
  },
  separator: {
    height: 1,
    backgroundColor: "lightgrey",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  quantity: {
    fontSize: 25,
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: "black",
    marginTop: "auto",
    padding: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 20,
  },
});

export default DishDetailsScreen;
