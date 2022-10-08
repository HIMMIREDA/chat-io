import React from "react";
import { MoonLoader } from "react-spinners";

function Spinner({ fixed }) {
  return (
    <div
      className={`h-screen w-full bg-opacity-50 ${
        fixed ? "fixed top-0" : ""
      } bg-[#111111] flex items-center justify-center`}
    >
      <MoonLoader color="#36d7b7" loading size={70} speedMultiplier={1} />
    </div>
  );
}

Spinner.defaultProps = {
  fixed: true,
};
export default Spinner;
