import React, { useEffect,useState } from 'react'
import './NewCollections.css'
import Item from '../Item/Item'
import { API_URL } from '../../config';
const NewCollections = () => {
  const [new_collection,setNew_collection]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(false);

  useEffect(()=>{
    fetch(`${API_URL}/newcollections`)
      .then((response)=>response.json())
      .then((data)=>{
        if(Array.isArray(data)){
          setNew_collection(data);
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
    <div className='new-collections'>
        <h1>NEW COLLECTIONS</h1>
        <hr/>
        {loading && <p className="section-status">Loading new collections...</p>}
        {error && <p className="section-status">Couldn't load new collections right now. Please try again later.</p>}
        {!loading && !error && new_collection.length===0 && (
          <p className="section-status">No new collections yet - check back soon!</p>
        )}
        <div className="collections">
            {new_collection.map((item,i)=>{
                return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
    </div>
  )
}
export default NewCollections
