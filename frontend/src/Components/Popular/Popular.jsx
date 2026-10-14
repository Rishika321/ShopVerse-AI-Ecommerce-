import React,{useState,useEffect} from 'react'
import './Popular.css'
import Item from '../Item/Item'
import { API_URL } from '../../config';
const Popular = () => {
  const[popularProducts,setPopularProducts]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(false);

  useEffect(()=>{
    fetch(`${API_URL}/popularinwomen`)
      .then((response)=>response.json())
      .then((data)=>{
        if(Array.isArray(data)){
          setPopularProducts(data);
        }else{
          setError(true);
        }
        setLoading(false);
      })
      .catch((err)=>{
        console.log(err);
        setError(true);
        setLoading(false);
      });
  },[])
  return (
    <div className='popular'>
        <h1>POPULAR IN WOMEN</h1>
        <hr/>
        {loading && <p className="section-status">Loading popular products...</p>}
        {error && <p className="section-status">Couldn't load popular products right now. Please try again later.</p>}
        {!loading && !error && popularProducts.length===0 && (
          <p className="section-status">No popular products yet - check back soon!</p>
        )}
        <div className="popular-item">
            {popularProducts.map((item,i)=>{
                return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>

            })}
        </div>
    </div>
  )
}
export default Popular
