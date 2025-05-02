import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


export interface Product {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  image: string[];
  price: number;
}

interface ProductState {
  products: Product[];
  product?: Product;
  loading: boolean;
  error: string | null;
}

interface UpdateProductParams {
  id: string;
  data: {
    name: string;
    price: number;
    description: string;
    quantity: number;
  };
  files: File[];
}

interface AddProductArgs {
  data: {
    name: string;
    price: string;
    description: string;
    quantity: string;
  };
  files: File[];
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchAllProducts = createAsyncThunk<Product[]>(
  'products/fetchAll',
  async () => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/allproducts`, { headers });
    return res.data.result;
  }
);


export const fetchOneProduct = createAsyncThunk<Product, string>(
  'products/fetchOne',
  async (id) => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getone/${id}`, { headers });
    return res.data;
  }
);


export const deleteProduct = createAsyncThunk<string, string>(
  'products/delete',
  async (id) => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await axios.delete(`${process.env.REACT_APP_API_URL}/product/deleteproduct/${id}`, { headers });
    return id;
  }
);

export const addProduct = createAsyncThunk<void, AddProductArgs>(
  'products/add',
  async ({ data, files }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price);
      formData.append('description', data.description);
      formData.append('quantity', data.quantity);

      files.forEach((file) => {
        formData.append('images', file); 
      });

      const token = localStorage.getItem('token');
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      await axios.post(`${process.env.REACT_APP_API_URL}/product/uploads`, formData, {
        headers,
      });
    }catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          return rejectWithValue(error.response.data.message);
        } else if (error instanceof Error) {
          return rejectWithValue(error.message);
        } else {
          return rejectWithValue("An unknown error occurred");
        }
      }
  }
);

export const updateProduct = createAsyncThunk<Product, UpdateProductParams>(
  'products/update',
  async ({ id, data, files }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    formData.append('description', data.description);
    formData.append('quantity', data.quantity.toString());
    files.forEach((file) => {
      formData.append('images', file);
    });

    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/product/updateproduct/${id}`,
      formData,
      { headers }
    );
    return res.data;
  }
);

export const deleteImage = createAsyncThunk(
    'product/deleteImage',
    async ({ imageUrl, productId }: { imageUrl: string, productId: string }, { rejectWithValue }) => {
        const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
      try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/product/delete-image`, {
          params: { imageUrl, productId },headers
        });
        return response.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          return rejectWithValue(error.response.data.message);
        } else if (error instanceof Error) {
          return rejectWithValue(error.message);
        } else {
          return rejectWithValue("An unknown error occurred");
        }
      }
    }
  );

  export const filterProducts = createAsyncThunk<Product[], string>(
    'products/filter',
    async (filter, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/filter`, { filter }, { headers });
        return res.data.result;
      }catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          return rejectWithValue(error.response.data.message);
        } else if (error instanceof Error) {
          return rejectWithValue(error.message);
        } else {
          return rejectWithValue("An unknown error occurred");
        }
      }
    }
  );


const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fetch failed';
      })
      .addCase(fetchOneProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.product = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const updated = action.payload;
        state.products = state.products.map((p) => (p._id === updated._id ? updated : p));
        state.product = updated;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload.productId
        );
      })
      .addCase(deleteImage.rejected, (state) => {
        state.loading = false;
      })
      .addCase(filterProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(filterProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default productSlice.reducer;
