import { Link, useNavigate } from "react-router-dom";
import Header from "../../Components/Website/Header";
import "../../Css/base/CheckOut.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl, ORDERS } from "../../Api/Api";
import Cookie from "cookie-universal";
import Swal from "sweetalert2";

export default function CheckOut() {
  const cookie = Cookie();
  const token = cookie.get("e-commerce");
  const nav = useNavigate();
  const [err, setErr] = useState("");
  const cities = [
    "Cairo",
    "Alexandria",
    "Giza",
    "Luxor",
    "Aswan",
    "Hurghada",
    "Sharm El-Sheikh",
    "Port Said",
    "Ismailia",
    "Suez",
  ];

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    phone: "01",
    street: "",
    city: "",
    payment: "",
  });

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("product")) || [];
    setProducts(storedProducts);
  }, []);

  async function handelSubmit(e) {
    e.preventDefault();
    console.log(products);

    const data = { 
        address: form.street || "",
        phone: form.phone || "",
        city: form.city || "",
        paymentMethodType: form.payment || "",
      
    };
    console.log("data",data);
    try {
      const res = await axios.post(`${baseUrl}/orders/cashOrder`, data, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      console.log(res);
      if (res.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "تم انشاء الطلب بنجاح! توجه الى صفحة الطلبات ",
          showConfirmButton: false,
          timer: 2500
        });
        window.localStorage.removeItem("product");
        nav("/", { replace: true });
      }
    } catch (err) {
      // setErr("Error:", err.response ? err.response.message : err.message);
      nav();
    }
  }

  // console.log(setErr);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  console.log(form, "form");
  return (
    <>
      <Header />
      <div className="container basket-items">
        <div className="tabble">
          <table className="table-items">
            <thead>
              <tr>
                <th>Product Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <img src={product.imageCover} alt={product.title} />
                    </td>
                    <td>{product.title}</td>
                    <td>{product.description || "No description available"}</td>
                    <td>
                      <span>{product.quantity}</span>
                    </td>
                    <td>{product.price} EGP</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No products in the cart.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="checkout-fin">
          <div className="container">
            <form onSubmit={handelSubmit}>
              <div className="tel">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder="Enter Your Phone Number..."
                  value={form.phone}
                  onChange={(e) => {
                    // السماح بالأرقام فقط
                    const onlyNumbers = e.target.value.replace(/\D/g, "");
                    if (onlyNumbers.length <= 11) {
                      handleChange({
                        target: { name: "phone", value: onlyNumbers },
                      });
                    }
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, ""); // منع الأحرف غير الرقمية
                  }}
                  pattern="[0-9]{11}"
                  minLength={11}
                  maxLength={11}
                  required
                />
                <label htmlFor="phone">Phone:</label>
              </div>
              <div className="street">
                <input
                  type="text"
                  name="street"
                  id="street"
                  placeholder="Street and Number..."
                  required
                  value={form.street}
                  onChange={handleChange}
                />
                <label htmlFor="street">Street and Number:</label>
              </div>
              <div className="city">
                <label htmlFor="city">Select Your City:</label>
                <select
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                >
                  <option value={form.payment}>-- Choose a City --</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="city">
                <label htmlFor="payment">Select type payment:</label>
                <select
                  id="payment"
                  name="payment"
                  value={form.payment}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Choose a payment --</option>
                  <option value="cash">Cash</option>
                  <option value="InstaPay">InstaPay</option>
                </select>
              </div>
              {form.payment === "InstaPay" ? (
                <>
                <p className="insta-phone">
                  This is InstaPay number:01015738335
                </p>
                    <p>
                    ابعت الصوره علي الواتساب علي هذا الرقم: 01015738335<br/>
              </p>
                </>
              ) : (
                ""
              )}
              <div className="country">
                <input
                  type="text"
                  name="country"
                  id="country"
                  value="Eygpt"
                  readOnly
                />
                <label htmlFor="country">Country:</label>
              </div>
              {err !== "" ? (
                <p style={{ color: "red" }}>quantity is not equal!</p>
              ) : (
                ""
              )}
              <div className="sub">
                <Link to="/basket">Go back</Link>
                <button type="submit">Check out</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className=""></div>
    </>
  );
}

// import { Link, useNavigate } from "react-router-dom";
// import Header from "../../Components/Website/Header";
// import "../../Css/base/CheckOut.css";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { baseUrl } from "../../Api/Api";
// import Cookie from "cookie-universal";

// export default function CheckOut() {
//   const cookie = Cookie();
//   const token = cookie.get("e-commerce");
//   const nav = useNavigate();
//   const [err, setErr] = useState("");
//   const [instaImage, setInstaImage] = useState(null);

