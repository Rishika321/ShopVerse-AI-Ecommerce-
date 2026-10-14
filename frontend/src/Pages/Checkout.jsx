import React, { useContext, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './CSS/Checkout.css'
import { API_URL } from '../config';

const Checkout = () => {
  const { getTotalCartAmount, clearCartAfterExternalPayment } = useContext(ShopContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState({ fullName:'', street:'', city:'', zip:'' });
  const [processing, setProcessing] = useState(false);
  const [placed, setPlaced] = useState(false);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  }

  const addressIsComplete = address.fullName && address.street && address.city && address.zip;

  // Real Razorpay integration running in TEST MODE - opens Razorpay's own checkout modal.
  // No real money moves since test API keys are used; Razorpay shows a mock bank page
  // with Success/Failure buttons instead of a real bank login.
  const handleRazorpayPay = async () => {
    if(!localStorage.getItem('auth-token')){
      toast.info("Please log in before checking out.");
      navigate('/login');
      return;
    }
    if(!addressIsComplete){
      toast.warning("Please fill in your shipping address.");
      return;
    }
    if(!window.Razorpay){
      toast.error("Razorpay hasn't finished loading yet. Please refresh the page and try again.");
      return;
    }

    setProcessing(true);
    try{
      const res = await fetch(`${API_URL}/createrazorpayorder`, {
        method: 'POST',
        headers: {
          'auth-token': localStorage.getItem('auth-token'),
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setProcessing(false);

      if(!data.success){
        toast.error(data.errors || "Could not start Razorpay checkout");
        return;
      }

      const options = {
        key: data.key_id,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "ShopVerse",
        description: "Order Payment (Razorpay Test Mode)",
        order_id: data.order.id,
        handler: async function (response) {
          try{
            const verifyRes = await fetch(`${API_URL}/verifyrazorpaypayment`, {
              method: 'POST',
              headers: {
                'auth-token': localStorage.getItem('auth-token'),
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                address,
              }),
            });
            const verifyData = await verifyRes.json();
            if(verifyData.success){
              clearCartAfterExternalPayment();
              toast.success("Payment verified! Order placed.");
              setPlaced(true);
              setTimeout(()=>navigate('/orders'), 1800);
            }else{
              toast.error(verifyData.errors || "Payment verification failed");
            }
          }catch(err){
            console.log(err);
            toast.error("Could not verify payment. Please contact support if you were charged.");
          }
        },
        prefill: {
          name: address.fullName,
        },
        theme: { color: "#ff4141" },
        modal: {
          ondismiss: function(){
            toast.info("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function(){
        toast.error("Payment failed. Please try again.");
      });
      rzp.open();
    }catch(err){
      console.log(err);
      setProcessing(false);
      toast.error("Could not start Razorpay checkout. Is your backend running?");
    }
  }

  if(placed){
    return (
      <div className="checkout-success">
        <h1>✓ Payment Successful</h1>
        <p>This was a test-mode payment - no real money was charged.</p>
        <p>Redirecting you to your orders...</p>
      </div>
    )
  }

  return (
    <div className='checkout'>
      <h1>Checkout</h1>
      <p className="checkout-demo-note">This store runs on Razorpay's Test Mode - a real payment gateway integration, but with test API keys so no real money ever moves.</p>

      <div className="checkout-section">
        <h2>Shipping Address</h2>
        <input name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleAddressChange} required/>
        <input name="street" placeholder="Street Address" value={address.street} onChange={handleAddressChange} required/>
        <div className="checkout-row">
          <input name="city" placeholder="City" value={address.city} onChange={handleAddressChange} required/>
          <input name="zip" placeholder="ZIP Code" value={address.zip} onChange={handleAddressChange} required/>
        </div>
      </div>

      <div className="checkout-section">
        <h2>Payment</h2>
        <p className="checkout-razorpay-note">
          You'll be shown Razorpay's real checkout window in <strong>Test Mode</strong>. Use any test card
          (e.g. <code>4111 1111 1111 1111</code>, any future expiry, any CVV) or the built-in mock Success/Failure buttons - no real card is needed and nothing is charged.
        </p>
        <div className="checkout-summary">
          <h2>Total: ${getTotalCartAmount()}</h2>
        </div>
        <button type="button" onClick={handleRazorpayPay} disabled={processing}>
          {processing ? "Starting checkout..." : `Pay with Razorpay - $${getTotalCartAmount()}`}
        </button>
      </div>
    </div>
  )
}
export default Checkout
