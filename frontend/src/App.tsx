import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Registration from './pages/Registration'
import Login from './pages/Login'
import Home from './pages/Home'

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route path='/home' element={<Home/>}></Route>
        <Route path='/' element={<Registration/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
      </Routes>
      </BrowserRouter>


      
    </div>
  )
}

export default App
