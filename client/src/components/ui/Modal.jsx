import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition cursor-pointer"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
