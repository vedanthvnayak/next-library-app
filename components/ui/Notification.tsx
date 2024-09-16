import React, { useEffect } from "react";
import { XIcon } from "lucide-react";

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-center p-3 rounded-lg shadow-lg transition-opacity duration-300 text-sm flex items-center justify-between">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-3 text-gray-400 hover:text-white transition-colors duration-300"
        aria-label="Close"
      >
        <XIcon className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default Notification;
