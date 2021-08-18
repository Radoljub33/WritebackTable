import { toast } from "react-toastify"

/**
 * displays a Toast if an success should be demonstrated with custom settings
 * @param msg message which should be provided in the Toast
 */
export const ToastSuccess = (msg) => {
    toast.success(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
    });
}

/**
 * displays a Toast if an error should be demonstrated with custom settings
 * @param msg message which should be provided in the Toast
 */
export const ToastError = (msg) => {
    toast.error(msg, {
        position: "top-right",
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
    });
}