import { FC } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { IconButton, Modal } from '@mui/material';

import EventForm from './EventForm';
import EventFormik from './EventForm';

type Props = {
  openModal: boolean;
  handleCloseModal: () => void;
};

export const EventModal: FC<Props> = ({ openModal, handleCloseModal }) => {
  return (
    <Modal
      open={openModal}
      BackdropProps={{
        style: { backgroundColor: 'rgba(0, 0, 0, 0.45)' },
        onClick: (event) => {
          handleCloseModal();
        },
      }}
      sx={{ zIndex: 100 }}
      className="p-3 md:p-5"
    >
      <>
        <div className="modal m-auto bg-white relative p-2 rounded top-3 w-fit min-w-[300px] max-h-[80vh]">
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 2,
              right: 2,
            }}
          >
            <AiFillCloseCircle className="text-slate-500" />
          </IconButton>
          <h3 className="mt-2 text-center text-2xl">New event</h3>
          <div className="modal">
            <EventForm onSaveEvent={handleCloseModal} />
          </div>
        </div>
      </>
    </Modal>
  );
};
