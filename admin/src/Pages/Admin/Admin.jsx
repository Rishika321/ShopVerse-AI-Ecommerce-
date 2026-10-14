import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import {Routes,Route,useLocation,Navigate} from 'react-router-dom'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import EditProduct from '../../Components/EditProduct/EditProduct'
import Orders from '../../Components/Orders/Orders'
import Login from '../Login/Login'
import ProtectedRoute from '../../Components/ProtectedRoute/ProtectedRoute'



const Admin = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === '/login';

  return (
    <div className='admin'>
        {!hideSidebar && <Sidebar/>}
        <Routes>
          <Route path='/' element={<Navigate to={localStorage.getItem('admin-token') ? '/addproduct' : '/login'} replace/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/addproduct' element={<ProtectedRoute><AddProduct/></ProtectedRoute>} />
          <Route path='/listproduct' element={<ProtectedRoute><ListProduct/></ProtectedRoute>}/>
          <Route path='/editproduct/:id' element={<ProtectedRoute><EditProduct/></ProtectedRoute>}/>
          <Route path='/orders' element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
        </Routes>
    </div>
  )
}

export default Admin
