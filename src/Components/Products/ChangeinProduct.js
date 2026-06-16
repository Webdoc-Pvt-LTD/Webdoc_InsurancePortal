import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../Config";
import Swal from 'sweetalert2';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ChangeinProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    id: '',
    productName: '',
    companyName: '',
    price: '',
    masking: '',
    planType: '',
    coverage: '',
    details: '',
    productCode: '',
    productId
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productId) {
      setLoading(true);
      axios.get(`${BASE_URL}ProductbyId?productId=${productId}`)
        .then((response) => {
          if (response.data && response.data.product) {
            const productData = response.data.product;
            const formattedPrice = productData.price.replace('Rs.', '').trim();
            setProduct({ ...productData, price: formattedPrice });
          } else {
            setError('Product not found.');
          }
        })
        .catch((err) => {
          console.error('Error fetching product:', err);
          setError('Error fetching product details.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...product,
      price: `Rs.${product.price}`,
      duration: "1 Day", // Or dynamic duration logic
    };

    const params = new URLSearchParams(payload).toString();

    try {
      const response = await axios.post(`${BASE_URL}ProductEdit?${params}`, {}, {
        headers: { accept: "*/*" },
      });

      if (response.data?.responseCode === '0000') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message || 'Product updated successfully!',
        }).then(() => {
          navigate('/Product');
        });
      } else {
        Swal.fire({
          icon: response.data?.responseCode === '0001' ? 'warning' : 'error',
          title: response.data?.responseCode === '0001' ? 'Warning' : 'Error',
          text: response.data.message || 'There was an issue updating the product.',
        });
      }
    } catch (err) {
      console.error('Error updating product:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error updating the product.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white text-center">
              <h2>Edit Product</h2>
            </div>

            <div className="card-body">
              {error && <p className="text-danger text-center">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Product ID */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">ID:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={product.id}
                      readOnly
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Product Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="productName"
                      value={product.productName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Product Status:</label>
                   <select
                          className="form-control"
                          name="status"
                          value={product.status}
                          onChange={handleChange}
                          required
                        >
                    <option value="">-- Select Status --</option>
                    <option value="Active">Active</option>
                    <option value="In-Active">In-Active</option>
                  </select>

                  </div>

                 <div className="col-md-6 mb-3">
                    <label className="form-label">Company Name:</label>
                     <select
                            className="form-control"
                            name="companyName"
                            value={product.companyName}
                            onChange={handleChange}
                            required
                          >
                <option value="">-- Select Company --</option>
                <option value="Jazz_Insurance_Platform">Jazz Insurance Platform</option>
                <option value="MiniApp">MiniApp</option>
                <option value="Jazz">Jazz</option>
                <option value="Ufone">Ufone</option>
                <option value="UPaisa">UPaisa</option>
                <option value="Zong">Zong</option>
                <option value="Telenor">Telenor</option>
                <option value="WebDoc">WebDoc</option>
                <option value="JazzCash">JazzCash</option>
                <option value="HealthLine">HealthLine</option>
                <option value={product.companyName}>
                  {product.companyName} {/* This ensures the current saved value is also visible even if it's not in the list */}
                </option>
              </select>

                                </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Price:</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Masking/HelplineNo:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="masking"
                      value={product.masking}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Product Id:</label>
                    <input
                      type="number"
                      className="form-control"
                      name="externalId"
                      value={product.externalId}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Product Code:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="webServiceUrl"
                      value={product.webServiceUrl}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Plan Type:</label>
                    <select
                      className="form-control"
                      name="planType"
                      value={product.planType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Plan Type --</option>
                      <option value="Daily">Daily</option>
                      <option value="Monthly">Monthly</option>
                      <option value="6 Month">6 Month</option>
                      <option value="Yearly">Yearly</option>
                       <option value={product.planType}>
                  {product.planType}</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Coverage:</label>
                    <input
                      type="number"
                      className="form-control"
                      name="coverage"
                      value={product.coverage}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-12 mb-3">
                    <label className="form-label">Details/Features:</label>
                    <ReactQuill
                      value={product.details}
                      onChange={(value) => handleChange({ target: { name: "details", value } })}
                      modules={{
                        toolbar: [
                          [{ header: "1" }, { header: "2" }, { font: [] }],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["bold", "italic", "underline"],
                          ["link"],
                          [{ align: [] }],
                          ["image"],
                        ],
                      }}
                      className="form-control"
                      style={{ height: "250px" }}
                    />
                    <small className="form-text text-muted">
                      Use the toolbar to format your text (bold, italics, lists, etc.).
                    </small>
                  </div>
                </div>
              </form>
            </div>

            <div className="card-footer text-center">
              <button
                type="submit"
                className="btn btn-primary w-100"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeinProduct;
