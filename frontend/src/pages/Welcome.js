import React, { useContext,useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import AuthContext from '../context/AuthContext'

const Welcome = () => {
    const auth=useContext(AuthContext)
    const history=useHistory();
    let status
    const [message,setMessage]=useState();
  
    useEffect(()=>{
        try{
            fetch("/welcome?token="+auth.token)
              .then(r=>{
                status=r.status  
               return r.json()
            })
              .then(res=>{
                  console.log(status);
               
                setMessage(res.message)

              })

        }catch(err){}

        return ()=>{
            if(status!==201 || status!==200){
                history.push('/login')}
        }
    },[status])

    return (
        <>

<div style={{marginTop: '3.5rem'}}>
            <h2>{auth.userName}</h2>
                <h1>{message}</h1>
                </div>
         </>
    );
}

export default Welcome;
