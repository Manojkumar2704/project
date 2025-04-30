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

  const [images, setImages] = useState<File[]>([]);
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
      console.log(data);
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      data.name !== "" &&
      data.description !== "" &&
      data.price !== 0 &&
      data.quantity !== 0
    ) {
      const formData = new FormData()
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("quantity", data.quantity.toString());

    formData.forEach((item)=>{
        console.log(item);
        
    })

      try {
        await axios.put(
          `http://localhost:7000/product/updateproduct/${id}`,
          data,
          {headers}
        );
        alert("Product updated successfully");
        window.location.href = "/home";
      } catch (error: any) {
        alert("Update failed: " + (error.response?.data?.message || error.message));
      }
    } else {
      alert("Please fill all required fields");
    }
  };

  return (
    <div>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
          <Typography variant="h5" gutterBottom>
            Update Product
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
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
              onChange={(e) => {
                if (e.target.files) {
                  const selectedFiles = Array.from(e.target.files);
                  setImages(selectedFiles);
                }
              }}
              name="images"
            />
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
