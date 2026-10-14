import React,{useContext,useState,useEffect} from 'react';
import './ProductDisplay.css';
import star_icon from '../star_icon.png';
import star_dull_icon from '../star_dull_icon.png';
import  {ShopContext} from '../../Context/ShopContext';
import { toast } from 'react-toastify';
import { API_URL } from '../../config';

const ProductDisplay = ({ product }) => {   
  const {addToCart} = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState(null);
  const [rating, setRating] = useState({ average: 0, count: 0 });

  useEffect(()=>{
    fetch(`${API_URL}/reviews/${product.id}`)
      .then((res)=>res.json())
      .then((data)=>{
        if(data.success){
          setRating({ average: data.average, count: data.count });
        }
      })
      .catch((err)=>console.log(err));
  },[product.id])
  return (
    <div className='productdisplay'>
      {/* Left Side - Product Images */}
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="product" />
          <img src={product.image} alt="product" />
          <img src={product.image} alt="product" />
          <img src={product.image} alt="product" />
        </div>
        <div className="productdisplay-img">
          <img className='productdisplay-main-img' src={product.image} alt="product" />
        </div>
      </div>

      {/* Right Side - Product Details */}
      <div className="productdisplay-right">
        {/* Product Name */}
        <h1>{product.name}</h1>

        {/* Product Rating */}
        <div className="productdisplay-right-stars">
          {[1,2,3,4,5].map((i)=>(
            <img key={i} src={i <= Math.round(rating.average) ? star_icon : star_dull_icon} alt="star" />
          ))}
          <p>({rating.count})</p>
        </div>

        {/* Prices */}
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            ${product.old_price}
          </div>
          <div className="productdisplay-right-price-new">
            ${product.new_price}
          </div>
        </div>

        {/* Product Description */}
        <div className="productdisplay-right-description">
          {product.description && product.description.trim()
            ? product.description
            : "No description available for this product yet."}
        </div>

        {/* Size Selection */}
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            {["S","M","L","XL","XXL"].map((size)=>(
              <div
                key={size}
                className={selectedSize===size ? "active" : ""}
                onClick={()=>setSelectedSize(size)}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button onClick={()=>{
          if(!selectedSize){
            toast.warning("Please select a size before adding to cart");
            return;
          }
          addToCart(product.id);
        }}>ADD TO CART</button>

        {/* Category & Tags */}
        <p className='productdisplay-right-category'>
          <span>Category:</span> Women, T-Shirt, Crop Top
        </p>
        <p className='productdisplay-right-category'>
          <span>Tags:</span> Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
