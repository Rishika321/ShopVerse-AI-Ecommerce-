import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../AddProduct/AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import { API_URL } from '../../config';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [image, setImage] = useState(false); // new image file, if the admin chooses to replace it
  const [productDetails, setProductDetails] = useState({
    id: "",
    name: "",
    image: "",
    category: "women",
    description: "",
    new_price: "",
    old_price: "",
  });
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProductDetails(data.product);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
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

  const handleSessionExpired = () => {
    alert("Your admin session has expired. Please log in again.");
    localStorage.removeItem("admin-token");
    navigate("/login");
  };

  const Save_Product = async () => {
    setSaving(true);
    try {
      let imageUrl = productDetails.image;

      // Only upload a new image if the admin selected a replacement file
      if (image) {
        let formData = new FormData();
        formData.append("product", image);
        const uploadResponse = await fetch(`${API_URL}/upload`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "admin-token": localStorage.getItem("admin-token"),
          },
          body: formData,
        });
        if (uploadResponse.status === 401) return handleSessionExpired();
        const uploadData = await uploadResponse.json();
        if (!uploadData.success) {
          alert("Image upload failed");
          setSaving(false);
          return;
        }
        imageUrl = uploadData.image_url;
      }

      const updateResponse = await fetch(`${API_URL}/updateproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("admin-token"),
        },
        body: JSON.stringify({
          ...productDetails,
          image: imageUrl,
          new_price: Number(productDetails.new_price),
          old_price: Number(productDetails.old_price),
        }),
      });
      if (updateResponse.status === 401) return handleSessionExpired();
      const updateData = await updateResponse.json();
      if (updateData.success) {
        alert("Product updated successfully ✅");
        navigate("/listproduct");
      } else {
        alert(updateData.errors || "Could not update product");
      }
    } catch (err) {
      console.error(err);
      alert("Could not reach the backend. Is it running?");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="add-product"><p>Loading product...</p></div>;
  }
  if (notFound) {
    return (
      <div className="add-product">
        <p>Product not found.</p>
        <Link to="/listproduct">Back to product list</Link>
      </div>
    );
  }

  return (
    <div className="add-product">
      <h2 style={{ marginBottom: 20 }}>Edit Product #{productDetails.id}</h2>
      <div className="addproduct-itemfield">
        <p>Product title</p>
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
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
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
        <p>Current Image</p>
        <img
          src={image ? URL.createObjectURL(image) : productDetails.image}
          className="addproduct-thumbnail-img"
          alt=""
        />
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumbnail-img"
            alt=""
            style={{ marginLeft: 20, cursor: "pointer", opacity: 0.85 }}
          />
        </label>
        <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
        <p style={{ fontSize: 12, color: "#818181", marginTop: 6 }}>
          Click the second image to upload a replacement (optional - leave as-is to keep the current image)
        </p>
      </div>

      <button onClick={Save_Product} className="addproduct-btn" disabled={saving}>
        {saving ? "Saving..." : "SAVE CHANGES"}
      </button>
    </div>
  );
};

export default EditProduct;
