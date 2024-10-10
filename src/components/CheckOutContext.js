import { createContext, useState } from "react";

export const CheckOutContext = createContext();

export const CheckOutProvider = ({children}) =>{
    const [checkOutData,setCheckOutData] = useState([]);
    const [subTotal,setSubTotal] = useState(0);

    const addItemTocheckOut = (product) =>{
        setCheckOutData((prevData)=>{
            const updatedData = [...prevData,product]
            const newSubtotal = updatedData.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              );

              setSubTotal(newSubtotal)

              return updatedData;
        })
    }

    const removeItemFromCheckout = (productID) =>{
        setCheckOutData((prevData) => {
          const updatedData = prevData.filter((item) => item.productID !== productID);
          const newSubtotal = updatedData.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
          setSubTotal(newSubtotal);
          return updatedData;
        });
      };

    return (
        <CheckOutContext.Provider value={{checkOutData,subTotal,addItemTocheckOut,removeItemFromCheckout}}>
            {children}
        </CheckOutContext.Provider>
    )
}