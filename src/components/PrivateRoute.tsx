import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "./components";

export const PrivateRoute = ({ children }: any) => {
  const { currentUser } = useAuth();

  return currentUser ? (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Header/>
      <div
        className="align-items-center justify-content-center"
        style={{ display: "flex", height: "100%", backgroundColor: "#f0f0f0" }}
      >
        {children}
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};
