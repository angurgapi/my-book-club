import React, { useState, SyntheticEvent, useEffect } from 'react';
import { ChangeEvent } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';

import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import CropIcon from '@mui/icons-material/Crop';

import { DateTimePicker } from '@mui/x-date-pickers';
import { DateValidationError } from '@mui/x-date-pickers/models';
import dayjs from 'dayjs';
import NextImage from 'next/image';
import { CropperModal } from './CropperModal';
import { Timestamp } from 'firebase/firestore';
import { saveEvent, updateEvent } from '@/utils/eventApi';
import Loader from '../global/Loader';
import { IEvent, IEventFormData } from '@/types/event';
import { sendErrorToast, sendSuccessToast } from '@/utils/toast';
import { compressDataUrl } from '@/utils/imageCompress';
interface EventFormProps {
  onSaveEvent: () => void;
  uid: string;
  isEdit?: boolean;
  oldEvent?: IEvent;
}

const toDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() || '');
    reader.onerror = (error) => reject(error);
  });
};

const EventForm: React.FC<EventFormProps> = ({
  onSaveEvent,
  uid,
  isEdit,
  oldEvent,
}) => {
  const [imgSrc, setImgSrc] = useState(oldEvent ? oldEvent.coverUrl : '');
  const [previewImg, setPreviewImg] = useState(
    oldEvent ? oldEvent.coverUrl : ''
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = React.useState<DateValidationError | null>(null);

  const validationSchema = Yup.object({
    bookTitle: Yup.string().required('Title is required'),
    bookAuthor: Yup.string().required('Title is required'),
    date: Yup.date().required('Date is required'),
    city: Yup.string().required('City is required'),
    location: Yup.string().required('Location is required'),
    description: Yup.string(),
    fee: Yup.number().when('isPaid', {
      is: true, then: (s) => s.min(0.01, 'Define the fee').required('Fee required'),
      otherwise: (s) => s.notRequired()
    }),
    currency: Yup.string().when('isPaid', {
      is: true, then: (s) => s.length(3, 'ISO-4217').required('Currency required'),
      otherwise: (s) => s.notRequired()
    }),

    coverUrl: Yup.mixed(),
  });

  const formik = useFormik({
    initialValues: {
      bookTitle: oldEvent ? oldEvent.bookTitle : '',
      bookAuthor: oldEvent ? oldEvent.bookAuthor : '',
      date: oldEvent ? dayjs(oldEvent.date) : dayjs().add(2, 'hour'),
      city: oldEvent ? oldEvent.city : '',
      location: oldEvent ? oldEvent.location : '',
      coverUrl: oldEvent?.coverUrl ? oldEvent.coverUrl : '',
      isPaid: Boolean(oldEvent?.fee && oldEvent.fee > 0),
      fee: oldEvent?.fee ? oldEvent.fee : 0,
      currency: oldEvent?.currency ? oldEvent.currency : '',
      description: oldEvent ? oldEvent.description : '',
      participants: oldEvent ? oldEvent.participants : [],
      isRegistrationOpen: oldEvent?.isRegistrationOpen
        ? oldEvent.isRegistrationOpen
        : true,
      capacity: oldEvent?.capacity ? oldEvent.capacity : 5,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      let eventData = {
        hostId: uid,
        ...values,
        date: values.date.valueOf(),
      };
      if (!oldEvent) {
        try {
          await saveEvent(eventData as IEventFormData);
          onSaveEvent();
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Failed to save event';
          sendErrorToast(message);
        }
      } else {
        try {
          await updateEvent(oldEvent.id, eventData);
          onSaveEvent();
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Failed to update event';
          sendErrorToast(message);
        }
      }
      setLoading(false);
    },
  });

  const paidEvent = formik.values.isPaid;

  const openFileInput = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  };


  const onImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      try {
        const preview = await toDataUrl(e.target.files[0]);
        setImgSrc(preview);
        setModalOpen(true);
      } catch (error) {
        console.log('Error: ', error);
      }
    }
  };

  const onCropApply = async (file: string) => {
    if (file) {
      setModalOpen(false);
      try {
        const compressed = await compressDataUrl(file, 'image/webp', 0.8, 1200, 1200);
        formik.setFieldValue('coverUrl', compressed);
        setPreviewImg(compressed);
      } catch (err) {
        formik.setFieldValue('coverUrl', file);
        setPreviewImg(file);
      }
    } else {
      formik.setFieldValue('coverUrl', '');
    }
  };

  const clearFile = () => {
    setPreviewImg('');
    setImgSrc('');
    formik.setFieldValue('coverUrl', '');
  };

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col items-center"
      >
        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
            error={
              formik.touched.bookAuthor && Boolean(formik.errors.bookAuthor)
            }
            helperText={formik.touched.bookAuthor && formik.errors.bookAuthor}
          />

          <DateTimePicker
            label="Date/time"
            onChange={(value) => formik.setFieldValue('date', value)}
            disablePast
            value={formik.values.date}
            slotProps={{
              textField: {
                error: Boolean(formik.errors.date),
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
                onChange={(e) => formik.setFieldValue('isPaid', e.target.checked)}
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
                error={
                  formik.touched.currency && Boolean(formik.errors.currency)
                }
                helperText={formik.touched.currency && formik.errors.currency}
              />
            </div>
          )}

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
              <CameraAltIcon className="mr-2" /> Upload cover picture
            </button>
            {previewImg && (
              <div className="img-preview relative aspect-[3/4] w-[300px] m-auto">
                <NextImage
                  className="m-auto aspect-[3/4]"
                  src={previewImg}
                  // height={200}
                  // width={150}
                  fill
                  style={{ objectFit: 'cover' }}
                  alt="event cover"
                />
                <div className="m-auto w-full absolute img-preview__controls flex justify-center bottom-2">
                  <IconButton
                    size="small"
                    type="button"
                    sx={{ backgroundColor: '#fff', hover: { color: '#fff' } }}
                    onClick={() => setModalOpen(true)}
                  >
                    <CropIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    type="button"
                    sx={{ backgroundColor: '#fff', ml: 2 }}
                    onClick={clearFile}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
            )}
          </div>
        </div>
        <button
          className="text-xl w-full mt-3 bg-teal-500 rounded p-4"
          type="submit"
        >
          {loading ? <Loader /> : <span>Submit</span>}
        </button>
      </form>
      <CropperModal
        openModal={modalOpen}
        handleCloseModal={() => setModalOpen(false)}
        onCropApply={onCropApply}
        imgSrc={imgSrc}
        cropAspect={3 / 4}
      />
    </>
  );
};

export default EventForm;
