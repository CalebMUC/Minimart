import config from './config';

// -----* Categories *-----
export const AddEditCategories = async (formData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Category/AddEditCategories`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to add/edit category");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding/editing category:", error);
    throw error;
  }
};

// export const fetchCategories = async () => {
//   try {
//     const response = await fetch(`${config.baseUrl}/api/Entities/GetDashBoardCategories`);
//     if (!response.ok) {
//       throw new Error(`Network Error: ${response.statusText}`);
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     throw error;
//   }
// };

export const FetchAllCategories = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Category/GetAllCategories`);
    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const AddNewCategories = async (formData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Category/AddCategories`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const UpdateCategories = async (formData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Category/UpdateCategories`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const FetchNestedCategories = async () =>{
  try {
    const response = await fetch(`${config.baseUrl}/api/Category/GetNestedCategories`);
    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export const GetCategoriesById = async (categoryId) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Category/GetCategoriesById?CategoryId=${categoryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const DeleteCategoriesById = async (categoryId) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Category/DeleteCategoriesById?CategoryId=${categoryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// -----* Addresses *-----
export const fetchAddressesByUserID = async (userID) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Address/GetAddressesByUserId/${userID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch addresses");
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return [];
  }
};

export const AddNewAddress = async (data) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Address/AddAddress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to add new address: ${response.status}`);
    }

    const addedData = await response.json();
    return addedData;
  } catch (error) {
    console.error("Error adding new address:", error);
    throw error;
  }
};

export const updateAddress = async (data) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Address/EditAddress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update address: ${response.status}`);
    }

    const updatedAddress = await response.json();
    return updatedAddress;
  } catch (error) {
    throw error;
  }
};

// -----* Orders *-----
export const Order = async (formData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Order/AddOrder`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Failed to place order: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

export const UpdateOrderStatus = async (formData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Order/UpdateOrderStatus`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Failed to place order: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

export const GetOrders = async (requestData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Order/GetOrders`,{
       method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const GetOrderStatus = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Order/GetOrderStatus`);
    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};



export const GetMerchantOrders = async (formData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Order/GetMerchantOrders`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Failed to place order: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

export const GetAdminOrders = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Order/GetAdminOrders`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Failed to place order: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

export const GetOrderDetails = async (orderId) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Order/GetOrdersById?OrderId=${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch addresses");
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return [];
  }
};
// -----* Reports *-----
export const GenerateReports = async (formData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Report/Generate`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to generate reports");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating reports:", error);
    throw error;
  }
};

export const ExportReports = async (format) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Report/Export`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(format),
    });

    if (!response.ok) {
      throw new Error("Failed to export reports");
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error exporting reports:", error);
    throw error;
  }
};

// -----* Authentication *-----
export const UserLogin = async (credentials) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Authentication/Login`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

 export const verifyToken = async (token) => {
    try {
      const response = await fetch(`${config.baseUrl}/WeatherForecast`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (err) {
      console.error("Error verifying token:", err);
      return false;
    }
  };

export const SendEmailValidationCode = async (credentials) => {
  try {
    
    const response = await fetch(`${config.baseUrl}/api/Authentication/SendEmailVerificationCode`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};


export const SendResetCode = async (credentials) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Authentication/SendResetCode`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const VerifyEmailValidationCode = async (credentials) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Authentication/VerifyEmailValidationCode`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const VerifyResetCode = async (credentials) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Authentication/VerifyResetCode`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const ResetPassword = async (credentials) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Authentication/ResetPassword`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const Register = async (userData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Authentication/Register`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to register");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};

// -----* Products *-----
export const AddProduct = async (formData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Product/AddProducts`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to add product");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const EditProduct = async (formData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Product/EditProducts`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to add product");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const LoadProductImages = async (formData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Product/LoadProductImages`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to add product");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const GetProductsByCategory = async (formData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Product/GetProductsByCategory`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to add product");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const FetchProducts = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Product/GetAllProducts`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`Failed to Get Products ${response.status}`);
    }

    // Parse the JSON data
    const data = await response.json();

    // Return the data
    return data;
  } catch (error) {
    console.error("Error in FetchProducts:", error); // Log the error for debugging
    throw error; // Re-throw the error for the caller to handle
  }
};



// -----* Deliverables *-----
export const fetchCountryCodes = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    const codes = data
      .map((country) => ({
        name: country.name.common,
        code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ""),
      }))
      .filter((country) => country.code);
    return codes;
  } catch (error) {
    console.error("Error fetching country codes:", error);
  }
};

export const fetchCounties = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Deliveries/counties`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching counties:", error);
    return [];
  }
};

export const fetchCountyTowns = async (countyId) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Deliveries/towns?countyId=${countyId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching towns:", error);
    return [];
  }
};

export const fetchDeliveryStations = async (townId) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Deliveries/deliveryStations?townId=${townId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching towns:", error);
    return [];
  }
};

// -----* Carts *-----

export const AddCartItems = async (requestData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Cart/AddCartItems`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Failed to save items");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving items:", error);
    throw error;
  }
};

