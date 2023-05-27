import { FC } from 'react';

import { IconButton, Modal } from '@mui/material';

type Props = {
  openModal: boolean;
  handleCloseModal: () => void;
};

export const EventModal: FC<Props> = ({ openModal, handleCloseModal }) => {
  return (
    <Modal
      open={openModal}
      onClick={handleCloseModal}
      BackdropProps={{
        style: { backgroundColor: 'rgba(0, 0, 0, 0.45)' },
      }}
      sx={{ zIndex: 1600 }}
    >
      <>
        <IconButton
          color="secondary"
          sx={{
            position: 'absolute',
            height: '100px',
            width: '100px',
            top: 20,
            right: 20,
          }}
        >
          x
        </IconButton>
      </>
    </Modal>
  );
};
