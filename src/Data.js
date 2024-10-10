import packageInfo from "../package.json";

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
