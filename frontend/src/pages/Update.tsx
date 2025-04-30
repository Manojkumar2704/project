import React, { useEffect, useState } from "react";
import "./Update.css";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const Update = () => {
  type FormDataType = {
    name: string;
    description: string;
    price: number;
    quantity: number;
  };

  const [data, setData] = useState<FormDataType>({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
  });

  const [images, setImages] = useState<string[]>([]);
  const [newImage,setNewImage]=useState<File[]>([])
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const getOneProduct = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7000/product/getone/" + id,
        { headers }
      );
      setData({
        name: response.data.name,
        description: response.data.description,
        price: response.data.price,
        quantity: response.data.quantity,
      });
      setImages(response.data.image);
    } catch (error) {
      alert("Error fetching product.");
    }
  };

  useEffect(() => {
    getOneProduct();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]:
        name === "price" || name === "quantity" ? parseFloat(value) : value,
    });
  };

  const handleSubmitt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      data.name !== "" &&
      data.description !== "" &&
      data.price !== 0 &&
      data.quantity !== 0
    ) {
      const form = new FormData();
      form.append("name", data.name);
      form.append("description", data.description);
      form.append("price", data.price.toString());
      form.append("quantity", data.quantity.toString());
      if (newImage && newImage.length > 0) {
        newImage.forEach((file) => {
          console.log("Appending file to FormData:", file); // Debug: check the file
          form.append("images", file);
        });
      } else {
        console.log("No images selected or newImage is empty.");
      }
  
      // Debugging: Check the contents of FormData
      form.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
  
      // Send request
      try {
        await axios.put(
          `http://localhost:7000/product/updateproduct/${id}`,
          form,
          {
            headers, // Include your headers (e.g., token for authentication)
          }
        );
        alert("Product updated successfully");
        window.location.href = "/home"; // Redirect after successful update
      } catch (error: any) {
        alert(
          "Update failed: " + (error.response?.data?.message || error.message)
        );
      }
    } else {
      alert("Please fill all required fields");
    }
  };
  
  const removeImagefromDB = async (image: string) => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.delete(
        "http://localhost:7000/delete-image-db",
        {
          params: {
            image,
            id: id,
          },
          headers,
        }
      );

      console.log("Image deleted from server and DB:", response.data);
      return true;
    } catch (error: any) {
      console.error(
        "Error deleting image from DB:",
        error.response?.data || error.message
      );
      return false;
    }
  };

  const removeImage = (image: string) => {
    const updatedImages = images.filter((img) => img !== image);
    setImages(updatedImages);
    const filename = image.replace("http://localhost:7000/images/", "");
    axios
      .delete(`http://localhost:7000/delete-image/${filename}`, { headers })
      .then(() => {
        console.log(`Image ${image} deleted successfully from server.`);
      })
      .catch((err) => {
        console.error("Failed to delete image from server", err);
      });
    removeImagefromDB(image);
  };

  return (
    <div>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
          <Typography variant="h5" gutterBottom>
            Update Product
          </Typography>
          <Box component="form" onSubmit={handleSubmitt} noValidate>
            <TextField
              required
              fullWidth
              label="Product Name"
              variant="standard"
              name="name"
              value={data.name}
              onChange={handleChange}
            />
            <br />
            <br />
            <TextField
              required
              fullWidth
              label="Product Description"
              variant="standard"
              name="description"
              value={data.description}
              onChange={handleChange}
            />
            <br />
            <br />
            <TextField
              required
              fullWidth
              label="Product Price"
              variant="standard"
              name="price"
              type="number"
              value={data.price}
              onChange={handleChange}
            />
            <br />
            <br />
            <TextField
              required
              fullWidth
              label="Product Quantity"
              variant="standard"
              name="quantity"
              type="number"
              value={data.quantity}
              onChange={handleChange}
            />
            <br />
            <br />
            <label className="image-label">Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              name="images"
              onChange={(e) => {
                if (e.target.files) {
                  const selectedFiles = Array.from(e.target.files);
                  setNewImage(selectedFiles);
                }
              }}
            />
            <div className="grid">
              {images.map((item, index) => (
                <div className="image-container">
                  {" "}
                  <img className="update-images" src={item} alt="img" />
                  <button type="button" onClick={() => removeImage(item)}>
                    remove
                  </button>
                </div>
              ))}
            </div>

            <br />
            <br />
            <Button variant="contained" fullWidth type="submit">
              Update
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Update;
