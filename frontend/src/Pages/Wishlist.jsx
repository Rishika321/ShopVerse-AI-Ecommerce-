import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import Item from '../Components/Item/Item'
import './CSS/Wishlist.css'

const Wishlist = () => {
  const { all_product, wishlistItems } = useContext(ShopContext);

  if(!localStorage.getItem('auth-token')){
    return <div className="wishlist-empty"><h2>Please log in to view your wishlist.</h2></div>
  }

  const wishedProducts = all_product.filter((p)=>wishlistItems[p.id]);

  return (
    <div className='wishlist'>
      <h1>Your Wishlist</h1>
      {wishedProducts.length===0 ? (
        <div className="wishlist-empty"><h2>Your wishlist is empty. Tap the heart icon on any product to save it here.</h2></div>
      ) : (
        <div className="wishlist-items">
          {wishedProducts.map((item,i)=>(
            <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
          ))}
        </div>
      )}
    </div>
  )
}
export default Wishlist
