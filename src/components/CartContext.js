import { createContext, useState, useEffect } from "react";
import packageInfo from "../../package.json";

// Create context
export const cartContext = createContext();

// Create provider
export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Function to fetch cart items (you can call this in your Header or any other component if needed)
  const GetCartItems = async () => {
    try {
      const response = await fetch(packageInfo.urls.GetCartItemsUrl,{
        method:"POST",
        headers : {
          "Accept": "*/*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({

        //   UserID: localStorage.getItem('userID'),
         userID: localStorage.getItem('userID'),
         
        })
        
      });
      if (response.ok) {
        const data = await response.json();
        setCartCount(data.length); // Assuming response contains cart items
      } else {
        console.error("Failed to fetch cart items");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Get items from local storage when page loads
  useEffect(() => {
    const itemCount = localStorage.getItem('itemCount');
    setCartCount(itemCount ? parseInt(itemCount) : 0);
  }, []);

  // Function to update cart count
  const updateCartCount = (count) => {
    setCartCount(count);
    localStorage.setItem('itemCount', count);
  };

  return (
    <cartContext.Provider value={{ cartCount, updateCartCount, GetCartItems }}>
      {children}
    </cartContext.Provider>
  );
};
