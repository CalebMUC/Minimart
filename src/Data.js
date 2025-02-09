import packageInfo from "../package.json";

// Function to handle adding a product
export const AddEditCategories = async (formData) => {
  try {
    const response = await fetch(packageInfo.urls.AddEditCategories, {
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
    throw error; // Re-throw to allow the calling function to handle errors
  }
};


export const GenerateReports = async (formData) => {
  try {
    const response = await fetch(packageInfo.urls.GenerateReports, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to Get Reports");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error Getting RepportData:", error);
    throw error; // Re-throw to allow the calling function to handle errors
  }
};

export const ExportReports = async (format) => {
  try {
    const response = await fetch(packageInfo.urls.ExportReports, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(format),
    });

    if (!response.ok) {
      throw new Error("Failed to Get Reports");
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error Getting RepportData:", error);
    throw error; // Re-throw to allow the calling function to handle errors
  }
};

// Function to handle adding a product
export const AddProduct = async (formData) => {
  try {
    const response = await fetch(packageInfo.urls.AddProducts, {
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
    throw error; // Re-throw to allow the calling function to handle errors
  }
};

export const SaveAddresses = async (formDta) =>{
  try{
    const response = await fetch(
      packageInfo.urls.SaveAddress,{
        method: "POST",
        headers:{
          Accept : "*/*",
          "Content-Type":"application/json"
        },
        body: JSON.stringify(formDta)
      }
    );



  }catch(error){
    console.error(error)
  }
}


export const AddNewAddress = async (data) => {
  try {
  const response = await fetch(packageInfo.urls.AddNewAddress, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      },
      body: JSON.stringify(data),  // Directly pass formData, not wrapped in { data }
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
  const response = await fetch(packageInfo.urls.UpdateAddress, {
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

export const Order = async (formData) => {
  try {
    console.log("FormData being sent to API:", formData); // Log to check the data being sent

    const response = await fetch(packageInfo.urls.AddOrder, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData) // Make sure formData is correctly passed here
    });

    if (!response.ok) {
      throw new Error(`Failed to place order: ${response.status}`);
    }

    const data = await response.json(); // Ensure we are parsing the JSON response
    console.log("Response from API:", data); // Log the response for debugging

    return data;
  } catch (error) {
    console.error("Error in Order function:", error); // Log error if there's any issue
    throw error;
  }
};

export const AddMerchants = async (formData) => {
  try {
    //console.log("FormData being sent to API:", formData); // Log to check the data being sent

    const response = await fetch(packageInfo.urls.AddMerchants, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData) // Make sure formData is correctly passed here
    });

    if (!response.ok) {
      throw new Error(`Failed to place order: ${response.status}`);
    }

    const data = await response.json(); // Ensure we are parsing the JSON response
    //console.log("Response from API:", data); // Log the response for debugging

    return data;
  } catch (error) {
    console.error("Error in Order function:", error); // Log error if there's any issue
    throw error;
  }
};

export const AddFeaturesAPI = async (formData) => {
  try {
    console.log("FormData being sent to API:", formData); // Log to check the data being sent

    const response = await fetch(packageInfo.urls.AddFeature, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData) // Make sure formData is correctly passed here
    });

    if (!response.ok) {
      throw new Error(`Failed to place order: ${response.status}`);
    }

    const data = await response.json(); // Ensure we are parsing the JSON response
    console.log("Response from API:", data); // Log the response for debugging

    return data;
  } catch (error) {
    console.error("Error in Order function:", error); // Log error if there's any issue
    throw error;
  }
};
// Function to fetch categories from API
export const FetchFeatures = async (formData) => {
  try {
    // var url = packageInfo.urls.GetFeatures.replace("{id}",subCategoryID)
    var url = packageInfo.urls.GetFeatures;
    const response = await fetch(url,{
      method : "POST",
      headers : {
        Accept : "*/*",
        "Content-Type":"application/json"
      },
      body : JSON.stringify(formData)
    }
      
    );
    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the fetched categories
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; // Re-throw to allow the calling function to handle errors
  }
};

// Function to fetch categories from API
export const FetchFilteredProducts = async (requestData) => {
  try {
    var url = packageInfo.urls.GetFilteredProducts;
    const response = await fetch(url,{
      method : "POST",
      headers : {
        Accept : "*/*",
        "Content-Type":"application/json"
      },
      body : JSON.stringify(requestData)
    }
      
    );
    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the fetched categories
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; // Re-throw to allow the calling function to handle errors
  }
};


// Function to fetch categories from API
export const FetchSearchProducts = async (subCategoryID) => {
  try {
    var url = packageInfo.urls.GetSearchProducts.replace("{id}",subCategoryID)
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the fetched categories
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; // Re-throw to allow the calling function to handle errors
  }
};

// Function to fetch categories from API
export const fetchCategories = async () => {
  try {
    const response = await fetch(packageInfo.urls.GetCategories);
    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the fetched categories
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; // Re-throw to allow the calling function to handle errors
  }
};

// Function to fetch categories from API
export const fetchBusinesTypes = async () => {
  try {
    const response = await fetch(packageInfo.urls.GetBusinessTypes);
    if (!response.ok) {
      throw new Error(`Network Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the fetched categories
  } catch (error) {
    console.error("Error businessTypes categories:", error);
    throw error; // Re-throw to allow the calling function to handle errors
  }
};

// // Function to fetch categories from API
// export const fetchCategories = async () => {
//   try {
//     const response = await fetch(packageInfo.urls.GetCategories);
//     if (!response.ok) {
//       throw new Error(`Network Error: ${response.statusText}`);
//     }

//     const data = await response.json();
//     return data; // Return the fetched categories
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     throw error; // Re-throw to allow the calling function to handle errors
//   }
// };

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
    const response = await fetch(packageInfo.urls.LoadCounties);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched counties data:", data); // Logging raw data
    return data;
  } catch (error) {
    console.error("Error fetching counties:", error);
    return []; // Return an empty array in case of an error
  }
};
export const fetchCountyTowns= async (countyId) => {
  try {
    const response = await fetch(packageInfo.urls.LoadTowns.replace("{countyId}", countyId));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched counties data:", data); // Logging raw data
    return data;
  } catch (error) {
    console.error("Error fetching counties:", error);
    return []; // Return an empty array in case of an error
  }
};

export const fetchAddress = async (userId) => {
  try {
    const response = await fetch(`https://localhost:44334/api/Entities/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }

    const data = await response.json();
    return data; // Ensure this returns an array of addresses
  } catch (error) {
    console.error('Error fetching address:', error);
    return null; // Return null if there's an error
  }
};
// Save saved for later products

//Get Save for later

export const SaveItems = async (requestData) => {
  try {
    const response = await fetch(packageInfo.urls.SaveItems, {
      method: "POST",
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    // console.log(response.json());
    if (!response.ok) {
      throw new Error("Failed to add to cart");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    // setError("Error adding to cart");
  }
};

//Remove item from cart
export const DeleteCartItems = async (requestData) => {
  try {
    const response = await fetch(packageInfo.urls.DeleteCartItems, {
      method: "POST",
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    // console.log(response.json());
    if (!response.ok) {
      throw new Error("Failed to add to cart");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    // setError("Error adding to cart");
  }
};

export const fetchAddressesByUserID = async (userID) => {
  try {
    const url = `${packageInfo.urls.GetAddressesByUserId}/${userID}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch addresses");
    }

    const data = await response.json();
    return data || []; // Ensure addresses are extracted from the response structure
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return [];
  }
};

//Get 
