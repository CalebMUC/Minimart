import { useEffect, useState } from "react";
import { FetchPersonalInformation, SavePersonalInformation } from "../../../Data";
import { Button, TextField, Typography, Avatar, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";

// Styled Components
const Container = styled("div")({
  display: "flex",
  flexDirection: "row", // Arrange children horizontally
  alignItems: "flex-start", // Align items at the top
  gap: "2rem", // Space between the two sections
  padding: "2rem",
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  maxWidth: "1000px", // Increase max width to accommodate both sections
  margin: "auto",
});

const ProfileImageContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  width: "30%", // Set width for the profile image section
});

const FormContainer = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "70%", // Set width for the form section
});

const ActionButton = styled(Button)({
  backgroundColor: "#ecb22e",
  color: "#fff",
  "&:hover": {
    backgroundColor: "##ecb22f",
  },
});

const PersonalInformation = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    residence: "",
    nationalID: "",
    description: "",
    profileImage: null,
  });

  const [isPersonalInformation, setIsPersonalInformation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  useEffect(() => {
    loadPersonalInformation();
  }, []);

  const loadPersonalInformation = async () => {
    const userID = localStorage.getItem("userID");
    setIsLoading(true);
    const personalInformation = await FetchPersonalInformation(userID);
    if (personalInformation) {
      setFormData(personalInformation);
      setIsPersonalInformation(true);
      if (personalInformation.profileImage) {
        setProfileImagePreview(personalInformation.profileImage);
      }
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
        setFormData({ ...formData, profileImage: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const userID = localStorage.getItem("userID");
    const response = await SavePersonalInformation(userID, formData);
    if (response) {
      setIsPersonalInformation(true);
    }
    setIsLoading(false);
  };

  return (
    <Container>
      {/* Profile Image Section (Right Side) */}
      <ProfileImageContainer>
        <Typography variant="h6" gutterBottom>
          Profile Picture
        </Typography>
        <Avatar
          src={profileImagePreview}
          alt="Profile"
          sx={{ width: 150, height: 150, marginBottom: "1rem" }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
          id="profile-image-upload"
        />
        <label htmlFor="profile-image-upload">
          <ActionButton component="span">Upload Profile Image</ActionButton>
        </label>
      </ProfileImageContainer>

      {/* Form Section (Left Side) */}
      <FormContainer onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Personal Information
        </Typography>
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Residence"
          name="residence"
          value={formData.residence}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="National ID"
          name="nationalID"
          value={formData.nationalID}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          multiline
          rows={1}
        />
        {isLoading ? (
          <CircularProgress />
        ) : (
          <ActionButton type="submit">
            {isPersonalInformation ? "Update Information" : "Save Information"}
          </ActionButton>
        )}
      </FormContainer>
    </Container>
  );
};

export default PersonalInformation;