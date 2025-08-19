import { toast } from 'react-toastify';

export const sendErrorToast = (message: string) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
    closeOnClick: true,
    hideProgressBar: true,
    theme: 'light',
  });
};

export const sendSuccessToast = (message: string) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 5000,
    closeOnClick: true,
    hideProgressBar: true,
    theme: 'light',
  });
};