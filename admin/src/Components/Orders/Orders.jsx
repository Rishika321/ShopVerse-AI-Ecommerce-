import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Orders.css'
import { API_URL } from '../../config';

const STATUS_OPTIONS = ["Paid", "Processing", "Shipped", "Delivered", "Cancelled"];

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch(`${API_URL}/allorders`, {
      headers: { 'admin-token': localStorage.getItem('admin-token') },
    })
      .then((res) => {
        if (res.status === 401) {
          alert("Your admin session has expired. Please log in again.");
          localStorage.removeItem('admin-token');
          navigate('/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.success) {
          setOrders(data.orders);
        } else if (data) {
          setError(data.errors || "Could not load orders");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not reach the backend. Is it running?");
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_URL}/updateorderstatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'admin-token': localStorage.getItem('admin-token'),
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.status === 401) {
        alert("Your admin session has expired. Please log in again.");
        localStorage.removeItem('admin-token');
        navigate('/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
      } else {
        alert(data.errors || "Could not update order status");
      }
    } catch (err) {
      console.error(err);
      alert("Could not reach the backend.");
    }
    setUpdatingId(null);
  }

  if (loading) return <div className="admin-orders"><p>Loading orders...</p></div>;
  if (error) return <div className="admin-orders"><p className="admin-orders-error">{error}</p></div>;

  return (
    <div className="admin-orders">
      <h1>All Orders ({orders.length})</h1>
      {orders.length === 0 && <p>No orders have been placed yet.</p>}
      {orders.map((order) => (
        <div className="admin-order-card" key={order._id}>
          <div className="admin-order-header">
            <div>
              <p className="admin-order-id">Order #{order._id.slice(-8)}</p>
              <p className="admin-order-date">{new Date(order.date).toLocaleString()}</p>
              {order.customer && (
                <p className="admin-order-customer">{order.customer.name} - {order.customer.email}</p>
              )}
            </div>
            <select
              value={order.status}
              onChange={(e) => updateStatus(order._id, e.target.value)}
              disabled={updatingId === order._id}
              className="admin-order-status-select"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="admin-order-items">
            {order.items.map((item, i) => (
              <div className="admin-order-item" key={i}>
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <p className="admin-order-item-qty">Qty: {item.quantity} x ${item.price}</p>
                </div>
              </div>
            ))}
          </div>

          {order.address && order.address.fullName && (
            <div className="admin-order-address">
              <strong>Ship to:</strong> {order.address.fullName}, {order.address.street}, {order.address.city} {order.address.zip}
            </div>
          )}

          <div className="admin-order-footer">
            <p>Payment: {order.paymentMethod} (ending in {order.cardLast4})</p>
            <h3>Total: ${order.totalAmount}</h3>
          </div>
        </div>
      ))}
    </div>
  )
}
export default Orders
