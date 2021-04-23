import React, { useState,useContext,useRef } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from '../context/AuthContext'

const UserRegistration = () => {
  const history=useHistory()
  const auth = useContext(AuthContext);
  const [error, setError] = useState("");
  const iEmail = useRef();
  const iPwd = useRef();
  const ifname=useRef();
  const ilname=useRef();
  const iphno=useRef();



  const [formdata, setformdata] = useState({
    email: "",
    password: "",
    fname: "",
    lname: "",
    phno: "",
  });
  const inputHandler=(event)=>{
    event.persist();
    setformdata(inputs=>({...inputs,[event.target.name]:event.target.value}))
    setError("");
  }
  const submitHandler = (event) => {
    event.preventDefault();
    const email = iEmail.current.value;
    const password = iPwd.current.value;
    const fname = ifname.current.value;
    const lname = ilname.current.value;
    const phno=iphno.current.value;
    let status
    if (email.trim().length === 0 || password.trim().length === 0||fname.trim().length === 0||lname.trim().length === 0||phno.trim().length === 0) {
      setError("All Fields are required for login!!");
      return;
    }
    console.log(formdata)
    try {
      fetch('/registration', {
        method: 'post',
        body: JSON.stringify(formdata)
      })
      .then(r => {
        status=r.status
        return r.json()
      })
      .then(res=>{
        console.log("===",status);
        if (status !== 200 && status !== 201) {
          console.log("=====",res.message);
          setError(res.message);
          return
          
        }
            auth.token = res.token;
            auth.userName =res.userName;
            auth.login(res.token, res.userid, res.userName);
            history.push("/welcome");

       
      })
      
    } catch (err) {}
  };

  return (
    <form className="login-form" onSubmit={submitHandler}>
      <h2>User Registration</h2>
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
        <input type="password" name="password" 
         onInput={inputHandler}
         value={formdata.password}
         ref={iPwd}
         />
      </div>
      <div className="form-control">
        <label htmlFor="fname">First Name</label>
        <input type="text" name="fname"  onInput={inputHandler}
         value={formdata.fname}
         ref={ifname}
         required/>
      </div>
      <div className="form-control">
        <label htmlFor="lname">Last Name</label>
        <input type="text" name="lname"  onInput={inputHandler}
        ref={ilname}
         value={formdata.lname}

         required />
      </div>
      <div className="form-control">
        <label htmlFor="phno">Phone Number</label>
        <input type="tel" name="phno"  onInput={inputHandler} maxLength="10" minlength="10"
         value={formdata.phno} ref={iphno} required/>
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default UserRegistration;
