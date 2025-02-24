import React, { useEffect, useState } from "react";
import "../../src/CSS/ProductFeature.css";
import Dialogs from "./Dialogs.js";
import { FetchFeatures, fetchCategories, AddFeaturesAPI } from "../Data.js";

const ProductFeature = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [selectedCategoryId, setSelectedCategory] = useState(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState(0);
  const [featureName, setFeatureName] = useState("");
  const [featureOption, setFeatureOption] = useState("");
  const [options, setOptions] = useState([]);
  const [featureList, setFeatureList] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // Fetch categories on load
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        if (fetchedCategories && fetchedCategories.length > 0) {
          setCategories(fetchedCategories);
          setSelectedCategory(fetchedCategories[0].id); // Set default category
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    loadCategories();
  }, []);

  // Set subcategories when category changes
  useEffect(() => {
    const selectedCategory = categories.find(
      (cat) => cat.id === parseInt(selectedCategoryId, 10)
    );
    if (selectedCategory && selectedCategory.subcategoryids) {
      setSubCategories(selectedCategory.subcategoryids);
      setSelectedSubCategory(selectedCategory.subcategoryids[0]?.id || 0);
    } else {
      setSubCategories([]);
      setSelectedSubCategory(0);
    }
  }, [selectedCategoryId, categories]);

  // Fetch features when subcategory changes
  useEffect(() => {
    const fetchFeaturesForSubCategory = async () => {
      if (!selectedCategoryId || !selectedSubCategory) return;
      try {
        const data = {
          categoryID: selectedCategoryId,
          subCategoryID: selectedSubCategory,
        };
        const response = await FetchFeatures(data);
        setFeatures(response);
      } catch (error) {
        console.error("Failed to fetch features:", error);
      }
    };
    fetchFeaturesForSubCategory();
  }, [selectedSubCategory, selectedCategoryId]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(parseInt(e.target.value, 10));
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(parseInt(e.target.value, 10));
  };

  const handleFeatureNameChange = (e) => {
    setFeatureName(toPascalCase(e.target.value));
  };

  const handleFeatureOptionChange = (e) => {
    setFeatureOption(toPascalCase(e.target.value));
  };

  const handleAddOption = () => {
    if (featureOption.trim()) {
      setOptions([...options, featureOption.trim()]);
      setFeatureOption("");
    }
  };

  const handleAddFeature = () => {
    if (featureName.trim() && options.length > 0) {
      const existingFeature = features.find((f) => f.featureName === featureName);
      if (existingFeature) {
        const duplicateOptions = options.filter((option) =>
          existingFeature.featureOptions.options.includes(option)
        );
        if (duplicateOptions.length > 0) {
          alert(`Option(s) ${duplicateOptions.join(", ")} already exist in ${featureName}`);
        } else {
          const updatedOptions = [...existingFeature.featureOptions.options, ...options];
          const updatedFeatureList = [
            ...featureList.filter((f) => f.featureName !== featureName),
            {
              featureName,
              featureOptions: { options: updatedOptions },
            },
          ];
          setFeatureList(updatedFeatureList);
        }
      } else {
        setFeatureList([
          ...featureList,
          { featureName, featureOptions: { options } },
        ]);
      }
      setFeatureName("");
      setOptions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategoryId || !selectedSubCategory) {
      setErrorMessage("Please select both a category and a subcategory.");
      setShowErrorDialog(true);
      return;
    }

    const data = {
      categoryID: selectedCategoryId,
      subCategoryId: selectedSubCategory,
      features: featureList,
    };

    try {
      const response = await AddFeaturesAPI(data);
      if (response && response.responseStatusId === 200) {
        setSuccessMessage("Feature Added Successfully");
        setShowDialog(true);
        ClearControls();
      } else {
        setErrorMessage("Failed to Add Features");
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("Failed to save features", error);
      setErrorMessage("Failed to Add Features");
      setShowErrorDialog(true);
    }
  };

  const ClearControls = () => {
    setSelectedCategory(categories[0]?.id || 0);
    const firstSubCategory = categories[0]?.subcategoryids?.[0]?.id || 0;
    setSelectedSubCategory(firstSubCategory);
    setFeatureName("");
    setOptions([]);
    setFeatureList([]);
  };

  const toPascalCase = (text) => {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="MainContainer">
      <form className="product-feature-form" onSubmit={handleSubmit}>
        {showDialog && <Dialogs message={successMessage} type="success" onClose={() => setShowDialog(false)} />}
        {showErrorDialog && <Dialogs message={errorMessage} type="error" onClose={() => setShowErrorDialog(false)} />}

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={selectedCategoryId} onChange={handleCategoryChange} required>
            <option value="" disabled>Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        {subCategories.length > 0 && (
          <div className="form-group">
            <label htmlFor="subCategory">SubCategory</label>
            <select
              id="subCategory"
              name="subCategory"
              value={selectedSubCategory}
              onChange={handleSubCategoryChange}
              required
            >
              <option value="" disabled>Select SubCategory</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id}>{subCategory.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Feature Name</label>
          <input type="text" value={featureName} onChange={handleFeatureNameChange} placeholder="Enter feature name" />
        </div>

        <div className="form-group">
          <label>Feature Option</label>
          <input
            type="text"
            value={featureOption}
            onChange={handleFeatureOptionChange}
            placeholder="Enter an option"
          />
          <button type="button" onClick={handleAddOption}>Add Option</button>
        </div>

        <ul>
          {options.map((opt, index) => (
            <li key={index}>{opt}</li>
          ))}
        </ul>

        <button type="button" onClick={handleAddFeature}>Add Feature</button>

        <h3>Features to Submit</h3>
        <ul>
          {featureList.map((feature, index) => (
            <li key={index}>
              {feature.featureName}: {feature.featureOptions.options.join(", ")}
            </li>
          ))}
        </ul>

        <div className="submitBtn">
          <button type="submit">Save Features</button>
        </div>
      </form>
    </div>
  );
};

export default ProductFeature;
