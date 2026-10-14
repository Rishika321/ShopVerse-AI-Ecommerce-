import React, { useContext, useState ,useRef} from 'react'
import './Navbar.css'
import logo from '../../logo.png';
import cart_icon from '../../cart_icon.png';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../../Context/ShopContext';
import nav_dropdown from '../../nav_dropdown.png';


const Navbar = () => {
  const[menu,setMenu]=useState("shop");
  const {getTotalCartItems}=useContext(ShopContext);
  const menuRef=useRef();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const dropdown_toggle=(e)=>{
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
    
  }

  const handleSearch=(e)=>{
    e.preventDefault();
    if(searchQuery.trim()){
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }



  return (
    <div className='navbar'>
        <div className='nav-logo'>
        <img src={logo} alt=""/>
        <p>ShopVerse</p>
        </div>

        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Try 'warm jacket under $50'..."
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
          />
          <button type="submit">✨ Search</button>
        </form>

        <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt=""/>
        <ul ref={menuRef} className="nav-menu">
            <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration: 'none'}} to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>} </li>
            <li onClick={()=>{setMenu("mens")}}><Link style={{textDecoration: 'none'}}  to='/mens'>Men</Link> {menu==="mens"?<hr/>:<></>} </li>
            <li onClick={()=>{setMenu("womens")}}><Link style={{textDecoration: 'none'}} to='/womens'>Women</Link> {menu==="womens"?<hr/>:<></>} </li>
            <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration: 'none'}}  to='/kids'>kids</Link>{menu==="kids"?<hr/>:<></>} </li>
            {localStorage.getItem('auth-token') && (
              <>
                <li onClick={()=>{setMenu("wishlist")}}><Link style={{textDecoration: 'none'}} to='/wishlist'>Wishlist</Link>{menu==="wishlist"?<hr/>:<></>} </li>
                <li onClick={()=>{setMenu("orders")}}><Link style={{textDecoration: 'none'}} to='/orders'>Orders</Link>{menu==="orders"?<hr/>:<></>} </li>
              </>
            )}
        </ul>
       
        <div className="nav-login-cart">
        {localStorage.getItem('auth-token') ? (<button onClick={() => {localStorage.removeItem('auth-token');  window.location.replace('/'); }}>  Logout </button>) : ( <Link to="/login">  <button>Login</button>  </Link>)}

          
          <div className="nav-cart"> 
            <Link to='/cart'><img src={cart_icon} alt="cart" /></Link>
            <div className="nav-cart-count">{getTotalCartItems()}</div>
          </div>
        </div>
       </div>


    
  )
}
export default Navbar
