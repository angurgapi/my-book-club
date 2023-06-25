import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

interface AttendDialogProps {
  handleClose: () => void;
  handleConfirm: () => void;
  title: string;
  open: boolean;
}

export const AttendDialog: React.FC<AttendDialogProps> = ({
  handleClose,
  handleConfirm,
  title,
  open,
}) => {
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogActions>
        <Button onClick={handleConfirm}>yes</Button>
        <Button onClick={handleClose}>no</Button>
      </DialogActions>
    </Dialog>
  );
};
