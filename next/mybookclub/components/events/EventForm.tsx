import React, { useState, SyntheticEvent } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, FormControlLabel, Checkbox } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  DatePicker,
  DesktopTimePicker,
  DateTimePicker,
} from '@mui/x-date-pickers';
import { DateValidationError } from '@mui/x-date-pickers/models';
import dayjs from 'dayjs';
import { useAppSelector } from '@/hooks/redux';
import Image from 'next/image';
import ImageCrop from './ImageCrop';

import { saveEvent } from '@/utils/eventApi';

const EventForm = ({ onSaveEvent }) => {
  const { uid } = useAppSelector((state) => state.user);

  // const [previewImg, setPreviewImage] = useState('');
  const [imgSrc, setImgSrc] = useState(null);
  const [paidEvent, setPaidEvent] = useState(false);
  const [error, setError] = React.useState<DateValidationError | null>(null);

  const validationSchema = Yup.object({
    bookTitle: Yup.string().required('Title is required'),
    bookAuthor: Yup.string().required('Title is required'),
    date: Yup.date().required('Date is required'),
    //   .min(new Date(), 'Date must be in the future'),
    // time: Yup.string().required('Time is required'),
    city: Yup.string().required('City is required'),
    location: Yup.string().required('Location is required'),
    description: Yup.string(),
    fee: Yup.number(),
    coverUrl: Yup.mixed(),
  });

  //   const validate = (values: any) => {
  //     if (values.date && values.date.isBefore(dayjs(), 'day')) {
  //       errors.date = true;
  //     }

  //     return errors;
  //   };
  const openFileInput = () => {
    document.getElementById('fileInput').click();
  };

  const onFileChange = (file: File) => {
    // console.log(file);
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = (readerEvent) => {
        formik.setFieldValue('coverUrl', readerEvent.target?.result);
      };
      // setPreviewImage(URL.createObjectURL(file));
    } else {
      formik.setFieldValue('coverUrl', null);
    }
  };

  const formik = useFormik({
    initialValues: {
      bookTitle: '',
      bookAuthor: '',
      date: dayjs().add(2, 'hour'),
      city: '',
      location: '',
      coverUrl: '',
      fee: 0,
      currency: '',
      description: '',
      participants: [],
      registrationOpen: true,
      capacity: 5,
    },

    validationSchema,
    onSubmit: async (values) => {
      //   validate(values);
      let eventData = {
        hostId: uid,
        ...values,
      };

      await saveEvent(eventData);
      onSaveEvent();
    },
  });

  const onImageSelect = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleImageChange = (event: React.SyntheticEvent) => {
    const reader = new FileReader();
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (readerEvent) => {
        formik.setFieldValue('coverUrl', readerEvent.target?.result);
      };
      setPreviewImage(URL.createObjectURL(event.currentTarget.files[0]));
    }
  };

  const clearFile = () => {
    formik.setFieldValue('coverUrl', '');
  };

  return (
    // <Container maxWidth="sm">
    <form onSubmit={formik.handleSubmit} className="flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <TextField
          id="bookTitle"
          label="Book title"
          value={formik.values.bookTitle}
          onChange={formik.handleChange}
          error={formik.touched.bookTitle && Boolean(formik.errors.bookTitle)}
          helperText={formik.touched.bookTitle && formik.errors.bookTitle}
        />

        <TextField
          id="bookAuthor"
          label="Book author"
          value={formik.values.bookAuthor}
          onChange={formik.handleChange}
          error={formik.touched.bookAuthor && Boolean(formik.errors.bookAuthor)}
          helperText={formik.touched.bookAuthor && formik.errors.bookAuthor}
        />

        <DateTimePicker
          label="Date/time"
          onChange={(value) => formik.setFieldValue('date', value)}
          disablePast
          value={formik.values.date}
          slotProps={{
            textField: {
              error: formik.errors.date,
              helperText: formik.errors.date
                ? 'Date cannot be in the past'
                : '',
            },
          }}
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
          id="capacity"
          label="Capacity, ppl"
          type="number"
          value={formik.values.capacity}
          onChange={formik.handleChange}
          error={formik.touched.capacity && Boolean(formik.errors.capacity)}
          helperText={formik.touched.capacity && formik.errors.capacity}
        />
      </div>
      <div className="flex flex-col w-full mt-3">
        <FormControlLabel
          control={
            <Checkbox
              checked={paidEvent}
              onChange={() => setPaidEvent(!paidEvent)}
            />
          }
          label="Entrance fee"
        />
        {paidEvent && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <TextField
              id="fee"
              label="Fee"
              type="number"
              value={formik.values.fee}
              onChange={formik.handleChange}
              error={formik.touched.fee && Boolean(formik.errors.fee)}
              helperText={formik.touched.fee && formik.errors.fee}
            />
            <TextField
              id="currency"
              label="Currency"
              type="text"
              value={formik.values.currency}
              onChange={formik.handleChange}
              error={formik.touched.currency && Boolean(formik.errors.currency)}
              helperText={formik.touched.currency && formik.errors.currency}
            />
          </div>
        )}

        {/* {previewImg && (
          <div className="w-full h-[200px] max-h-[200px] mb-3">
            <Image
              height={150}
              width={300}
              alt="event cover"
              src={previewImg}
            />
            <button
              onClick={clearFile}
              className="absolute top-2 right-2 bg-white rounded text-teal-500"
            >
              <DeleteIcon />
            </button>
          </div>
        )} */}
        <div className="mt-2">
          <TextField
            className="w-full"
            multiline
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
        <div className="mt-2 flex flex-col">
          <input
            type="file"
            id="fileInput"
            name="coverUrl"
            accept="image/*"
            onChange={onImageSelect}
            className="hidden"
          />
          <button
            type="button"
            className="text-xl bg-teal-700 text-white p-3 rounded mb-2 w-full"
            onClick={openFileInput}
          >
            Upload cover picture
          </button>
          {imgSrc && (
            <ImageCrop
              onFileChange={onFileChange}
              imgSrc={imgSrc}
              className="w-full max-w-[300px]"
            />
          )}
        </div>
      </div>
      <button
        className="text-xl w-full mt-3 bg-teal-500 rounded p-4"
        type="submit"
      >
        Submit
      </button>
    </form>
    // </Container>
  );
};

export default EventForm;
