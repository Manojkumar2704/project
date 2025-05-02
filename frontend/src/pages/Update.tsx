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
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchOneProduct, updateProduct,deleteImage } from "../store/slice/productSlice";

const Update = () => {
  type FormDataType = {
    name: string;
    description: string;
    price: number;
    quantity: number;
  };

  const [form, setForm] = useState<FormDataType>({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
  });

  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { product } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (id) dispatch(fetchOneProduct(id));
  }, [dispatch, id]);


  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
      });
      setExistingImages(product.image || []);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? +value : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await dispatch(updateProduct({ id, data: form, files: newImages })).unwrap();
      alert("Product updated successfully");
      navigate("/home");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert("Update failed: " + error.message);
      window.location.href="/login"
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    if (!id) return;
    try {
      await dispatch(deleteImage({ imageUrl, productId: id })).unwrap();
      setExistingImages((prevImages) => prevImages.filter((img) => img !== imageUrl));
  
      alert("Image removed successfully!");
    } catch (error: unknown) {
      alert("Error removing image: " + error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" gutterBottom>
          Update Product
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            name="name"
            label="Product Name"
            value={form.name}
            onChange={handleChange}
            required
            variant="standard"
          />
          <br /><br />
          <TextField
            fullWidth
            name="description"
            label="Description"
            value={form.description}
            onChange={handleChange}
            required
            variant="standard"
          />
          <br /><br />
          <TextField
            fullWidth
            name="price"
            type="number"
            label="Price"
            value={form.price}
            onChange={handleChange}
            required
            variant="standard"
          />
          <br /><br />
          <TextField
            fullWidth
            name="quantity"
            type="number"
            label="Quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            variant="standard"
          />
          <br /><br />
          <label className="image-label">Upload New Images <input type="file" multiple onChange={handleFileChange} /></label>
          
          <div className="grid">
            {existingImages.map((img, index) => (
              <div className="image-container" key={index}>
                <img className="update-images" src={img} alt="img" />
                <Button
        variant="outlined"
        color="error"
        onClick={() => handleRemoveImage(img)}
        sx={{ marginTop: 1 }}
      >
        Remove
      </Button>
              </div>
            ))}
          </div>
          <br /><br />
          <Button variant="contained" type="submit" fullWidth>
            Update
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Update;
