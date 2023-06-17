import { Avatar, Chip } from '@mui/material';
import { IUser } from '@/types/user';

export const EventHostCard = ({ hostData }: { hostData: IUser }) => {
  return (
    <Chip
      avatar={<Avatar alt="avatar" src={hostData.photoURL} />}
      label={hostData.displayName}
      variant="outlined"
    />
  );
};
