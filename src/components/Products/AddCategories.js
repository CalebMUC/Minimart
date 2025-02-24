import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Modal from "../Modal"; // Ensure you have a Modal component
import { fetchCategories } from "../../Data"; // Ensure this is the correct import
import "../../CSS/categoryform.css"; // Import the CSS file
import CategoryForm from "../../components/Products/CategoryForm";
import { FaSearch } from "react-icons/fa";

const AddCategories = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState({
      categoryID: "",
      categoryName : "",
      subCategory: "",
    });

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        console.log("Fetched Categories:", fetchedCategories); // Debugging
        setCategories(fetchedCategories.map(category => ({
          ...category,
          subcategories: category.subcategoryids || [] // Ensure subcategories is always an array
        })));
      } catch (error) {
        setError("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  // Columns for the DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Category Name", width: 150 },
    { field: "description", headerName: "Description", width: 200 },
    {
      field: "subcategoryids",
      headerName: "Subcategories",
      width: 200,
      valueGetter: (params) => {
        if (!params) return "";
        return params.map((sub) => sub.name).join(", ");
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<FaEdit />}
          label="Edit"
          onClick={() => openModal(params.row)}
        />,
        <GridActionsCellItem
          icon={<FaTrashAlt />}
          label="Delete"
          onClick={() => handleDelete(params.row.id)}
        />,
      ],
    },
  ];

  // Open modal for adding/editing
  const openModal = (category = null) => {
    setCurrentCategory(category);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentCategory(null);
  };

  // Handle save (add or edit)
  const handleSave = (category) => {
    if (category.id) {
      // Edit existing category
      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? category : c))
      );
    } else {
      // Add new category
      setCategories((prev) => [...prev, { ...category, id: Date.now() }]);
    }
    closeModal();
    Swal.fire({
      icon: "success",
      title: "Success",
      text: `Category ${category.id ? "updated" : "added"} successfully!`,
      timer: 2000,
    });
  };

  // Handle delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Category has been deleted.",
          timer: 2000,
        });
      }
    });
  };

  return (
    <div className="categories-container">
      <h1 className="categories-title">Categories</h1>
      <button
        onClick={() => openModal()}
        className="add-category-button"
      >
        <FaPlus className="icon" /> Add Category
      </button>

      {/* Search Orders */}
            <div className="full-search-container">
              {/* Order ID Input */}
              <input
                type="text"
                placeholder="Category ID"
                className="full-search-input"
                value={searchQuery.categoryID}
                onChange={(e) => setSearchQuery({ ...searchQuery, CategoryID: e.target.value })}
              />
      
              {/* Category Dropdown */}
                <select
                  className="full-search-dropdown"
                  value={searchQuery.category}
                  onChange={(e) => {
                    setSearchQuery({ ...searchQuery, category: e.target.value, subCategory: "" });
                    // Fetch subcategories based on the selected category
                    const selectedCategory = categories.find(cat => cat.id === parseInt(e.target.value));
                    setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
                  }}
                >
                  <option value="">--Category--</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Subcategory Dropdown */}
                <select
                  className="full-search-dropdown"
                  value={searchQuery.subCategory}
                  onChange={(e) => setSearchQuery({ ...searchQuery, subCategory: e.target.value })}
                  disabled={!searchQuery.category} // Disable if no category is selected
                >
                  <option value="">--SubCategory--</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
      
              {/* Search Button */}
              <button className="full-search-button">
                <FaSearch /> Search
              </button>
            </div>

      {/* Material-UI DataGrid */}
      <div className="data-grid-container">
        <DataGrid
          rows={categories}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          checkboxSelection
        />
      </div>

      {/* Modal for adding/editing */}
      {isModalOpen && (
        <Modal isVisible={isModalOpen} onClose={closeModal}>
          <CategoryForm
            category={currentCategory}
            onSave={handleSave}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
};



export default AddCategories;