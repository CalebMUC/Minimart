import React from "react";
import '../../src/checkoupage.css';

const ItemsSection = ({ checkOutData,subTotal,isPaymentMethodSelected }) => {
  return (
    <div className={`items-section ${!isPaymentMethodSelected ? "disabled" : ""}`}>
             <h2>4. Items and shipping</h2>
              {checkOutData && checkOutData.length > 0 ? (
                <div className="items-list">
                  {checkOutData.map((item, index) => (
                    <div key={index} className="productItem">
                      <div className="productImage">
                        <img src={`${item.productImage}`} alt={item.productName} />
                      </div>
                      <div className="productDetails">
                        <p>{item.productName}</p>
                        <p>{item.quantity} pcs</p>
                      </div>
                    </div>
                  ))}
                  <div className="subtotal-section">
                    <p>Subtotal: Ksh {subTotal}</p>
                  </div>
                </div>
              ) : (
                <p>No items in the checkout.</p>
              )}
            </div>
  );
};

export default ItemsSection;
