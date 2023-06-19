import { FC } from 'react';
import { Modal, Typography } from '@mui/material';

type Props = {
  openModal: boolean;
  handleCloseModal: () => void;
};

export const AttendeesModal: FC<Props> = ({ openModal, handleCloseModal }) => {
  return (
    <Modal
      open={openModal}
      //   BackdropProps={{
      //     style: { backgroundColor: 'rgba(0, 0, 0, 0.45)' },
      //     onClick: (event) => {
      //       handleCloseModal();
      //     },
      //   }}
      sx={{ zIndex: 100 }}
      className="p-3 md:p-5 flex items-center"
    >
      <Typography variant="h4">Manage attendees</Typography>
    </Modal>
  );
};
