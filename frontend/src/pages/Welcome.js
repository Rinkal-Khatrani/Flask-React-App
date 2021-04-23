import React, { useContext,useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import AuthContext from '../context/AuthContext'

const Welcome = () => {
    const auth=useContext(AuthContext)
    const storedData = JSON.parse(localStorage.getItem('token'));
  
    useEffect(()=>{
        try{
            fetch("/welcome", {
                method: "post",
        
                body: JSON.stringify(auth.token),

              })
              .then(r=>r.json())
              .then(res=>console.log(res.message))

        }catch(err){}
    },[])

    return (
        <>
            {/* {valid && (
                <div style={{marginTop: '3.5rem'}}>
                <h1>Welcome {auth.userName}</h1>
                </div>
                
            )}  */}

<div style={{marginTop: '3.5rem'}}>
                <h1>Welcome {storedData.userName}</h1>
                </div>
         </>
    );
}

export default Welcome;
