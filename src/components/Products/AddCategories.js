import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import { DataGrid, GridActionsCellItem, GridOverlay } from "@mui/x-data-grid";
import Modal from "../Modal"; // Ensure you have a Modal component
import { fetchCategories, fetchCategoriesNew,UpdateCategories, AddNewCategories } from "../../Data"; // Ensure this is the correct import
import "../../CSS/categoryform.css"; // Import the CSS file
import CategoryForm from "../../components/Products/CategoryForm";

const AddCategories = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState({
    categoryID: 0,
    categoryName: "",
  });

  // Custom No Rows Overlay Component
  const NoRowsOverlay = () => (
    <GridOverlay>
      <div style={{ textAlign: "center", padding: "20px" }}>
        No categories found. Add a new category to get started.
      </div>
    </GridOverlay>
  );

  const loadCategories = async () => {
    try {
      const fetchedCategories = await fetchCategoriesNew();
      if (fetchedCategories.length === 0) {
        setCategories([]); // Set categories to an empty array
        setError("No categories found. Add a new category to get started.");
      } else {
        // const categoriesWithFallbacks = fetchedCategories.map((cat) => ({
        //   id: cat.categoryId, // Fallback for missing ID
        //   name: cat.categoryName || "Unnamed Category",
        //   slug: cat.slug ?? "-",
        //   description: cat.description || "No description",
        //   parentCategoryId: cat.parentCategoryId || null,
        //   isActive: cat.isActive !== undefined ? cat.isActive : true,
        //   createdAt: cat.createdOn || "Unknown Date",
        //   updatedAt: cat.updatedOn || "Unknown Date",
        // }));
        setCategories(fetchedCategories);
      }
    } catch (error) {
      setError("Failed to load categories");
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Columns for the DataGrid
  const columns = [
    { field: "categoryId", headerName: "ID", width: 70 },
    {
      field: "categoryName",
      headerName: "Category Name",
      width: 150,
    },
    {
      field: "slug",
      headerName: "Slug",
      width: 150,
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
    },
    // {
    //   field: "type",
    //   headerName: "Type",
    //   width: 120,
    //   valueGetter: (params) => {
    //     const parentCategoryId = params; // Use params.value
    //     return parentCategoryId !== 0 ? "SubCategory" : "Main Category";
    //   },
    // },
    {
      field: "parentCategoryId",
      headerName: "Parent Category",
      width: 150,
      valueGetter: (params) => {
        const parentCategoryId = params; // Use params.value
        if (parentCategoryId == 0) {
          return "Top-level Category";
        }
        const parentCategory = categories.find((cat) => cat.categoryId == parentCategoryId);
        return parentCategory ? parentCategory.categoryName : "Unknown";
      },
    },
    {
      field: "isActive",
      headerName: "Is Active",
      width: 100,
      type: "boolean",
      valueGetter: (params) => params.value ?? true, // Use params.value
    },
    {
      field: "createdOn",
      headerName: "Created At",
      width: 150,
      type: "date",
      valueGetter: (params) => {
        const dateString = params; // Use params.value
        return dateString ? new Date(dateString) : null;
      },
    },
    {
      field: "updatedOn",
      headerName: "Updated At",
      width: 150,
      type: "date",
      valueGetter: (params) => {
        const dateString = params; // Use params.value
        return dateString ? new Date(dateString) : null;
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
          onClick={() => handleDelete(params.row.categoryId)}
        />,
      ],
    },
  ];
  

  // Open modal for adding/editing
  const openModal = (category = null) => {

    if(localStorage.getItem('token') != null && localStorage.getItem('userID') != null){
      setCurrentCategory(category);
      setModalOpen(true);
    }else{
          Swal.fire({
            title : "Error",
            icon : "Error",
            text : "Please Login to continue adding Categories!",
            showConfirmButton : true
            
          }
          )
        }
  
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentCategory(null);
  };

  const handleAddCategory = () =>{
    //check if the user is logged and token is valid

  }

  // Handle save (add or edit)
  const handleSave = async (category) => {
    try {
      let response ;
      if (currentCategory?.categoryId) {
        // Edit existing category
        category.categoryId = currentCategory.categoryId

        response = await UpdateCategories(category)

     
      } else {
        // Add new category
        category.userName = localStorage.getItem("username")
        response = await AddNewCategories(category)
      }
      if (response.responseStatusId === 200) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Category ${category.categoryId ? "updated" : "added"} successfully!`,
        timer: 2000,
      });
      loadCategories();
    }
    closeModal();// close modal
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
          
    }
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

  // Handle search
  const handleSearch = () => {
    if(searchQuery.categoryID != "" || searchQuery.categoryName != ""){
      const filteredCategories = categories.filter((cat) => {
        const matchesCategoryID =
          !searchQuery.categoryID || cat.categoryId == searchQuery.categoryID;
        const matchesCategoryName =
          !searchQuery.categoryName ||
          cat.categoryName.toLowerCase().includes(searchQuery.categoryName.toLowerCase());
        return matchesCategoryID && matchesCategoryName;
      });
      setCategories(filteredCategories);
    }else{
      loadCategories();
    }
   
  };

  return (
    <div className="categories-container">

      <h1 className="categories-title">Categories</h1>
      <button onClick={ () => openModal()} className="add-category-button">
        <FaPlus className="icon" /> Add Category
      </button>

      {/* Search Bar */}
      <div className="full-search-container">
        <input
          type="text"
          placeholder="Category ID"
          className="full-search-input"
          value={searchQuery.categoryID}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, categoryID: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Category Name"
          className="full-search-input"
          value={searchQuery.categoryName}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, categoryName: e.target.value })
          }
        />
        <button className="full-search-button" onClick={handleSearch}>
          <FaSearch /> Search
        </button>
      </div>

      {/* Display error message if no categories are found */}
      {error && <div className="error-message">{error}</div>}

      {/* Material-UI DataGrid */}
      <div className="data-grid-container">
        <DataGrid
          rows={categories}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          checkboxSelection
          getRowId={(row) => row.categoryId}
          components={{
            NoRowsOverlay: NoRowsOverlay, // Custom No Rows Overlay
          }}
        />
      </div>

      {/* Modal for adding/editing */}
      {isModalOpen && (
        <Modal isVisible={isModalOpen} onClose={closeModal}>
          <CategoryForm
            category={currentCategory}
            categories={categories}
            onSave={handleSave}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default AddCategories;