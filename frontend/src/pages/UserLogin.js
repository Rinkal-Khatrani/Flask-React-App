import React, { useState, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./UserLogin.css";

const UserLogin = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const iEmail = useRef();
  const iPwd = useRef();
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });
  let status
  const [error, setError] = useState("");
  const inputHandler = (event) => {
    event.persist();
    setformdata((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };
  const submitHandler = (event) => {
    event.preventDefault();
    const email = iEmail.current.value;
    const password = iPwd.current.value;
    console.log("refemailvalue=", email, password);
    if (email.trim().length === 0 || password.trim().length === 0) {
      setError("Email and Password is required for login!!");
      return;
    }

    console.log(formdata);
    try {
      fetch("/login", {
        method: "post",

        body: JSON.stringify(formdata),
      })
        .then((r) => {
          status = r.status
          return r.json()
        })
        .then(res => {
          if (status !== 200 && status !== 201) {

            setError(res.message);
            return
          }

          localStorage.setItem('token', JSON.stringify({
            userName: res.userName,
            token: res.token,
            expiration: res.exp
          }))
          const data = JSON.parse(localStorage.getItem('token'))
          if (data !== null) {
            auth.token = res.token;
            auth.userName = res.userName;
            auth.expiration = res.exp;
            auth.login(auth.token,auth.userName)
            history.push("/welcome?token="+res.token);
          }
        })

    } catch (err) {
      alert(err);
    }
  };

  return (
    <form className="login-form" onSubmit={submitHandler}>
      <h2>User Login</h2>
      {error && <h3 className="error"> {error}</h3>}
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input
          type="email"
          name="email"
          onInput={inputHandler}
          value={formdata.email}
          ref={iEmail}
        />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          onInput={inputHandler}
          value={formdata.password}
          ref={iPwd}
        />
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default UserLogin;
