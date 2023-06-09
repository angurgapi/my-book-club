import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadString,
} from 'firebase/storage';

import { toast } from 'react-toastify';

const sendErrorToast = (message: string) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    theme: 'light',
  });
};

const sendSuccessToast = (message: string) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    theme: 'light',
  });
};

export const uploadUserpic = async (uid: string, profilePic: any) => {
  const storage = getStorage();
  const imageRef = ref(storage, `users/${uid}/image`);
  try {
    await uploadString(imageRef, profilePic, 'data_url');
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error) {
    console.log('Error uploading userpic: ', error);
    sendErrorToast('Error uploading userpic');
    return null;
  }
};

export const updateUser = async (uid: string, payload: any) => {
  const db = getFirestore();
  const docRef = doc(db, 'users', uid);
  await updateDoc(doc(db, 'users', docRef.id), payload);
  sendSuccessToast('Your profile was updated');
};
