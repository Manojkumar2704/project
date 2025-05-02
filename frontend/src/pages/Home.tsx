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

  if (loading) return <h1>Loading...</h1>;
  if (error){
    window.location.href="/login"
     return <p>Error: {error}</p>
    }

  return (
    <>
      <Navbar inputData={inputData} setInputData={setInputData} />
      <div className="wrapper">
        <h1>Product List</h1>
        <Link to="/upload">
          <button className="button add-button">Add Product</button>
        </Link>

        {products.length < 1 ? (
          <h2>No results found</h2>
        ) : (
          <table>
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
            <tbody>
              {products.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.price}</td>
                  <td className="img-container">
                    <img src={item.image[0]} alt="img" />
                  </td>
                  <td>{item.quantity}</td>
                  <td>
                    <Link to={`/update/${item._id}`}>
                      <button className="button">Edit</button>
                    </Link>
                  </td>
                  <td>
                    <button className="button" onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Home;
