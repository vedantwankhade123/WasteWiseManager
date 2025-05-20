import React, { useState } from "react";
import AuthModal from "@/components/dialogs/auth-modal";

interface AuthModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  type: "login" | "signup";
  userType: "user" | "admin";
  onSwitchType: (type: "user" | "admin") => void;
}

const AuthModalWrapper: React.FC<AuthModalWrapperProps> = ({
  isOpen,
  onClose,
  type,
  userType,
  onSwitchType,
}) => {
  const [showLoginModal, setShowLoginModal] = useState(isOpen);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleSwitchType = () => {
    if (type === "login") {
      setShowLoginModal(false);
      setShowSignupModal(true);
    } else {
      setShowSignupModal(false);
      setShowLoginModal(true);
    }
  };

  return (
    <>
      {showLoginModal && (
        <AuthModal
          isOpen={showLoginModal}
          onClose={() => {
            setShowLoginModal(false);
            onClose();
          }}
          type="login"
          userType={userType}
          onSwitchType={handleSwitchType}
        />
      )}
      {showSignupModal && (
        <AuthModal
          isOpen={showSignupModal}
          onClose={() => {
            setShowSignupModal(false);
            onClose();
          }}
          type="signup"
          userType={userType}
          onSwitchType={handleSwitchType}
        />
      )}
    </>
  );
};

export default AuthModalWrapper;
