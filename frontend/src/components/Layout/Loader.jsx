import React from "react";
import Lottie from "react-lottie";
// import animationData from "../../Assests/animations/24151-ecommerce-animation.json";
import animationData from "../../Assests/animations/animation_lkzi4mqn.json"

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Lottie options={defaultOptions} width={300} height={300} />
    </div>
  );
};

export default Loader;
