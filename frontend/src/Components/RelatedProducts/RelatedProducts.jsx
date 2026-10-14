import React, { useEffect, useState } from 'react'
import './RelatedProducts.css'
import Item from '../Item/Item'
import { API_URL } from '../../config';


const RelatedProducts = ({category}) => {
  const [related, setRelated] = useState([]);

  useEffect(()=>{
    fetch(`${API_URL}/allproducts`)
      .then((response)=>response.json())
      .then((data)=>{
        const filtered = category ? data.filter((item)=>item.category===category) : data;
        setRelated(filtered.slice(0,4));
      });
  },[category])

  return (
    <div className='relatedproducts'>
        <h1>Related Products</h1>
        <hr/>
        <div className="relatedproducts-item">
            {related.map((item,i)=>{
                return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
    </div>
  )
}
export default RelatedProducts
