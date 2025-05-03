/* eslint-disable react/jsx-no-duplicate-props */
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAllProducts, deleteProduct, filterProducts } from '../store/slice/productSlice';
import { Link } from 'react-router-dom';
import './Home.css';
import { Navbar } from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);
  const [inputData, setInputData] = useState('');

  useEffect(() => {
    if (inputData.trim() === '') {
      dispatch(fetchAllProducts());
    } else {
      const delayDebounce = setTimeout(() => {
        dispatch(filterProducts(inputData));
      }, 1000);
      return () => clearTimeout(delayDebounce);
    }
  }, [dispatch, inputData]);

  const handleDelete = (id: string) => {
    dispatch(deleteProduct(id));
  };

  if (loading) return <h1 data-testid="loading-indicator">Loading...</h1>;
  if (error) {
    window.location.href = "/login";
    return <p data-testid="error-message">Error: {error}</p>;
  }

  return (
    <>
      <Navbar inputData={inputData} setInputData={setInputData} />
      <div className="wrapper">
        <h1 data-testid="page-title">Product List</h1>
        <Link to="/upload">
          <button className="button add-button" data-testid="add-product-button">
            Add Product
          </button>
        </Link>

        <table data-testid="product-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Image</th>
              <th>Quantity</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody data-testid="product-table-body">
            {Array.isArray(products) && products.length > 0 ? (
              products.map((item, index) => (
                <tr
                  key={item._id}
                  // data-testid={`product-row-${index}`}
                  className="product-row"
                  data-testid="product-row"
                >
                  <td data-testid="product-index">{index + 1}</td>
                  <td data-testid="product-name">{item.name}</td>
                  <td data-testid="product-description">{item.description}</td>
                  <td data-testid="product-price">{item.price}</td>
                  <td className="img-container" data-testid="product-image">
                    <img src={item.image[0]} alt="img" />
                  </td>
                  <td data-testid="product-quantity">{item.quantity}</td>
                  <td>
                    <Link to={`/update/${item._id}`}>
                      <button
                        className="button"
                        data-testid="edit-button"
                      >
                        Edit
                      </button>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="button"
                      onClick={() => handleDelete(item._id)}
                      data-testid="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr data-testid="empty-row">
                <td colSpan={8} className="empty-state" data-testid="empty-state">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default Home;
