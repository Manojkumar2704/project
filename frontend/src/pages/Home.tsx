import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./Home.css"

const Home = () => {
    interface Product {
        _id: string;
        name: string;
        price: number;
        description:string;
        image:[string];
        quantity:number;
      }

    const [products,setProducts]=useState<Product[]>([])
    let count=1;
    const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const getProducts = async () => {
        
        try {
            const result = await axios.get("http://localhost:7000/product/allproducts", {headers});
                setProducts(result.data.result);
            
        } catch (error) {
            alert("unauthorized")
             window.location.href="/login"
        }
    };
    
    useEffect(()=>{
        getProducts();
        console.log(products);
       
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    console.log(products);

const deleteItem=async(id:string)=>{
    await axios.delete("http://localhost:7000/product/deleteproduct/"+id,{headers})
    getProducts()
}


  return (
    <div>
      <h1>Home</h1>
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
            {products.map((item)=>(
                <tr>
                    <td>{count++}</td>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.price}</td>
                    {/* <td className='img-container'>{item.image.map((item)=>(
                        <img src={item} alt='img'/>
                    ))}</td> */}
                    <td className='img-container'><img src={item.image[0]} alt='img'/></td>
                    <td>{item.quantity}</td>
                    <td><button>Edit</button></td>
                    <td><button onClick={()=>deleteItem(item._id)}>Delete</button></td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Home
