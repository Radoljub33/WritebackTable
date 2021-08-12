import { toast } from "react-toastify"

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

export const ToastError = (msg) => {
    toast.error(msg, {
        position: "top-right",
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
    });
}