export const GetCartItems = async (requestData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Cart/GetCartItems`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Failed to save items");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving items:", error);
    throw error;
  }
};

// Data.js
export const GetPersonalizedRecommendations = async (userId, limit = 5) => {
  const response = await fetch(`${config.baseUrl}/api/Cart/personalized/${userId}?limit=${limit}`);
  return await response.json();
};

export const GetComplementaryProducts = async (productId, limit = 5) => {
  const response = await fetch(`${config.baseUrl}/api/Cart/complementary/${productId}?limit=${limit}`);
  return await response.json();
};

export const GetFrequentlyBought = async (productId, limit = 5) => {
  const response = await fetch(`${config.baseUrl}/api/Cart/frequently-bought/${productId}?limit=${limit}`);
  return await response.json();
};

export const GetSimilarProducts = async (productId, limit = 5) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Cart/GetSimilarProducts?productId=${productId}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch similar products");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching similar products:", error);
    throw error;
  }
};

export const GetBoughtItems = async (requestData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Cart/GetBoughtItems`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Failed to save items");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving items:", error);
    throw error;
  }
};

export const SaveItems = async (requestData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Cart/SaveItems`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Failed to save items");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving items:", error);
    throw error;
  }
};

export const GetSavedItems = async (userId) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Cart/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to get saved items");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting saved items:", error);
    throw error;
  }
};

export const DeleteCartItems = async (requestData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Cart/DeleteCartItems`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Failed to delete cart items");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting cart items:", error);
    throw error;
  }
};


// -----* Role Modules *-----
export const fetchRoleModules = async (RoleID) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/SystemSecurity/role-modules?RoleID=${RoleID}`);
    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching role modules:", error);
    throw error;
  }
};

export const fetchSubModuleCategories = async (subModuleID) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/SystemSecurity/submodule-categories?subModuleID=${subModuleID}`);
    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching submodule categories:", error);
    throw error;
  }
};

// -----* Features *-----

export const FetchAllFeatures = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Features/GetAllFeatures`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching features:", error);
    throw error;
  }
};

export const FetchFeatures = async (formData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Features/GetFeatures`, {
      method: "POST",
      headers: { 
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching features:", error);
    throw error;
  }
};

export const AddFeaturesAPI = async (formData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Features/AddFeatures`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Failed to add features: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding features:", error);
    throw error;
  }
};

// -----* Personal Information *-----
export const FetchPersonalInformation = async (userId) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Entities/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch personal information");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching personal information:", error);
    throw error;
  }
};

export const SavePersonalInformation = async (userID, data) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Entities/UpdatePersonalInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({ userId: userID, ...data }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save personal information: ${response.status}`);
    }

    const savedData = await response.json();
    return savedData;
  } catch (error) {
    console.error("Error saving personal information:", error);
    throw error;
  }
};

//------* Merchants * -------
export const AddMerchants = async (formData) =>{
  try{
     const response = await fetch(`${config.baseUrl}/api/SystemMerchant/AddMerchantsAsync`,{
      method : "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body : JSON.stringify(formData)
     });
     if(!response.ok){
      throw new Error(`Failed to add merchant ${response.status}`)
     }
     const data = response.json();

     return data;

  }catch(error){
    throw error;
  }
}

export const UpdateMerchants = async (formData) =>{
  try{
     const response = await fetch(`${config.baseUrl}/api/SystemMerchant/UpdateMerchantsAsync`,{
      method : "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body : JSON.stringify(formData)
     });
     if(!response.ok){
      throw new Error(`Failed to add merchant ${response.status}`)
     }
     const data = response.json();

     return data;

  }catch(error){
    throw error;
  }
}
export const FetchMerchants = async ()=>{
  try{
    var response = await fetch(
      `${config.baseUrl}/api/SystemMerchant/GetAllMerchants`,{
        method : "GET",
        headers :{
          Accept : "*/*",
          "Content-type" : "application/json"
        }
      });

      if(!response.ok){
        throw new Error(`Failed to Get Merchants ${response.status}`)
      }

      const merchants = response.json();
      return merchants;


  }catch(error){
    throw error;
  }

}

export const FetchMerchantsById = async (merchantId)=>{
  try{
    const response = await fetch(`${config.baseUrl}/api/SystemMerchant/GetMerchantById?merchantID=${merchantId}`,{
      method : "Get",
      headers :{
        Accept : "*/*",
        "Content-type" : "application/json"
      }
    });
    if(response.ok){
      throw new Error(`Failed to get Merchant By ID ${response.json}`)
    } 
  
    const merchantById = response.json();
  
    return merchantById;
  }catch(error){
    throw error;
  }
  
}

export const DeleteMerchants = async (formData) =>{
  try{
     const response = await fetch(`${config.baseUrl}/api/SystemMerchant/DeleteMerchantsAsync`,{
      method : "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body : JSON.stringify(formData)
     });
     if(!response.ok){
      throw new Error(`Failed to add merchant ${response.status}`)
     }
     const data = response.json();

     return data;

  }catch(error){
    throw error;
  }
}

// ------** Search ** --------

export const FetchFilteredProducts = async (requestData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Search/GetFilteredProducts`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    throw error;
  }
};

export const FetchSearchProducts = async (subCategoryID) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Category/GetSearchProducts/${subCategoryID}`);
    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching search products:", error);
    throw error;
  }
};

export const GetSuggestions = async (query) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Search/SearchSuggestion?query=${query}`);
    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching search products:", error);
    throw error;
  }
};


export const GetProductsSearch = async (query) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Search/SearchProducts?query=${query}`);
    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching search products:", error);
    throw error;
  }
};

// ------** UPLOADS ** --------
export const FileUploads = async (fileData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Entities/UploadImages`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        // Do NOT set Content-Type manually for FormData
      },
      body: fileData, // Send the FormData object directly
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.status}`);
    }

    const uploadedFile = await response.json(); // Parse the JSON response
    return uploadedFile;
  } catch (error) {
    throw error;
  }
};