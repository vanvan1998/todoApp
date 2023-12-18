import React from "react";
import { useNavigate } from "react-router-dom";

export const SignInPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <h2>SignInPage</h2>
      <button
        onClick={() => {
          navigate("/home");
        }}
      >
        Sign in
      </button>
    </>
  );
};
