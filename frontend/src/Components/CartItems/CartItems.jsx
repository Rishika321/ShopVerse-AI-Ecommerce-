import React,{useContext} from 'react'
import './CartItems.css'
import {ShopContext} from '../../Context/ShopContext'
import remove_icon from '../cart_cross_icon.png'
import { Link } from 'react-router-dom'

const CartItems = () => {
    const{getTotalCartAmount,all_product,cartItems,RemoveFromCart,addToCart}=useContext(ShopContext);
  return (
    <div className='cartitems'>
        <div className="cartitems-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
        </div>
        <hr/>
        {all_product.map((e)=>{
            if(cartItems[e.id]>0){
                return <div key={e.id}>
                        <div className="cartitems-format cartitems-format-main">
                            <img src={e.image} alt="" className='carticon-product-icon'/>
                            <p>{e.name}</p>
                            <p>${e.new_price}</p>
                            <div className="cartitems-quantity-controls">
                                <button
                                    className="cartitems-qty-btn"
                                    onClick={()=>RemoveFromCart(e.id)}
                                    aria-label="Decrease quantity"
                                >-</button>
                                <span className="cartitems-quantity">{cartItems[e.id]}</span>
                                <button
                                    className="cartitems-qty-btn"
                                    onClick={()=>addToCart(e.id)}
                                    aria-label="Increase quantity"
                                >+</button>
                            </div>
                            <p>${e.new_price* cartItems[e.id]}</p>
                            <img className='cartitems-remove-icon' src={remove_icon} onClick={()=>{
                                // remove the item entirely, regardless of quantity
                                for(let i=0;i<cartItems[e.id];i++){ RemoveFromCart(e.id); }
                            }} alt=""/>
                        </div>
                        <hr/>
                    </div>
            }
            return null;
        })}
        <div className="cartitems-down">
            <div className="cartitems-total">
                <h1>Cart Totals</h1>
                <div>
                    <div className="cartitems-total-item">
                        <p>Subtotal</p>
                        <p>${getTotalCartAmount()}</p>
                    </div>
                    <hr/>
                    <div className="cartitems-total-item">
                        <p>Delivery Charges</p>
                        <p>Free Delivery</p>
                    </div>
                    <hr/>
                    <div className="cartitems-total-item">
                        <h3>Total</h3>
                        <h3>${getTotalCartAmount()}</h3>
                    </div>
                </div>
                <Link to="/checkout"><button>PROCEED TO CHECKOUT</button></Link>
            </div>
            <div className="cartitems-promocode">
                <p>If you have a promo code, Enter it here</p>
                <div className="cartitems-promobox">
                    <input type="text" placeholder='promo code'/>
                    <button>Submit</button>
                </div>
            </div>
        </div>
    </div>
  )
}
export default CartItems