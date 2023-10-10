import axios from "axios";
import React, { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";

const SellerActivationPage = () => {
    console.count("Seller ActivationPage rendered!")
    const { activation_token } = useParams();
    const [error, setError] = useState(false);
  
    useEffect(() => {
    //   console.("Activation Page of User Effect of Activationpage.jsx")
    console.count("User ActivationPage Effects Runs");


      if (activation_token) {
        const sendRequest = async () => {
          await axios
            .post(`${server}/shop/activation`, {
              activation_token,
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              setError(true);
            });
        };
        sendRequest();
      }
    }, []);
  
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {error ? (
          <p>Your token is expired!</p>
        ) : (
          <p>Your account has been created suceessfully!</p>
        )}
      </div>
    );
  };
  

export default SellerActivationPage;
