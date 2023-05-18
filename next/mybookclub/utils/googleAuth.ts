import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import db, { storage, auth } from "./firebase";
import { toast } from "react-toastify";

export const successMessage = (message:string) => {
	toast.success(message, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
};

export const registerByGoogle = async (router:any) => {
	const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      successMessage("Authentication successful 🎉");
      router.push("/dashboard");
      // Handle successful sign-in
    } catch (error) {
      // Handle sign-in error
      console.error(error);
    }
}