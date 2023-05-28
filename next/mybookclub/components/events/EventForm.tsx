import React, { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MdCancel } from 'react-icons/md';
import Link from 'next/link';

// import { addEventToFirebase } from "../../utils/util";
import { useRouter } from 'next/router';
import { useAppSelector } from '@/hooks/redux';
import Loader from '../../components/global/Loader';
import { DatePicker, DesktopTimePicker } from '@mui/x-date-pickers';
import { TextField, Button } from '@mui/material';

import dayjs from 'dayjs';

const EventForm = () => {
  const { uid } = useAppSelector((state) => state.user);
  console.log(uid);

  const validationSchema = Yup.object({
    date: Yup.date().required('Date is required'),
    city: Yup.string().required('City is required'),
  });

  const formik = useFormik({
    initialValues: {
      date: dayjs(),
      city: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values); // Handle form submission logic here
    },
  });

  const [user, setUser] = useState({});
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(dayjs());
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const router = useRouter();

  //   const isUserLoggedIn = useCallback(() => {
  //     onAuthStateChanged(auth, (user) => {
  //       if (user) {
  //         setUser({ email: user.email, uid: user.uid });
  //       } else {
  //         return router.push('/register');
  //       }
  //     });
  //   }, []);

  //   useEffect(() => {
  //     isUserLoggedIn();
  //   }, [isUserLoggedIn]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setButtonClicked(true);
    addEventToFirebase(
      uid,
      title,
      date,
      time,
      city,
      description,
      note,
      image,
      router
    );
  };

  const handleFileReader = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setFlier(readerEvent.target.result);
    };
  };

  return (
    // <form className="flex flex-col" onSubmit={handleSubmit}>
    //   <label htmlFor="title">Title</label>
    //   <input
    //     name="title"
    //     type="text"
    //     className="border-[1px] py-2 px-4 rounded-md mb-3"
    //     required
    //     value={title}
    //     onChange={(e) => setTitle(e.target.value)}
    //   />
    //   <div className="w-full flex justify-between">
    //     <div className="w-1/2 flex flex-col mr-[20px]">
    //       <label htmlFor="date">Date</label>
    //       <DatePicker
    //         disablePast
    //         value={date}
    //         onChange={(newValue) => setDate(newValue)}
    //       />
    //     </div>
    //     <div className="w-1/2 flex flex-col">
    //       <label htmlFor="time">Time</label>
    //       <DesktopTimePicker
    //         value={time}
    //         onChange={(newValue) => setTime(newValue)}
    //       />
    //     </div>
    //   </div>
    //   <label htmlFor="venue">City</label>
    //   <input
    //     name="city"
    //     type="text"
    //     className="border-[1px] py-2 px-4 rounded-md mb-3"
    //     required
    //     value={city}
    //     onChange={(e) => setCity(e.target.value)}
    //     placeholder="Plot Address, Lagos, Nigeria"
    //   />
    //   <label htmlFor="description">
    //     Event Description <span className="text-gray-500">(optional)</span>
    //   </label>
    //   <textarea
    //     name="description"
    //     rows={2}
    //     className="border-[1px] py-2 px-4 rounded-md mb-3"
    //     placeholder="Any information or details about the event"
    //     value={description}
    //     onChange={(e) => setDescription(e.target.value)}
    //   />
    //   <label htmlFor="note">
    //     Note to Attendees <span className="text-gray-500">(optional)</span>
    //   </label>
    //   <textarea
    //     name="note"
    //     rows={2}
    //     value={note}
    //     onChange={(e) => setNote(e.target.value)}
    //     className="border-[1px] py-2 px-4 rounded-md mb-3"
    //     placeholder="Every attendee must take note of this"
    //   />
    //   <label htmlFor="image">
    //     Event image <span className="text-gray-500">(optional)</span>
    //   </label>
    //   <input
    //     name="image"
    //     type="file"
    //     className="border-[1px] py-2 px-4 rounded-md mb-3"
    //     accept="image/*"
    //     onChange={handleFileReader}
    //   />
    //   {buttonClicked ? (
    //     <Loader />
    //   ) : (
    //     <button className="px-4 py-2 bg-[#C07F00] w-[200px] mt-3 text-white rounded-md">
    //       Create Event
    //     </button>
    //   )}
    // </form>
    <form onSubmit={formik.handleSubmit}>
      <DatePicker
        label="Date"
        disablePast
        value={formik.values.date}
        onChange={(value) => formik.setFieldValue('date', value)}
        renderInput={(params) => (
          <TextField
            {...params}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
          />
        )}
      />

      <Button type="submit" variant="contained" color="primary">
        create
      </Button>
    </form>
  );
};

export default EventForm;
