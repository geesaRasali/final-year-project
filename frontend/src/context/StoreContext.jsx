import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [foodList, setFoodList] = useState([]); // Start with empty array
  const [tokenInitialized, setTokenInitialized] = useState(false);
  const url = "http://localhost:4000";

  const addToCart = async (itemId) => {
    const updatedCart = !cartItems[itemId]
      ? { ...cartItems, [itemId]: 1 }
      : { ...cartItems, [itemId]: cartItems[itemId] + 1 };

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } },
        );
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev, [itemId]: prev[itemId] - 1 };
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      return updatedCart;
    });

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } },
        );
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = foodList.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      if (
        response.data.success &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        setFoodList(response.data.data);
        console.log(
          "Loaded food items from backend:",
          response.data.data.length,
        );
      } else {
        // Backend returned empty data, use static food list
        setFoodList(food_list);
        console.log("Using static food list:", food_list.length);
      }
    } catch (error) {
      console.log("Backend not available, using static food list");
      // Backend failed, use static food list
      setFoodList(food_list);
    }
  };

  const loadUserProfile = async (authToken) => {
    try {
      const response = await axios.get(url + "/api/user/profile", {
        headers: { token: authToken },
      });

      if (response.data.success && response.data.user) {
        const normalizedUser = {
          ...response.data.user,
          role: response.data.user.role || "customer",
        };
        setUser(normalizedUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } },
      );
      setCartItems(response.data.cartData);
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);

        const savedUser = localStorage.getItem("user");
        if (!savedUser) {
          await loadUserProfile(savedToken);
        }
      } else {
        // No token - load cart from localStorage for guest users
        try {
          const savedCart = localStorage.getItem("cartItems");
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }
        } catch (e) {
          console.error("Error loading guest cart:", e);
        }
      }
      // Mark token as initialized so the token watcher can safely clear cart on logout
      setTokenInitialized(true);
    }
    loadData();
  }, []);

  // Only clear cart when token is explicitly removed (after initialization),
  // not on the initial render where token starts as ""
  useEffect(() => {
    if (tokenInitialized && !token) {
      setCartItems({});
      localStorage.removeItem("cartItems");
    }
  }, [token, tokenInitialized]);

  const contextValue = {
    food_list: foodList,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    user,
    setUser,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