//   const cities = [
//     "Cairo", "Alexandria", "Giza", "Luxor", "Aswan", "Hurghada",
//     "Sharm El-Sheikh", "Port Said", "Ismailia", "Suez"
//   ];

//   const [products, setProducts] = useState([]);
//   const [form, setForm] = useState({
//     phone: "01",
//     street: "",
//     city: "",
//     payment: "",
//   });

//   useEffect(() => {
//     const storedProducts = JSON.parse(localStorage.getItem("product")) || [];
//     setProducts(storedProducts);
//   }, []);

//   async function handelSubmit(e) {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("phone", form.phone);
//     formData.append("address", form.street);
//     formData.append("city", form.city);
//     formData.append("paymentMethodType", form.payment);

//     if (form.payment === "InstaPay" && instaImage) {
//       formData.append("image", instaImage);
//     }
   
//     try {
//       const res = await axios.post(
//         `${baseUrl}/orders/cashOrder`,
//         formData,
//         {
//           headers: {
//             Authorization: "Bearer " + token,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (res.status === 201) {
//         localStorage.removeItem("product");
//         localStorage.removeItem("cartId");
//         nav("/", { replace: true });
//       }
//     } catch (err) {
//       console.log(err);
//       setErr("Something went wrong");
//     }
//   }

//   function handleChange(e) {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   }

//   return (
//     <>
//       <Header />
//       <div className="container basket-items">
//         <div className="tabble">
//           <table className="table-items">
//             <thead>
//               <tr>
//                 <th>Product Image</th>
//                 <th>Title</th>
//                 <th>Description</th>
//                 <th>Quantity</th>
//                 <th>Price</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Array.isArray(products) && products.length > 0 ? (
//                 products.map((product, index) => (
//                   <tr key={index}>
//                     <td><img src={product.imageCover} alt={product.title} /></td>
//                     <td>{product.title}</td>
//                     <td>{product.description || "No description available"}</td>
//                     <td><span>{product.quantity}</span></td>
//                     <td>{product.price} EGP</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6">No products in the cart.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="checkout-fin">
//           <div className="container">
//             <form onSubmit={handelSubmit}>
//               <div className="tel">
//                 <input
//                   type="tel"
//                   name="phone"
//                   id="phone"
//                   placeholder="Enter Your Phone Number..."
//                   value={form.phone}
//                   onChange={(e) => {
//                     const onlyNumbers = e.target.value.replace(/\D/g, "");
//                     if (onlyNumbers.length <= 11) {
//                       handleChange({
//                         target: { name: "phone", value: onlyNumbers },
//                       });
//                     }
//                   }}
//                   pattern="[0-9]{11}"
//                   minLength={11}
//                   maxLength={11}
//                   required
//                 />
//                 <label htmlFor="phone">Phone:</label>
//               </div>
//               <div className="street">
//                 <input
//                   type="text"
//                   name="street"
//                   id="street"
//                   placeholder="Street and Number..."
//                   required
//                   value={form.street}
//                   onChange={handleChange}
//                 />
//                 <label htmlFor="street">Street and Number:</label>
//               </div>
//               <div className="city">
//                 <label htmlFor="city">Select Your City:</label>
//                 <select
//                   id="city"
//                   name="city"
//                   value={form.city}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">-- Choose a City --</option>
//                   {cities.map((city) => (
//                     <option key={city} value={city}>{city}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="city">
//                 <label htmlFor="payment">Select Payment Type:</label>
//                 <select
//                   id="payment"
//                   name="payment"
//                   value={form.payment}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">-- Choose a payment --</option>
//                   <option value="cash">Cash</option>
//                   <option value="InstaPay">InstaPay</option>
//                 </select>
//               </div>

//               {form.payment === "InstaPay" && (
//                 <>
//                   <p className="insta-phone">
//                     This is InstaPay number: <strong>01015738335</strong>
//                   </p>
//                    <p>
//                       ارفع الصوره علي الواتساب علي هذا الرقم: 01015738335<br />
//                       أو ارفع صورة إتمام عملية الدفع من إنستا باي هنا
//                     </p>
//                   <input
//                     type="file"
//                     className="file-input file-input-primary"
//                     accept="image/*"
//                     onChange={(e) => setInstaImage(e.target.files[0])}
//                     required
//                   />
//                 </>
//               )}

//               <div className="country">
//                 <input
//                   type="text"
//                   name="country"
//                   id="country"
//                   value="Egypt"
//                   readOnly
//                 />
//                 <label htmlFor="country">Country:</label>
//               </div>

//               {err && <p style={{ color: "red" }}>{err}</p>}

//               <div className="sub">
//                 <Link to="/basket">Go back</Link>
//                 <button type="submit">Check out</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
