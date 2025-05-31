import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "@mui/material";
import Register from "../../Register";

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get("/api/accounts");
      setAccounts(response.data);
      const active = response.data.find((acc) => acc.isActive);
      setActiveAccount(active);
    } catch (error) {
      console.error("Error fetching accounts", error);
    }
  };

  const switchAccount = async (accountId) => {
    try {
      await axios.put(`/api/accounts/${accountId}/set-active`);
      fetchAccounts();
    } catch (error) {
      console.error("Error switching account", error);
    }
  };

  const addAccount = async () => {
    // try {
    //   const newAccount = await axios.post("/api/accounts", { name: "New Account" });
    //   setAccounts([...accounts, newAccount.data]);
    // } catch (error) {
    //   console.error("Error adding account", error);
    // }
    <Modal isVisible={isModalOpen} onClose={handleModalClose}>
      <Register/>
    </Modal>
  };

  const handleModalClose = () =>{
    setIsModalOpen(false)
  }

  return (
    <div className="account-management">
      <h2>Manage Your Accounts</h2>
      <div className="accounts-list">
        {accounts.map((account) => (
          <div
            key={account.id}
            className={`account-card ${account.isActive ? "active" : ""}`}
          >
            <div className="account-content">
              {account.isActive && <span className="check-icon">✔</span>}
              <span>{account.name}</span>
            </div>
            {!account.isActive && (
              <button onClick={() => switchAccount(account.id)}>Switch</button>
            )}
          </div>
        ))}
      </div>
      <button onClick={addAccount} className="add-account-button">
        <span>+</span> Add New Account
      </button>
    </div>
  );
}