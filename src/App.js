//App.js

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider ,useAuth } from "./AuthContext"; // Authentication context

import Login from "./Pages/Accounts/Login";
import Reports from "./Pages/Reports";
import Dashboard from "./Pages/Dashboard";
import Product from "./Pages/Product";
import Claim_Details from "./Pages/Claim_Details";
// import PendingClaim from './Pages/PendingClaim';
import Claim_ApprovalPending from "./Pages/Claim_ApprovalPending";
import CheckPolicy from "./Pages/CheckPolicy";
import ClaimRecord from "./Components/AgentCRO/ClaimRecord";
import SendSMS from "./Pages/SendSMS";
import ProtectedRoute from "./ProtectedRoute";
import ProductCreate from "./Pages/ProductCreate";
import ProductEdit from "./Pages/ProductEdit";
import TelenorCharging from "./Components/PolicyCheck/Telenor_Charging";
import ZongCharging from "./Components/PolicyCheck/Zong_Charging";
import UfoneCharging from "./Components/PolicyCheck/Ufone_Charging";
import JazzCharging from "./Components/PolicyCheck/Jazz_Charging";
// import { useAuth } from "./AuthContext";
import CallReporting from "./Pages/Reporting";




import "./App.css";

function App() {
  const { user } = useAuth();  
  const isLoggedIn = !!user;
  

  // useEffect(() => {
  //   const user = JSON.parse(sessionStorage.getItem("user"));
  //   setIsLoggedIn(user ? true : false);
  // }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route for login */}
          {!isLoggedIn && (
            <Route
              path="/"
              element={!isLoggedIn ? <Login /> : <Navigate to="/" />}
            />
          )}
          {/* Protected Routes (Only accessible if logged in) */}
          <Route path="/SendSMS" element={<SendSMS />} />
          <Route
            path="/Dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Reports"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Product"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Product />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ProductCreate"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ProductCreate />
              </ProtectedRoute>
            }
          />
          <Route path="/ProductEdit/:productId" element={<ProductEdit />} />
          <Route
            path="/Claim_Details/:customerMobileNo/:claimNo"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Claim_Details />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/Claim_Details/:customerMobileNo/:claimNo"
            component={Claim_Details}
          />
          <Route
            path="/CheckPolicy"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <CheckPolicy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ClaimRecord/:msisdn"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ClaimRecord />
              </ProtectedRoute>
            }
          />
          <Route path="/telenor-charging" element={<TelenorCharging />} />
          <Route path="/zong-charging" element={<ZongCharging />} />
          <Route path="/ufone-charging" element={<UfoneCharging />} />
          <Route path="/jazz-charging" element={<JazzCharging />} />




          <Route
            path="/Claim_ApprovalPending"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Claim_ApprovalPending />
              </ProtectedRoute>
            }
          />

<Route path="/Reporting" element={
  <ProtectedRoute isLoggedIn={isLoggedIn}>
    <CallReporting />
  </ProtectedRoute>
} />



          {/* <Route path="/PendingClaim" element={<ProtectedRoute isLoggedIn={isLoggedIn}><PendingClaim /></ProtectedRoute>} /> */}

          {/* Fallback route (Redirects users based on authentication status) */}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/"} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
