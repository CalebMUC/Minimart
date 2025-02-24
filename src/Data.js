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

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Entities/GetDashBoardCategories`);
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

// -----* Addresses *-----
export const fetchAddressesByUserID = async (userID) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Entities/GetAddressesByUserId/${userID}`, {
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
    const response = await fetch(`${config.baseUrl}/api/Entities/AddAddress`, {
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
    const response = await fetch(`${config.baseUrl}/api/Entities/EditAddress`, {
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

export const GetOrders = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Order/GetOrders`);
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
export const Login = async (credentials) => {
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
    const response = await fetch(`${config.baseUrl}/api/Entities/AddProducts`, {
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

export const FetchFilteredProducts = async (requestData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Category/GetFilteredProducts`, {
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

// -----* Miscellaneous *-----
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
    const response = await fetch(`${config.baseUrl}/api/Entities/counties`);
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
    const response = await fetch(`${config.baseUrl}/api/Entities/towns?countyId=${countyId}`);
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

// -----* Save for Later *-----
export const SaveItems = async (requestData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Entities/SaveItems`, {
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

export const DeleteCartItems = async (requestData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Entities/DeleteCartItems`, {
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
export const FetchFeatures = async (formData) => {
  try {
    const response = await fetch(`${config.baseUrl}/api/Category/GetFeatures`, {
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
    const response = await fetch(`${config.baseUrl}/api/Category/AddFeatures`, {
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