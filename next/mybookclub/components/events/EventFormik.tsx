import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, IconButton } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker, DesktopTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useAppSelector } from '@/hooks/redux';
import Image from 'next/image';

import { saveEvent } from '@/utils/saveEvent';

const EventFormik = () => {
  const { uid } = useAppSelector((state) => state.user);

  const [previewImg, setPreviewImage] = useState('');

  const validationSchema = Yup.object({
    bookTitle: Yup.string().required('Title is required'),
    bookAuthor: Yup.string().required('Title is required'),
    date: Yup.date().required('Date is required'),
    time: Yup.string().required('Time is required'),
    city: Yup.string().required('City is required'),
    location: Yup.string().required('Location is required'),
    description: Yup.string(),
    fee: Yup.number(),
    coverUrl: Yup.mixed(),
  });

  const formik = useFormik({
    initialValues: {
      bookTitle: '',
      bookAuthor: '',
      date: dayjs(),
      time: dayjs(),
      city: '',
      location: '',
      coverUrl: '',
      fee: 0,
      description: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values); // Handle form submission logic here
    },
  });

  const handleImageChange = (event) => {
    formik.setFieldValue('coverUrl', event.currentTarget.files[0]);
    setPreviewImage(URL.createObjectURL(event.currentTarget.files[0]));
  };

  const openFileInput = () => {
    document.getElementById('fileInput').click();
  };

  const clearFile = () => {
    formik.setFieldValue('coverUrl', '');
    setPreviewImage('');
  };

  return (
    <Container maxWidth="sm">
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col items-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <TextField
            id="title"
            label="Book title"
            value={formik.values.bookTitle}
            onChange={formik.handleChange}
            error={formik.touched.bookTitle && Boolean(formik.errors.bookTitle)}
            helperText={formik.touched.bookTitle && formik.errors.bookTitle}
          />

          <TextField
            id="author"
            label="Book author"
            value={formik.values.bookAuthor}
            onChange={formik.handleChange}
            error={
              formik.touched.bookAuthor && Boolean(formik.errors.bookAuthor)
            }
            helperText={formik.touched.bookAuthor && formik.errors.bookAuthor}
          />

          <DatePicker
            label="Date"
            disablePast
            value={formik.values.date}
            onChange={(value) => formik.setFieldValue('date', value)}
            // renderInput={(params) => (
            //   <TextField
            //     {...params}
            //     error={formik.touched.date && Boolean(formik.errors.date)}
            //     helperText={formik.touched.date && formik.errors.date}
            //   />
            // )}
          />

          <DesktopTimePicker
            label="Time"
            value={formik.values.time}
            onChange={(value) => formik.setFieldValue('time', value)}
            // renderInput={(params) => (
            //   <TextField
            //     {...params}
            //     error={formik.touched.time && Boolean(formik.errors.time)}
            //     helperText={formik.touched.time && formik.errors.time}
            //   />
            // )}
          />

          <TextField
            id="city"
            label="City"
            value={formik.values.city}
            onChange={formik.handleChange}
            error={formik.touched.city && Boolean(formik.errors.city)}
            helperText={formik.touched.city && formik.errors.city}
          />

          <TextField
            id="location"
            label="Location"
            value={formik.values.location}
            onChange={formik.handleChange}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
          />

          <TextField
            id="fee"
            label="Fee"
            type="number"
            value={formik.values.fee}
            onChange={formik.handleChange}
            error={formik.touched.fee && Boolean(formik.errors.fee)}
            helperText={formik.touched.fee && formik.errors.fee}
          />

          <input
            type="file"
            id="fileInput"
            name="coverUrl"
            accept="image/png, image/gif, image/jpeg, image/webp, image/jpg"
            onChange={handleImageChange}
            // error={formik.touched.coverUrl && Boolean(formik.errors.coverUrl)}
            className="hidden"
          />
          <Button
            size="medium"
            onClick={openFileInput}
            variant="contained"
            color="primary"
            startIcon={<ImageIcon />}
          >
            Add picture
          </Button>
        </div>
        <div className="w-full mt-3">
          {previewImg && (
            <div className="w-full h-[200px] max-h-[200px] relative">
              <Image
                fill
                alt="event cover"
                className="w-full h-full"
                src={previewImg}
              />
              <button
                onClick={clearFile}
                className="absolute top-2 right-2 bg-white rounded text-teal-500"
              >
                <DeleteIcon />
              </button>
            </div>
          )}
          <TextField
            multiline
            className="w-full"
            label="Description"
            id="description"
            minRows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
          />
        </div>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default EventFormik;
