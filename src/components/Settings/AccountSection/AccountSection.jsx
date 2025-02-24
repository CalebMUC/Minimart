import PersonalInformation from "../AccountSection/PersonalInformation";
import BillAddress from "../AccountSection/BillAddress";
import ChangePassword from "../AccountSection/ChangePassword";
import ManageAccounts from "../AccountSection/ManageAccounts";
import ShippingAddress from "../AccountSection/ShippingAddress";

const AccountSection = ({ activeSubItem }) => {
  const renderActiveSubItem = () => {
    switch (activeSubItem) {
      case "Personal Information":
        return <PersonalInformation />;
      case "Billing Address":
        return <BillAddress />;
      case "Change Password":
        return <ChangePassword />;
      case "Manage Accounts":
        return <ManageAccounts />;
      case "Shipping Address":
        return <ShippingAddress />;
      default:
        return <div>Select a sub-item to get started.</div>;
    }
  };

  return (
    <div className="Account-section-main">
      {renderActiveSubItem()}
    </div>
  );
};

export default AccountSection;