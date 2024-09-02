import React, { useState } from "react";
import axios from "axios";
import { CircularProgress, Snackbar, Alert } from "@mui/material";
import "./App.css"; // Import the custom CSS

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [bgRemovedImage, setBgRemovedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/remove-background",
        formData,
        {
          responseType: "blob",
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setBgRemovedImage(imageUrl);
      setUploadedImage(URL.createObjectURL(file));
    } catch (err) {
      setError("Error uploading image");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="container">
      <h1 className="title">Background Removal Tool</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="file-input"
      />
      {loading && (
        <div className="loader">
          <CircularProgress />
        </div>
      )}
      <div className="images-container">
        {selectedImage && (
          <div className="image-box">
            <h2 className="image-title">Uploaded Image</h2>
            <img src={selectedImage} alt="Uploaded" className="image" />
          </div>
        )}
        {bgRemovedImage && (
          <div className="image-box">
            <h2 className="image-title">Background Removed</h2>
            <img
              src={bgRemovedImage}
              alt="Background Removed"
              className="image"
            />
          </div>
        )}
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
