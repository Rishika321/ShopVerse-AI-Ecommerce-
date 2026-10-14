import React, { useEffect, useState } from 'react'
import './CSS/OrderHistory.css'
import { API_URL } from '../config';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(()=>{
    if(!localStorage.getItem('auth-token')){
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/myorders`,{
      method:'GET',
      headers:{ 'auth-token': localStorage.getItem('auth-token') }
    })
    .then((res)=>res.json())
    .then((data)=>{
      if(data.success){
        setOrders(data.orders);
      }else{
        setError(true);
      }
      setLoading(false);
    })
    .catch((err)=>{
      console.log(err);
      setError(true);
      setLoading(false);
    })
  },[])

  if(!localStorage.getItem('auth-token')){
    return <div className="orderhistory-empty"><h2>Please log in to view your orders.</h2></div>
  }
  if(loading){
    return <div className="orderhistory-empty"><h2>Loading your orders...</h2></div>
  }
  if(error){
    return <div className="orderhistory-empty"><h2>Couldn't load your orders. Please try again later.</h2></div>
  }
  if(orders.length===0){
    return <div className="orderhistory-empty"><h2>You haven't placed any orders yet.</h2></div>
  }

  return (
    <div className='orderhistory'>
      <h1>Your Orders</h1>
      {orders.map((order)=>(
        <div className="order-card" key={order._id}>
          <div className="order-card-header">
            <div>
              <p className="order-id">Order #{order._id.slice(-8)}</p>
              <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div className="order-status">{order.status}</div>
          </div>
          <div className="order-items">
            {order.items.map((item,i)=>(
              <div className="order-item" key={i}>
                <img src={item.image} alt={item.name}/>
                <div>
                  <p>{item.name}</p>
                  <p className="order-item-qty">Qty: {item.quantity} × ${item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="order-card-footer">
            <p>Paid with card ending in {order.cardLast4}</p>
            <h3>Total: ${order.totalAmount}</h3>
          </div>
        </div>
      ))}
    </div>
  )
}
export default OrderHistory
