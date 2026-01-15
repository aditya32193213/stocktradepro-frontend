// /**
//  * File: ToastProvider.jsx
//  * Purpose:
//  * - Global toast notification provider
//  *
//  * Flow:
//  * - Configures react-hot-toast styles and behavior
//  * - Handles success, error, and loading notifications
//  *
//  * Key Responsibilities:
//  * - Centralized notification system
//  * - Consistent feedback across the app
//  */




import { Toaster } from "react-hot-toast";

export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#363636",
          },
          success: {
            duration: 3000,
            style: {
              background: "#F0FDF4",
              color: "#166534",
              border: "1px solid #BBF7D0",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#FEF2F2",
              color: "#991B1B",
              border: "1px solid #FECACA",
            },
          },
        }}
      />
    </>
  );
}
