import { createContext, useState, useEffect, useContext } from "react";
import { DataStore } from "aws-amplify";
import { Basket, BasketDish } from "../models";
import { useAuthContext } from "./AuthContext";

const BasketContext = createContext({});

const BasketContextProvider = ({ children }) => {
  const { dbUser } = useAuthContext();

  const [restaurant, setRestaurant] = useState(null);
  const [basket, setBasket] = useState(null);
  const [basketDishes, setBasketDishes] = useState([]);

  useEffect(() => {
    if (basket) {
      DataStore.query(BasketDish, (bd) => bd.basketID.eq(basket.id)).then(
        setBasketDishes
      );
    }
  }, [basket]);

  const addDishToBasket = async (dish, quantity) => {
    let theBasket = basket || (await createNewBasket());
    console.log("ADD DISH", dish);
    const newDish = await DataStore.save(
      new BasketDish({ quantity, basketID: theBasket.id, Dish: dish })
    );
    console.log("NEW", newDish);
    setBasketDishes([...basketDishes, newDish]);
  };

  const createNewBasket = async () => {
    const newBasket = await DataStore.save(
      new Basket({ userID: dbUser.id, restaurantID: restaurant.id })
    );

    setBasket(newBasket);
    return newBasket;
  };

  useEffect(() => {
    if (dbUser && restaurant) {
      DataStore.query(Basket, (b) =>
        b.and((b) => [b.restaurantID.eq(restaurant.id), b.userID.eq(dbUser.id)])
      ).then((baskets) => setBasket(baskets[0]));
    }
  }, [dbUser, restaurant]);
  return (
    <BasketContext.Provider
      value={{
        addDishToBasket,
        setRestaurant,
        basket,
        basketDishes,
        restaurant,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export default BasketContextProvider;

export const useBasketContext = () => useContext(BasketContext);
