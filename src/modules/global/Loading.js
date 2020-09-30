import React from "react";

const Loading = () => {
  return (
    <div classname="fallback-spinner">
      <div
        role="status"
        style={{ width: "2rem", height: "2rem" }}
        className="spinner-border"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
export default Loading;
