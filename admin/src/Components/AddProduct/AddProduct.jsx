// import React ,{useState} from 'react'
// import './AddProduct.css'
// import upload_area from '../../assets/upload_area.svg'


// const AddProduct = () => {
//     const [image,setImage]=useState(false);
//     const[productDetails,setProductDetails]=useState({
//         name:"",
//         image:"",
//         category:"",
//         new_price:"",
//         old_price:""
//     })
//     const imageHandler=(e)=>{
//         setImage(e.target.files[0]);

//     }
//     const changeHandler=(e)=>{
//         setProductDetails({...productDetails,[e.target.name]:e.target.value})
//     }

//     const Add_Product=async()=>{
//         console.log(productDetails);
//         let responseData;
//         let product=productDetails;
//         let formData=new FormData();
//         formData.append('product',image);
//         await fetch(`${API_URL}/upload`,{
//             method:'POST',
//             headers:{
//                 Accept:'application/json',
//             },
//             body:formData,
//         }).then((res)=>res.json()).then((data)=>{responseData=data})
//         if(responseData.success){
//             product.image=responseData.image_url;
//             console.log(product);
//             await fetch(`${API_URL}/addproduct`,{
//                 method:'POST',
//                 headers:{
//                     Accept:'application/json',
//                     'Content-Type':'application/json',

//                 },
//                 body:JSON.stringify(product),
//             }).then((res)=>res.json()).then((data)=>{
//                 data.success?alert("Product Added"):alert("Failed")
//             })
//         }
//     }




//   return (
//     <div className='add-product'>
//         <div className="addproduct-itemfield">
//             <p>Product title</p>
//             <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here'/>
//         </div>
//         <div className="addproduct-price">
//             <div className="addproduct-itemfield">
//             <p>Price</p>
//             <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type here'/>
//         </div>
//             <div className="addproduct-itemfield">
//             <p>Offer Price</p>
//             <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder='Type here'/>
//         </div>
//     </div>
//     <div className="addproduct-itemfield">
//         <p>Product Category</p>
//         <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
//             <option value="women">Women</option>
//             <option value="men">Men</option>
//             <option value="kid">kid</option>
//         </select>

//     </div>
//     <div className="addproduct-itemfield">
//         <label htmlFor='file-input'>
//             <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img'alt=""/>
//         </label>
//         <input onChange={imageHandler} type="file" name='image' id='file-input' hidden/>

//     </div>
//     <button onClick={()=>{Add_Product()}} className='addproduct-btn'>ADD</button>
//     </div>

//   )
// }

// export default AddProduct




import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import { API_URL } from '../../config';

const AddProduct = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women", // default selected
    description: "",
    new_price: "",
    old_price: "",
  });
  const [generatingDescription, setGeneratingDescription] = useState(false);

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setProductDetails({
      name: "",
      image: "",
      category: "women",
      description: "",
      new_price: "",
      old_price: "",
    });
    setImage(false);
  };

  const generateDescription = async () => {
    if (!productDetails.name || !productDetails.category) {
      alert("Please fill in the product title and category first.");
      return;
    }
    setGeneratingDescription(true);
    try {
      const res = await fetch(`${API_URL}/generatedescription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("admin-token"),
        },
        body: JSON.stringify({
          name: productDetails.name,
          category: productDetails.category,
          new_price: productDetails.new_price,
          old_price: productDetails.old_price,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProductDetails({ ...productDetails, description: data.description });
      } else {
        alert(data.errors || "Could not generate description");
      }
    } catch (err) {
      console.error(err);
      alert("Could not reach the AI description service. Is the backend running?");
    }
    setGeneratingDescription(false);
  };

  const Add_Product = async () => {
    try {
      console.log("Initial product details:", productDetails);

      // 1. Upload image first
      let formData = new FormData();
      formData.append("product", image);

      let uploadResponse = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "admin-token": localStorage.getItem("admin-token"),
        },
        body: formData,
      });

      let uploadData = await uploadResponse.json();

      if (uploadResponse.status === 401) {
        alert("Your admin session has expired. Please log in again.");
        localStorage.removeItem("admin-token");
        navigate("/login");
        return;
      }

      if (!uploadData.success) {
        alert("Image upload failed");
        return;
      }

      // 2. Prepare product object
      let product = {
        ...productDetails,
        image: uploadData.image_url,
        new_price: Number(productDetails.new_price),
        old_price: Number(productDetails.old_price),
      };

      console.log("Final product to send:", product);

      // 3. Send to backend
      let addResponse = await fetch(`${API_URL}/addproduct`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("admin-token"),
        },
        body: JSON.stringify(product),
      });

      let addData = await addResponse.json();

      if (addData.success) {
        alert("Product Added Successfully ✅");
        resetForm(); // clear inputs
      } else {
        alert("Failed to add product ❌");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="number"
            name="old_price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="number"
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <div className="addproduct-description-header">
          <p>Description</p>
          <button
            type="button"
            className="addproduct-ai-btn"
            onClick={generateDescription}
            disabled={generatingDescription}
          >
            {generatingDescription ? "Generating..." : "✨ Generate with AI"}
          </button>
        </div>
        <textarea
          name="description"
          value={productDetails.description}
          onChange={changeHandler}
          placeholder="Fill in the title and category, then click 'Generate with AI' - or write your own here"
          rows={4}
          className="addproduct-description-textarea"
        />
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumbnail-img"
            alt=""
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>

      <button onClick={Add_Product} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
