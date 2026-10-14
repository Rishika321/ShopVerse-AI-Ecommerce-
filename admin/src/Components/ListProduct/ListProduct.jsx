import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../config';

const ListProduct = () => {

  const navigate = useNavigate();
  const[allproducts,setAllProducts]=useState([]);
  const [bulkGenerating, setBulkGenerating] = useState(false);

  const fetchInfo=async()=>{
    await fetch(`${API_URL}/allproducts`).then((res)=>res.json()).then((data)=>{setAllProducts(data)});
  }
  useEffect(()=>{
    fetchInfo();
  },[])

  const remove_product=async(id)=>{
    const res = await fetch(`${API_URL}/removeproduct`,{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json',
        'admin-token': localStorage.getItem('admin-token'),
      },
      body:JSON.stringify({id:id})

    })
    if(res.status === 401){
      alert("Your admin session has expired. Please log in again.");
      localStorage.removeItem('admin-token');
      navigate('/login');
      return;
    }
    await fetchInfo();

  }

  const missingCount = allproducts.filter((p)=> !p.description || !p.description.trim()).length;

  const generateMissingDescriptions = async () => {
    if(missingCount === 0){
      alert("Every product already has a description!");
      return;
    }
    if(!window.confirm(`This will generate AI descriptions for ${missingCount} product(s) missing one. This may take a minute or two. Continue?`)){
      return;
    }
    setBulkGenerating(true);
    try{
      const res = await fetch(`${API_URL}/bulkgeneratedescriptions`, {
        method: 'POST',
        headers: {
          'admin-token': localStorage.getItem('admin-token'),
        },
      });
      if(res.status === 401){
        alert("Your admin session has expired. Please log in again.");
        localStorage.removeItem('admin-token');
        navigate('/login');
        setBulkGenerating(false);
        return;
      }
      const data = await res.json();
      if(data.success){
        alert(`Done! Updated ${data.updated} of ${data.total} product(s).${data.failed > 0 ? ` ${data.failed} failed - you can run this again to retry those.` : ''}`);
        await fetchInfo();
      }else{
        alert(data.errors || "Bulk generation failed");
      }
    }catch(err){
      console.error(err);
      alert("Could not reach the backend. Is it running?");
    }
    setBulkGenerating(false);
  }

  return (
    <div className='list-product'>
      <div className="listproduct-header">
        <h1>All Products List</h1>
        <button
          className="listproduct-bulk-ai-btn"
          onClick={generateMissingDescriptions}
          disabled={bulkGenerating}
        >
          {bulkGenerating
            ? "Generating descriptions..."
            : `✨ Generate Missing Descriptions (${missingCount})`}
        </button>
      </div>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Description</p>
        <p>Edit</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr/>
        {allproducts.map((product,index)=>{
          return <> 
            <div key={index} className="listproduct-format-main listproduct-format" >
            <img src={product.image} alt="" className="listproduct-product-icon" />
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <p className={product.description && product.description.trim() ? "listproduct-has-desc" : "listproduct-no-desc"}>
              {product.description && product.description.trim() ? "✓ Yes" : "✗ Missing"}
            </p>
            <Link to={`/editproduct/${product.id}`} className="listproduct-edit-link">Edit</Link>
             <img onClick={()=>{remove_product(product.id)}}className='listproduct-remove-icon' src={cross_icon} alt=""/>
          </div>
          <hr/>
          </>
        })}
      
       
       

      </div>

    </div>
  )
}

export default ListProduct
