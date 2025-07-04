import React, { useEffect, useState } from "react";

interface ContactUsModalProps {
  onClose: () => void;
}

const ContactUsModal: React.FC<ContactUsModalProps> = ({ onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200); // Delay to match animation duration
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <div
        className={`bg-[#1c1c1c] text-white rounded-md shadow-lg p-6 w-full max-w-xl relative transform transition-all duration-300 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-sm"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
        <p className="text-sm text-gray-400 mb-4">
          For all support inquiries, including billing issues, receipts, and
          general assistance, please email
          <a
            href="mailto:hello@hireremo.com"
            className="text-white underline ml-1"
          >
            hello@hireremo.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default ContactUsModal;
