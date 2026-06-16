import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill"; // Import React Quill
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { BASE_URL } from "../../Config"; // Assuming you have a config file with the base URL
import Select from "react-select";
import Swal from 'sweetalert2';  // Import SweetAlert2

const ProductCreate = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [details, setDetails] = useState(""); // Store HTML content for details
  const [masking, setMasking] = useState("");
  const [planType, setPlanType] = useState("Daily Plan");
  const [coverage, setCoverage] = useState("");
  const [categoryName, setcategoryName] = useState("");
 const [webServiceUrl, setWebServiceUrl] = useState("");
  const [externalId, setExternalId] = useState("");
 const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (planType === "Daily Plan") {
      setDuration("1 Day");
    } else if (planType === "Weekly Plan") {
      setDuration("7 Days");
    } else if (planType === "Biweekly Plan") {
      setDuration("14 Days");
    } else if (planType === "Every 3 Weeks Plan") {
      setDuration("21 Days");
    } else if (planType === "Monthly Plan") {
      setDuration("30 Days");
    } else if (planType === "Bimonthly Plan") {
      setDuration("62 Days");
    } else if (planType === "Quarterly Plan") {
      setDuration("92 Days");
    } else if (planType === "6 Month plan") {
      setDuration("180 Days");
    } else if (planType === "Yearly Plan") {
      setDuration("365 Days");
    }
  }, [planType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    const payload = {
      productName,
      price,
      duration,
      companyName,
      details,
      masking,
      planType,
      coverage,
      categoryName,
      webServiceUrl,
      externalId, 
    };
  
    try {
      const response = await axios.post(`${BASE_URL}CreateProduct`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Product created successfully", response.data);
      if (response.data.responseCode === "0000") {
        Swal.fire({
          title: 'Success!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          window.location.reload(); 
        });
      } else {
        setError("Error creating product. Please try again.");
        Swal.fire({
          title: 'Error!',
          text: response.data.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (err) {
      setError("Error creating product. Please try again.");
      console.error("There was an error!", err);
      Swal.fire({
        title: 'Error!',
        text: 'There was an issue creating the product. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
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
              <h2>Add New Product</h2>
            </div>

            <div className="card-body">
              {error && <p className="text-danger text-center">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Company Name:</label>
                    <select
                      className="form-control"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    >
                      <option value="">-- Select Company --</option>
                      <option value="Jazz_Insurance_Platform">
                        Jazz Insurance Platform
                      </option>
                      <option value="MiniApp">MiniApp</option>
                      <option value="Jazz">Jazz</option>
                      <option value="Jazz Bundle and FG">Jazz Bundle and FG</option>
                      <option value="Ufone">Ufone</option>
                      <option value="UPaisa">UPaisa</option>
                      <option value="Zong">Zong</option>
                      <option value="Telenor">Telenor</option>
                      <option value="WebDoc">WebDoc</option>
                      <option value="JazzCash">JazzCash</option>
                      <option value="HealthLine">HealthLine</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Product Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Price:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>

                  {/* Plan Type Dropdown */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Plan Type:</label>
                    <select
                      className="form-control"
                      value={planType}
                      onChange={(e) => setPlanType(e.target.value)}
                      required
                    >
                      <option value="Daily Plan">Daily Plan</option>
                      <option value="Weekly Plan">Weekly Plan</option>
                      <option value="Biweekly Plan">Biweekly Plan</option>
                      <option value="Every 3 Weeks Plan">
                        Every 3 Weeks Plan
                      </option>
                      <option value="Monthly Plan">Monthly Plan</option>
                      <option value="Bimonthly Plan">Bimonthly Plan</option>
                      <option value="Quarterly Plan">Quarterly Plan</option>
                      <option value="6 Month Plan">6 Month Plan</option>
                      <option value="Yearly Plan">Yearly Plan</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Duration:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={duration}
                      readOnly
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Masking/HelplineNo :</label>
                    <input
                      type="text"
                      className="form-control"
                      value={masking}
                      onChange={(e) => setMasking(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Coverage:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={coverage}
                      onChange={(e) => setCoverage(e.target.value)}
                      required
                    />
                  </div>

                

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Category Name:</label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      value={
                        categoryName
                          ? { label: categoryName, value: categoryName }
                          : null
                      }
                      onChange={(selected) =>
                        setcategoryName(selected ? selected.value : "")
                      }
                      options={[
                        { value: "Accidental Life Insurance", label: "Accidental Life Insurance",  },
                        { value: "Bike Insurance", label: "Bike Insurance" },
                        { value: "Car Document Insurance", label: "Car Document Insurance", },
                        { value: "Car Insurance", label: "Car Insurance" },
                        { value: "Car Key Insurance", label: "Car Key Insurance",  },
                        { value: "Crop insurance", label: "Crop insurance" },
                        { value: "CNIC insurance", label: "CNIC insurance" },
                        { value: "Dental and Vision", label: "Dental and Vision", },
                        { value: "Educational Document Insurance", label: "Educational Document Insurance", },
                        { value: "Handset Insurance", label: "Handset Insurance", },
                        { value: "Health Insurance", label: "Health Insurance",  },
                        { value: "Health Insurance & Accidental Health Insurance",
                          label: "Health Insurance & Accidental Health Insurance",
                        },
                        { value: "Home Content Insurance", label: "Home Content Insurance", },
                        { value: "Home Registry Insurance", label: "Home Registry Insurance",  },
                        { value: "Income Protection Insurance", label: "Income Protection Insurance", },
                        { value: "Life Insurance", label: "Life Insurance" },
                        { value: "Livestock Insurance", label: "Livestock Insurance", },
                        { value: "Mobile Bundle Insurance", label: "Mobile Bundle Insurance", },
                        { value: "Mobile Insurance", label: "Mobile Insurance", },
                        { value: "Pet and Vet", label: "Pet and Vet" },
                        { value: "PocketSize", label: "PocketSize" },
                        { value: "Passport Insurance", label: "Passport Insurance" },
                        { value: "RSA", label: "RSA" },
                        { value: "RSA Insurance", label: "RSA Insurance" },
                        { value: "Travel Family Insurance", label: "Travel Family Insurance", },
                        { value: "Travel Individual Insurance", label: "Travel Individual Insurance", },
                        { value: "Webdoc Health Insurance", label: "Webdoc Health Insurance", },
                        { value: "Women Health Insurance", label: "Women Health Insurance", },
                        { value: "CNIC Insurance", label: "CNIC Insurance" },
                        { value: "Passport Insurance",  label: "Passport Insurance", },
                        // { value: "Women", label: "Women" },
                      ]}
                      placeholder="-- Select or Search --"
                      isClearable
                    />
                  </div>
  <div className="col-md-6 mb-3">
                    <label className="form-label">Product Code :</label>
                    <input
                      type="text"
                      className="form-control"
                      value={webServiceUrl}
                      onChange={(e) => setWebServiceUrl(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Product Id:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={externalId}
                      onChange={(e) => setExternalId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Details/Features:</label>
                    <ReactQuill
                      value={details}
                      onChange={setDetails} // Store HTML content
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
                      required
                    />
                    <small className="form-text text-muted">
                      Use the toolbar to format your text (bold, italics, lists,
                      etc.).
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
                {loading ? "Submitting..." : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
