import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { DataGrid, GridActionsCellItem, GridOverlay } from "@mui/x-data-grid";
import Modal from "../Modal";
import { FetchAllCategories, UpdateCategories, AddNewCategories } from "../../Data";

const AddCategories = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState({
    categoryID: "",
    categoryName: "",
  });

  // Custom No Rows Overlay Component
  const NoRowsOverlay = () => (
    <GridOverlay>
      <div className="text-center p-5 text-gray-500">
        No categories found. Add a new category to get started.
      </div>
    </GridOverlay>
  );

  const loadCategories = async () => {
    try {
      const fetchedCategories = await FetchAllCategories();
      if (fetchedCategories.length === 0) {
        setCategories([]);
        setError("No categories found. Add a new category to get started.");
      } else {
        setCategories(fetchedCategories);
      }
    } catch (error) {
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Columns for the DataGrid
  const columns = [
    { field: "categoryId", headerName: "ID", width: 70 },
    { field: "categoryName", headerName: "Category Name", width: 150 },
    { field: "slug", headerName: "Slug", width: 150 },
    { field: "description", headerName: "Description", width: 200 },
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
          icon={<FaEdit className="text-yellow-600 hover:text-yellow-800" />}
          label="Edit"
          onClick={() => openModal(params.row)}
        />,
        <GridActionsCellItem
          icon={<FaTrashAlt className="text-red-500 hover:text-red-700" />}
          label="Delete"
          onClick={() => handleDelete(params.row.categoryId)}
        />,
      ],
    },
  ];

  const openModal = (category = null) => {
    if (localStorage.getItem('token') && localStorage.getItem('userID')) {
      setCurrentCategory(category);
      setModalOpen(true);
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Please login to continue adding categories!",
        confirmButtonColor: "#f59e0b",
      });
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentCategory(null);
  };

  const handleSave = async (category) => {
    try {
      let response;
      if (currentCategory?.categoryId) {
        category.categoryId = currentCategory.categoryId;
        response = await UpdateCategories(category);
      } else {
        category.userName = localStorage.getItem("username");
        response = await AddNewCategories(category);
      }
      
      if (response.responseCode === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Category ${currentCategory?.categoryId ? "updated" : "added"} successfully!`,
          timer: 2000,
          confirmButtonColor: "#f59e0b",
        });
        loadCategories();
      }
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonColor: "#f59e0b",
      });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setCategories(prev => prev.filter(c => c.categoryId !== id));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Category has been deleted.",
          timer: 2000,
          confirmButtonColor: "#f59e0b",
        });
      }
    });
  };

  const handleSearch = () => {
    if (searchQuery.categoryID || searchQuery.categoryName) {
      const filteredCategories = categories.filter(cat => {
        const matchesID = searchQuery.categoryID 
          ? cat.categoryId.toString().includes(searchQuery.categoryID)
          : true;
        const matchesName = searchQuery.categoryName
          ? cat.categoryName.toLowerCase().includes(searchQuery.categoryName.toLowerCase())
          : true;
        return matchesID && matchesName;
      });
      setCategories(filteredCategories);
    } else {
      loadCategories();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories Management</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-200"
        >
          <FaPlus className="mr-2" /> Add Category
        </button>
      </div>

      {/* Search Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Category ID"
              className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              value={searchQuery.categoryID}
              onChange={(e) => setSearchQuery({...searchQuery, categoryID: e.target.value})}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Category Name"
              className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              value={searchQuery.categoryName}
              onChange={(e) => setSearchQuery({...searchQuery, categoryName: e.target.value})}
            />
          </div>
          <div>
            <button
              onClick={handleSearch}
              className="w-full flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-200"
            >
              <FaSearch className="mr-2" /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 border-l-4 border-red-500 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-red-500">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Data Grid */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={categories}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row.categoryId}
            components={{
              NoRowsOverlay: NoRowsOverlay,
            }}
            sx={{
              fontFamily : 'Inter, sans-serif',
              
              '& .MuiDataGrid-cell:hover': {
                color: '#f59e0b',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#fef3c7',
              },
            }}
          />
        </div>
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

      
      {/* Custom Small Modal */}
      {/* {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {currentCategory ? "Edit Category" : "Add Category"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <CategoryForm
                category={currentCategory}
                categories={categories}
                onSave={(category) => {
                  handleSave(category);
                  closeModal();
                }}
                onCancel={closeModal}
                isCompact={true}
              />
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

const CategoryForm = ({ category, categories, onSave, onCancel }) => {
  const initialFormData = category
    ? {
        ...category,
        categoryName: category.categoryName || "",
        slug: category.slug || "",
        description: category.description || "",
        parentCategoryId: category.parentCategoryId || null,
        isActive: category.isActive !== undefined ? category.isActive : true,
      }
    : {
        categoryName: "",
        slug: "",
        description: "",
        parentCategoryId: null,
        isActive: true,
      };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleParentCategoryChange = (e) => {
    const parentCategoryId = e.target.value ? parseInt(e.target.value) : null;
    setFormData({ ...formData, parentCategoryId });
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    if (formData.categoryName) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.categoryName),
      }));
    }
  }, [formData.categoryName]);

  const validateField = (name, value) => {
    let error = "";
    if (name === "categoryName" && !value.trim()) {
      error = "Category name is required";
    }
    if (name === "slug" && !value.trim()) {
      error = "Slug is required";
    }
    setErrors({ ...errors, [name]: error });
    return error;
  };

  const validateAllFields = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== "parentCategoryId" && key !== "isActive") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAllFields()) {
      const finalPayload = {
        categoryId: formData.categoryId || 0,
        categoryName: formData.categoryName,
        slug: formData.slug,
        description: formData.description,
        parentCategoryId: formData.parentCategoryId || null,
        isActive: formData.isActive,
        userName: localStorage.getItem("username"),
      };
      onSave(finalPayload);
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Submission",
        text: "Please fill out all required fields.",
        confirmButtonColor: "#f59e0b",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 bg-white p-4 rounded-xl shadow-lg">
      <div className="flex justify-between items-center border-b border-yellow-200 pb-4">
        <h3 className="text-center text-xl font-bold text-gray-800">
          {category ? "Edit Category" : "Add New Category"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Category Name */}
        <div>
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
            Category Name <span className="text-yellow-600">*</span>
          </label>
          <input
            type="text"
            id="categoryName"
            name="categoryName"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            value={formData.categoryName}
            onChange={handleChange}
          />
          {errors.categoryName && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryName}</p>
          )}
        </div>

        {/* Parent Category */}
        <div>
          <label htmlFor="parentCategoryId" className="block text-sm font-medium text-gray-700 mb-2">
            Parent Category
          </label>
          <select
            id="parentCategoryId"
            name="parentCategoryId"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            value={formData.parentCategoryId || ""}
            onChange={handleParentCategoryChange}
          >
            <option value="">-- Select Parent Category --</option>
            {categories
              .filter(cat => cat.categoryId !== (formData.categoryId || null))
              .map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
          </select>
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
            Slug <span className="text-yellow-600">*</span>
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            value={formData.slug}
            onChange={handleChange}
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-yellow-600">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded"
            checked={formData.isActive}
            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Active Category
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
        >
          {category ? "Update Category" : "Add Category"}
        </button>
      </div>
    </form>
  );
};

export default AddCategories;