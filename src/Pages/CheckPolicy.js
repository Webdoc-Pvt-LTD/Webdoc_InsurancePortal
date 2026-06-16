import React, { useState, useEffect } from "react";
import JC_Policy from "../Components/PolicyCheck/JC_Policy";
import WHS_Subscription from "../Components/PolicyCheck/WHS_Subscription";
import Zong_Subscription from "../Components/PolicyCheck/zong_subscription";
import Telenor_subscription from "../Components/PolicyCheck/Telenor_subscription";
import Ufone_subscription from "../Components/PolicyCheck/Ufone_subscription";
import Jazz_Subscription from "../Components/PolicyCheck/Jazz_subscription";
import Product_Subscription_Report from "../Components/PolicyCheck/Product_Subscription_Report";

import AgentCRO_Header from "../Components/AgentCRO/AgentCRO_Header";
import Claim_Head_Header from "../Components/Claim_Head_Component/Claim_Head_Header";
import Key_Account_Manager_Header from "../Components/Key_Account_Manager_Header";

import { Tabs, Tab } from "react-bootstrap";

const CheckPolicy = () => {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("jc_policy");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      setUserData(user);
    } else {
      console.log("No user found in sessionStorage");
    }
  }, []);

  if (!userData) {
    return null; // or add a loading spinner here
  }

  // Claim Head View with Tabs
  if (userData.userRole === "Claim_Head") {
    return (
      <div className="container-fluid">
        <Claim_Head_Header />
        <Tabs
          id="check-policy-tabs"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
          justify
        >
          <Tab eventKey="jc_policy" title="JazzCash Policy">
            <JC_Policy />
          </Tab>
          <Tab eventKey="whs_subscription" title="EasyPaise Policy">
            <WHS_Subscription />
          </Tab>
          <Tab eventKey="zong_subscription" title="Zong Policy">
            <Zong_Subscription />
          </Tab>

        <Tab eventKey="Ufone_subscription" title="Ufone Policy">
            <Ufone_subscription />
          </Tab>
        <Tab eventKey="Jazz_subscription" title="Jazz Policy">
            <Jazz_Subscription />
          </Tab>
           <Tab eventKey="Telenor_subscription" title="Telenor Policy">
            <Telenor_subscription />
          </Tab>
          </Tabs>
      </div>
    );
  }

  // Key Account Manager View
  if (userData.userRole === "Key_Account_Manager") {
    return (
      <div className="container-fluid">
        <Key_Account_Manager_Header />
        
        <Tabs>
          <Tab eventKey="JC_Policy" title="JazzCash Policy">
        <JC_Policy />
          </Tab>
           <Tab eventKey="Product_Subscription_Report" title="Fikrfree/Ufone Policy">
        <Product_Subscription_Report />
          </Tab>
           <Tab eventKey="Jazz_subscription" title="Jazz Policy">
            <Jazz_Subscription />
          </Tab><Tab eventKey="Ufone_subscription" title="Ufone Policy">
            <Ufone_subscription />
          </Tab> 
        </Tabs>
        
      </div>
    );
  }

  // Agent CRO View with Tabs
  if (userData.userRole === "AgentCRO") {
    return (
      <div className="container-fluid">
        <AgentCRO_Header />
        <Tabs
          id="check-policy-tabs"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
          justify
        >
          <Tab eventKey="jc_policy" title="JazzCash Policy">
            <JC_Policy />
          </Tab>
          <Tab eventKey="whs_subscription" title="EasyPaise Policy">
            <WHS_Subscription />
          </Tab>
          <Tab eventKey="zong_subscription" title="Zong Policy">
            <Zong_Subscription />
          </Tab>
           <Tab eventKey="Telenor_subscription" title="Telenor Policy">
            <Telenor_subscription />
          </Tab>
          <Tab eventKey="Ufone_subscription" title="Ufone Policy">
            <Ufone_subscription />
          </Tab> 
          <Tab eventKey="Jazz_subscription" title="Jazz Policy">
            <Jazz_Subscription />
          </Tab> 
        </Tabs>
      </div>
    );
  }

  return null;
};

export default CheckPolicy;
