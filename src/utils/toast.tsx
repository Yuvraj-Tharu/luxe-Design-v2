import { toast } from 'react-toastify';

export const showSuccessToast = (message: string) => {
    toast.success(message, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true
    });
};

export const showErrorToast = (message: string) => {
    toast.error(message, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true
    });
};

export const showInfoToast = (message: string) => {
    toast.info(message, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true
    });
};
