import React from 'react'
import './Sidebar.css'
import {Link, useNavigate} from 'react-router-dom'
import add_product_icon from '../../assets/Product_Cart.svg'
import list_product_icon from '../../assets/Product_list_icon.svg'

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    navigate('/login');
  }

  return (
    <div className='sidebar'>
        <div className="sidebar-brand">
          <p className="sidebar-brand-name">ShopVerse</p>
          <p className="sidebar-brand-tag">Admin Console</p>
        </div>

        <Link to={'/addproduct'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <img src={add_product_icon} alt=""/>
            <p>Add Product</p>
        </div>
        </Link>
           <Link to={'/listproduct'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <img src={list_product_icon} alt=""/>
            <p>Product List</p>
        </div>
        </Link>
        <Link to={'/orders'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <img src={list_product_icon} alt=""/>
            <p>Orders</p>
        </div>
        </Link>
        <div className="sidebar-item sidebar-logout" onClick={handleLogout}>
            <p>Logout</p>
        </div>
    </div>
  )
}

export default Sidebar
