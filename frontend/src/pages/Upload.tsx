import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import "./Upload.css"
import axios from "axios";

const Upload = () => {
  type FormData = {
    name: string;
    description: string;
    price: number;
    quantity: number;
  };
  const [data, setData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
  });
  const [images, setImages] = useState<File[]>([]);

  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", data.price.toString());
  formData.append("quantity", data.quantity.toString());
  images.forEach((file) => {
    formData.append("images", file);
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const uploadProduct=async()=>{
       const result= await axios.post("http://localhost:7000/product/uploads",formData,{headers})
        if(result.status===200){
            alert(result.data.message)
            window.location.href="/home"
        }else{
            alert(result.data.message)
        }
    }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(data.name!==""&&data.description!==""&&data.price!==0&&data.quantity!==0){
        uploadProduct()
    }else{
        alert("fill all the required fields")
    }
   
  };
  return (
    <div>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
          <Typography variant="h5" gutterBottom>
            Upload Product
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <div>
              <div>
                <TextField
                required
                  fullWidth
                  id="standard-basic"
                  label="Product name"
                  variant="standard"
                  onChange={handleChange}
                  name="name"
                />
              </div>
              <br />
              <div>
                <TextField
                required
                  fullWidth
                  id="standard-basic"
                  label="Product Description"
                  variant="standard"
                  onChange={handleChange}
                  name="description"
                />
              </div>
              <br />
              <div>
                <TextField
                required
                  fullWidth
                  id="standard-basic"
                  label="Product Price"
                  variant="standard"
                  onChange={handleChange}
                  name="price"
                />
              </div>
              <br />
              <div>
                <TextField
                required
                  fullWidth
                  id="standard-basic"
                  label="Product Quantity"
                  variant="standard"
                  onChange={handleChange}
                  name="quantity"
                />
              </div>
              <br />
              <div>
                <label className="image-label">Prduct image</label>
                <br/>
                <input className="image-input"
                  type="file"
                  multiple
                  accept="image/*"
                  placeholder="Product Images"
                  onChange={(e) => {
                    if (e.target.files) {
                      const selectedFiles = Array.from(e.target.files); 
                      setImages(selectedFiles);
                    }
                  }}
                  name="images"
                />
              </div>
              <br />
              <div>
                <Button variant="contained" fullWidth type="submit">
                  Upload
                </Button>
              </div>
            </div>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Upload;
