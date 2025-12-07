import React from "react";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationModalProps {
  productName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({
  productName,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  return (
    /** * MODIFIED: Replaced fixed black background with a semi-transparent
     * blur effect for visual continuity with the menu grid below.
     */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all">
      {/* Clickable overlay div to close if clicking outside the modal */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-gray-100">
        <div className="flex items-start">
          <div className="mx-auto shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Delete Product
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-700">
                  &quot;{productName}&quot;
                </span>
                ? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            onClick={onConfirm}
          >
            Delete
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-100 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
