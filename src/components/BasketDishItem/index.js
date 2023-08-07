import { StyleSheet, Text, View } from "react-native";

const BasketDishItem = ({ dish }) => {
  return (
    <View style={styles.row}>
      <View style={styles.quantityContainer}>
        <Text>1</Text>
      </View>
      <Text style={{ fontWeight: "600" }}>{dish.name}</Text>
      <Text style={{ marginLeft: "auto" }}>${dish.price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginVertical: 10,
  },
  description: {
    color: "gray",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  quantity: {
    fontSize: 25,
    marginHorizontal: 20,
  },

  quantityContainer: {
    backgroundColor: "lightgrey",
    paddingHorizontal: 5,
    marginRight: 10,
    paddingVertical: 2,
    borderRadius: 5,
  },
});

export default BasketDishItem;
