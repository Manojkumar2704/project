import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Update from "./pages/Update";


const App = () => {
  return (
    <BrowserRouter>
     
      <Routes>
        
        <Route path="/" element={<Registration />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/upload" element={<Upload/>}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/update/:id" element={<Update/>}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
