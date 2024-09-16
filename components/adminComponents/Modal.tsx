import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "delete" | "confirm" | "approve";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "confirm", // default type
}) => {
  if (!isOpen) return null;

  // Determine colors based on the type of request
  let confirmButtonColor = "bg-yellow-500 hover:bg-yellow-600";
  let titleColor = "text-yellow-500";

  if (type === "delete") {
    confirmButtonColor = "bg-red-500 hover:bg-red-600";
    titleColor = "text-red-500";
  } else if (type === "approve") {
    confirmButtonColor = "bg-green-500 hover:bg-green-600";
    titleColor = "text-green-500";
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className={`text-lg font-semibold mb-4 ${titleColor}`}>{title}</h3>
        <p className="mb-6 text-sm">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-600 text-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-500 transition-colors duration-300"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`${confirmButtonColor} text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
