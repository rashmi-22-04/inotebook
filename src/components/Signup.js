import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Signup = (props) => {
  const [credentails, setCredentails] = useState({name: "",email:"",password:"",cpassword:""});
  let history = useHistory();
  const handleSubmit = async (e) => {
    e.preventDefault();
   const  {name,email,password}=credentails;
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
     
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name,email,password }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      //save the auth token and redirect
      localStorage.setItem("token", json.authToken);
      history.push("/");
      props.showAlert("Account created successfully!","success")
    } else {
      // alert("Invalid credentails");
       props.showAlert("Invalid credentails","danger")
    }
  };

  const onChange = (e) => {
    setCredentails({ ...credentails, [e.target.name]: e.target.value });
  };
  return (
    <div className="conatiner mt-3">
      <h2 className="my-3">Create an accoun to use iNotebook</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            aria-describedby="name"
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="email"
            onChange={onChange}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            onChange={onChange}
            minLength={5}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
