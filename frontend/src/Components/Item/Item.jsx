import React, { useContext } from 'react'
import './Item.css'
import {Link} from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'

const Item = (props) => {
  const { wishlistItems, toggleWishlist } = useContext(ShopContext);
  const isWishlisted = !!wishlistItems?.[props.id];

  return (
    <div className='item'>
      <div className="item-image-wrap">
        <Link to={`/product/${props.id}`}><img onClick={()=>window.scrollTo(0,0)} src={props.image} alt=""/></Link>
        <button
          className={`item-wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={(e)=>{ e.preventDefault(); toggleWishlist(props.id); }}
          aria-label="Toggle wishlist"
        >
          {isWishlisted ? "♥" : "♡"}
        </button>
      </div>
        <p>{props.name}</p>
        <div className="item-prices">
            <div className="item-price-new">
                ${props.new_price}
            </div>
            <div className="item-price-old">
                ${props.old_price}
            </div>
        </div>
    </div>
  )
}
export default Item
