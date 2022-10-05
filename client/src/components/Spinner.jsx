import React from "react";
import { MoonLoader } from "react-spinners";

function Spinner() {
  return (
    <div className="h-screen bg-base-300 flex items-center justify-center">
      <MoonLoader
        color="#36d7b7"
        loading
        size={70}
        speedMultiplier={1}
      />
    </div>
  );
}

export default Spinner;
