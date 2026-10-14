import './App.css';
import Navbar from './Components/Assets/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory  from './Pages/ShopCategory';
import  LoginSignup  from './Pages/LoginSignup';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import OrderHistory from './Pages/OrderHistory';
import Wishlist from './Pages/Wishlist';
import SearchResults from './Pages/SearchResults';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/banner_mens.png';
import women_banner from './Components/banner_women.png';
import kid_banner from './Components/banner_kids.png';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <ToastContainer position="top-right" autoClose={2500} />
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/mens' element={<ShopCategory banner={men_banner} category="men" />} />
          <Route path='/womens' element={<ShopCategory banner={women_banner} category="women" />} />
          <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kid" />} />
          <Route path='/product' element={<Product />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/orders' element={<OrderHistory />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/search' element={<SearchResults />} />
          <Route path='/login' element={<LoginSignup />} />

        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
