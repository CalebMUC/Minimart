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
