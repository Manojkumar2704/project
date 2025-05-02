import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import "./Upload.css";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addProduct } from "../store/slice/productSlice";

const Upload = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.products);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  const [images, setImages] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        data.name &&
        data.description &&
        data.price &&
        data.quantity &&
        images.length > 0
      ) {
        const formattedData = {
          ...data,
          price: data.price.toString(),
          quantity: data.quantity.toString(),
        };
        dispatch(addProduct({ data: formattedData, files: images }));
        window.location.href="/home"
      } else {
        alert("Please fill all required fields and select at least one image.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      alert(error)
      window.location.href="/login"
    }

   
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" gutterBottom>
          Upload Product
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
          <br /><br />
          <TextField
            required
            fullWidth
            label="Product Description"
            variant="standard"
            name="description"
            value={data.description}
            onChange={handleChange}
          />
          <br /><br />
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
          <br /><br />
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
          <br /><br />
          <label className="image-label">Product Images <input
            className="image-input"
            type="file"
            accept="image/*"
            multiple 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setImages(Array.from(e.target.files));
              }
            }}
          /></label>
          
          <br /><br />
          {loading ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" fullWidth type="submit">
              Upload
            </Button>
          )}
          {error && (
            <Typography color="error" mt={2}>
              {error}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Upload;
