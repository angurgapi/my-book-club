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
        <Button sx={{ color: 'red' }} onClick={handleClose}>
          cancel
        </Button>
        <Button onClick={handleConfirm}>yes</Button>
      </DialogActions>
    </Dialog>
  );
};
