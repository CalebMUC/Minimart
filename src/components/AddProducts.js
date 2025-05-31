import React, { useState, useEffect } from "react";
import '../../src/AddProducts.css';
import { AddProduct, fetchCategories, FetchFeatures } from '../Data.js'; 
import packageInfo from "../../package.json";
import Dialogs from "./Dialogs.js";

const AddProducts = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productImage: null,
    productDetails: "",
    productFeatures: "",
    productSpecifications: [],
    boxContent: [],
    price: "",
    discount: "",
    categoryID: 0,
    Quantity: "",
    subcategory: "",
    CreatedBy: "",
    ProductID: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState(0);
  const [selectedCategoryId, setSelectedCategory] = useState(0);
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [fetchRequestData,setFetchRequestData] = useState({
    categoryID : 0,
    subCategoryID : 0
  })
  var [defaultSubcategoryId,setDefaultSubcategoryID] =  useState(0);



  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);

        // Set default category and load its subcategories
        if (fetchedCategories.length > 0) {
          setSelectedCategory(fetchedCategories[0].id);
        }
      } catch (error) {
        setError("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  // Set CreatedBy field with logged-in user's name
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      setError("No user is logged in.");
    }
    setFormData((prevData) => ({
      ...prevData,
      CreatedBy: username,
    }));
  }, []);

  // Load subcategories whenever the selected category changes
  useEffect(() => {
    if (selectedCategoryId) {
      setSelectedCategory(selectedCategoryId);
      setFormData({
        ...formData,
        categoryID: parseInt(selectedCategoryId),
        // category: categoryName,
        //subcategory: "", // Reset subcategory when category changes
      });
  
      // Update subcategories directly
      const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
      if (selectedCategory && selectedCategory.subcategoryids) {
        setSubcategories(selectedCategory.subcategoryids);
      } else {
        setSubcategories([]); // No subcategories
      }
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    loadDefaultSubcategory();
}, [subcategories, selectedSubCategory]);

const loadDefaultSubcategory = async () => {
  if (subcategories.length > 0 && selectedSubCategory === 0) {
  defaultSubcategoryId = subcategories[0].id;

    setSelectedSubCategory(defaultSubcategoryId);

    // Update the subcategory in formData
    setFormData((prevData) => ({
      ...prevData,
      subcategory: defaultSubcategoryId.toString(),
    }));

    // Fetch and set features
    try {
      const requestData = {
        categoryID: selectedCategoryId,
        subCategoryID: defaultSubcategoryId,
      };
      const response = await FetchFeatures(requestData);
      setFeatures(response);
    } catch (error) {
      console.error("Failed to fetch features:", error);
    }
  }
};




  // Handle category selection change
// Handle category selection change with added checks for undefined values
const handleCategoryChange = async (e) => {
  const categoryId = parseInt(e.target.value, 10);
  const categoryName = e.target.options[e.target.selectedIndex]?.text || "";

  // Reset the features and subcategories
  setSelectedCategory(categoryId);
  setFeatures([]);
  setSubcategories([]);

  // Find selected category
  const selectedCategory = categories.find((cat) => cat.id === categoryId);
  if (selectedCategory && Array.isArray(selectedCategory.subcategoryids) && selectedCategory.subcategoryids.length > 0) {
    const defaultSubcategoryId = selectedCategory.subcategoryids[0].id.toString();

    // Update the form data with the default subcategory
    setFormData({
      ...formData,
      categoryID: categoryId,
      category: categoryName,
      subcategory: defaultSubcategoryId, // Automatically set to the first subcategory
    });

    // Update the subcategories state
    setSubcategories(selectedCategory.subcategoryids);

    // Fetch features for the default subcategory
    try {
      const requestData = {
        categoryID: categoryId,
        subCategoryID: defaultSubcategoryId,
      };

      const response = await FetchFeatures(requestData);
      setFeatures(response); // Set fetched features
    } catch (error) {
      console.error("Failed to fetch features for subcategory:", error);
    }
  } else {
    // If no subcategories exist, reset related fields
    setFormData({
      ...formData,
      categoryID: categoryId,
      category: categoryName,
      subcategory: "", // Clear subcategory ID if none available
    });
  }
};


// const handleInputChange = (e) =>{
//   const{name, value} = e.target;
//   setFormData((prevData)=>({
//     ...prevData,
//     [name] : value.split(",").map((item) => item.trim()).filter((item)=> item)

//   }))
// }
// Update the handleInputChange function
const handleInputChange = (e) => {
  const { name, value } = e.target;

  if (name === "productSpecifications") {
    // Convert each line of input into a key-value pair
    const specifications = value.split("\n").reduce((acc, line) => {
      const [key, val] = line.split(":").map((item) => item.trim());
      if (key && val) {
        acc[key] = val;
      }
      return acc;
    }, {});

    setFormData((prevData) => ({
      ...prevData,
      [name]: JSON.stringify(specifications) // Save as JSON string
    }));
  } else {
    // For other fields
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
};


  // Handle subcategory selection change
  const handleSubcategoryChange = async (e) => {
    const subCategoryId = parseInt(e.target.value, 10);
    setSelectedSubCategory(subCategoryId);

    try {
      const requestData = {
        categoryID : selectedCategoryId,
      subCategoryID : subCategoryId
      };
        const response = await FetchFeatures(requestData);
      setFeatures(response);
    } catch (error) {
      console.error("Failed to load features", error);
    }

    setFormData({
      ...formData,
      subcategory: subCategoryId.toString(),
    });
  };

  
  const handleCheckBoxChange = (featurename, option) => {
    setSelectedFeatures((prev) => {
      const updatedFeatures = {...prev}
      //check if the featurename exists 
      if(!updatedFeatures[featurename]){
        updatedFeatures[featurename] = [];
      }
      
      //check if the option exits in the featurename
      if(updatedFeatures[featurename].includes(option)){
        //filter out the option if it is not eqal to the option
        updatedFeatures[featurename] = updatedFeatures[featurename].filter(
          (item) => item != option
        )
      }else{
        //add it to the list if not selacted
        updatedFeatures[featurename].push(option);

      }

      if(updatedFeatures[featurename].length == 0){
        delete updatedFeatures[featurename]
      }

      return updatedFeatures;

    });
  };

  const handleRadioChange = (featureName,option) =>{
    setSelectedFeatures((prev) =>({
      ...prev,
      [featureName]: option
    }))
  }
  // Generate unique ProductID based on category and subcategory
  const generateProductID = () => {
    const { categoryID, subcategory } = formData;
    if (categoryID) {
      const categoryName = categories.find(cat => cat.id === parseInt(categoryID))?.name || "";
      const subcategoryName = subcategories.find(sub => sub.id === parseInt(subcategory))?.name || "";
      const catCode = categoryName.substring(0, 2).toUpperCase();
      const subCatCode = subcategoryName ? subcategoryName.substring(0, 2).toUpperCase() : '00';
      const uniqueNumber = Date.now();
      return `${catCode}${subCatCode}${uniqueNumber}`;
    }
    return "";
  };

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        const imageData = new FormData();
        imageData.append('file', file);
        const response = await fetch(packageInfo.urls.UploadImages, {
          method: 'POST',
          body: imageData,
        });
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        const data = await response.json();
        setFormData((prevData) => ({
          ...prevData,
          productImage: data.url,
        }));
        setIsUploading(false);
      } catch (uploadError) {
        setError("Failed to upload image");
        setIsUploading(false);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();



    setisSubmitting(true);

     // Parse JSON only on form submit
    //  const parsedSpecifications = JSON.parse(formData.productSpecifications);
    //  const parsedBoxContent = JSON.parse(formData.boxContent);
    const productID = generateProductID();
    if (!formData.categoryID) {
      setError("Please select a category.");
      return;
    }

    if (!formData.productImage) {
      setError("Please upload an image before submitting.");
      return;
    }

    const finalData = {
      ...formData,
      productImage: formData.productImage,
      ProductID: productID,
      productFeatures : JSON.stringify(selectedFeatures),
      productSpecifications: JSON.stringify(formData.productSpecifications), // Convert to JSON string
      boxContent: JSON.stringify(formData.boxContent), // Convert to JSON string
      subcategory: formData.subcategory
      // subcategory: defaultSubcategoryId


    };

    try {
      const response = await AddProduct(finalData);
      setSuccessMessage('Product added successfully');
      setShowSuccessDialog(true);
      setTimeout(() => {
        setFormData({
          productName: "",
          productImage: null,
          productDetails: "",
          productFeatures: "",
          productSpecifications: [],
          boxContent: [],
          price: "",
          discount: "",
          categoryID: 0,
          Quantity: "",
          subcategory: "",
          CreatedBy: localStorage.getItem('username'),
          ProductID: "",
          category: "",
          SearchKeyword : ""
        });
        setSelectedFeatures([]);
      },3000);
    
    } catch (error) {
      setError("Failed to add product");
    }finally{
      setisSubmitting(false)
    }
  };
  const HandleCloseDialog = () => {
    setShowSuccessDialog(false);
  };
  // const handleSpecificationsChange = (e) => {
  //   const value = e.target.value;

  //   try {
  //     // Try to parse the JSON entered by the user
  //     const parsed = JSON.parse(value);
      
  //     // Check if parsed data is an object
  //     if (typeof parsed === "object" && !Array.isArray(parsed)) {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         productSpecifications: JSON.stringify(parsed),
  //       }));
  //     } else {
  //       throw new Error("Please enter valid JSON object format.");
  //     }
  //   } catch (error) {
  //     console.error("Invalid JSON format:", error);
  //     // Optional: Set an error message for user feedback
  //   }
  // };

  // const handleSpecificationsChange = (e) => {
  //   const value =e.target.value.split("\n")

  //   const lines = value.split("\n").map(line => line.trim()).filter(line => line != "")
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     productSpecifications: lines,  // directly set the text input
  //   }));
  // };

  const handleSpecificationsChange = (e) => {
    //const lines = e.target.value
      //.split("\n") // Split the text input into lines
      //.map(line => line.trim()) // Trim whitespace from each line
      //.filter(line => line !== ""); // Filter out empty lines

      const inputValue = e.target.value
  
    setFormData((prevData) => ({
      ...prevData,
      productSpecifications: inputValue.split("\n"),  // Update state with the array of lines
    }));
  };
  
  const handleBoxContentChange = (e) => {
    const inputvalue = e.target.value;
    //const lines  = value.split("\n").map(line => line.trim()).filter(line => line != "")
    setFormData((prevData) => ({
      ...prevData,
      boxContent : inputvalue.split("\n"),  // directly set the text input
    }));
  };
  return (
    <div className="add-product-container">
      <div className="login-header">
        <div className="logo">
          <img src="../images/shopping-bag.png" alt="Logo" />
        </div>
        {/* <div className="details">
          <h2>Welcome to Minimart</h2>
        </div> */}
      </div>

      <h2>Add New Product</h2>

      {showSuccessDialog && 
      <Dialogs message={successMessage}
      type="success"
      onClose={HandleCloseDialog}
       />}

      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="SearchKeyword">Search KeyWord</label>
          <input
            type="text"
            id="searchKeyword"
            name="searchKeyword"
            value={formData.searchKeyword}
            onChange={(e) => setFormData({ ...formData, SearchKeyword: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.categoryID} // Bound to categoryID instead of category name
            onChange={handleCategoryChange}
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {subcategories.length > 0 && (
          <div className="form-group">
            <label htmlFor="subcategory">Subcategory (Optional)</label>
            <select
              id="subcategory"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleSubcategoryChange}
            >
              {/* <option value="">No subcategory</option> */}
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="productImage">Product Image</label>
          <input
            type="file"
            id="productImage"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="productDetails">Product Details</label>
          <textarea
            id="productDetails"
            name="productDetails"
            value={formData.productDetails}
            onChange={(e) => setFormData({ ...formData, productDetails: e.target.value })}
            rows="4"
            required
          ></textarea>
        </div>

        <div className="form-group">
  <label htmlFor="productFeatures">Product Features</label>
  <div id="productFeatures"
   style={{
    maxHeight: "200px", // Adjust this height as needed
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "10px",
  }}>
    {features.map((feature) => (
      <div key={feature.featureName}>
        <h4>{feature.featureName}</h4>
        <ul>
          {feature.featureOptions.options.map((option) => (
            <li key={option}>
              <input
                // type="checkbox"
                type="radio"
                // value={option}
                value={feature.featureName}
                // onChange={(e) => handleCheckBoxChange(feature.featureName, option)}
                onChange={(e) => handleRadioChange(feature.featureName, option)}
                checked ={
                  //check if the selected features contains the option and keeps it checked
                  //if undefined or empty returns false
                  // selectedFeatures[feature.featureName]?.includes(option) || false
                  selectedFeatures[feature.featureName] === option
                }
              />{" "}
              {option}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
</div>


<div className="form-group">
        <label htmlFor="productSpecifications">Product Specifications</label>
        <textarea
          id="productSpecifications"
          name="productSpecifications"
          value={formData.productSpecifications.join("\n")}
          onChange={handleSpecificationsChange}
          rows="4"
          placeholder="Enter each specification on a new line. E.g., Operating System: Chrome OS"
          required
        ></textarea>
        </div>



        <div className="form-group">
          <label htmlFor="boxContent">Box Content</label>
          <textarea
            id="boxContent"
            name="boxContent"
            value={formData.boxContent.join("\n")}
            onChange={handleBoxContentChange}
            // onChange={(e) => setFormData({ ...formData, boxContent: e.target.value })}
            rows="3"
            placeholder="Enter each item on a new line."
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="Quantity">Quantity</label>
          <select
            id="Quantity"
            name="Quantity"
            value={formData.Quantity}
            onChange={(e) => setFormData({ ...formData, Quantity: e.target.value })}
            required
          >
            <option value="" disabled>Select quantity</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="discount">Discount</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
            required
          />
        </div>

        <button className="submitBtn" type="submit" disabled={isUploading || isSubmitting} >
        {isSubmitting ? "Submitting..." : "Add Product"}
          </button>

        {error && <p className="error-message">{error}</p>} {/* Display errors if any */}
      </form>
    </div>
  );
};

export default AddProducts;
