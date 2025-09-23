import React from 'react';
import { IEvent } from '@/types/event';
import { useAppSelector } from '@/hooks/redux';
import dayjs from 'dayjs';
import Link from 'next/link';
import {
  Box,
  Typography,
  Chip,
  Card,
  CardMedia,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  MonetizationOn,
  LocationOn,
  CalendarMonth,
  Public,
  Edit,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Button } from '../ui/button';
import Image from 'next/image';

interface EventCardProps {
  event: IEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = dayjs(event?.date).format('MMM DD hh:mm a');
  const getImgSrc = event.coverUrl || '/images/cover.jpg';
  const { uid, isAuth } = useAppSelector((state) => state.user);
  const isOwnEvent = isAuth && uid === event.hostId ? true : false;

  const router = useRouter();

  const editEvent = (id: string) => (event: any) => {
     event.preventDefault();  
    event.stopPropagation();
    router.push(`/event/edit/${id}`);
  };

  return (
    <Link href={`/event/${event.id}`} className="w-full mt-2 inline-flex">
      <Card className="flex flex-col justify-between items-center p-0 relative hover:shadow-lg transition-shadow w-full rounded-md h-full">
        {isOwnEvent && (
          <Button
           variant="secondary" size="icon"
            className='absolute top-[2px] right-[2px] rounded-full bg-[#fff] shadow-md hover:color-[#fff]'
            onClick={editEvent(event.id)}
          >
            <Edit className='h-[16px] w-[16px]' />
          </Button>
        )}
        <Image
          src={getImgSrc}
          alt="bookclub event cover"
          width={200}
          height={300}
          className="w-full h-48 object-cover rounded-t-md"
          priority
        />
        <CardContent
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            flexGrow: 1,
          }}
        >

          <Typography
            gutterBottom
            variant="h5"
            component="p"
            className="event-card-title"
          >
            <b>
              {event.bookTitle} | {event.bookAuthor}
            </b>
          </Typography>

          <div className="flex items-center mt-2">
            <CalendarMonth className="text-teal-500 mr-2" />
            <span className="text-start">{formattedDate}</span>
          </div>

          <div className="flex items-center  mt-2">
            <LocationOn className="text-teal-500 mr-2" />
            <span> {event.city}</span>
          </div>
          <Box
            sx={{ display: 'flex', flexGrow: 1 }}
            justifyContent="start"
            alignItems="end"
          >
            {event.fee ? (
              <div className="flex items-center  mt-2">
                <MonetizationOn className="text-teal-500 mr-2" />
                <span>
                  {' '}
                  {event.fee} {event.currency}
                </span>
              </div>
            ) : (
              <Chip
                sx={{
                  backgroundColor: '#009688',
                  color: '#fff',
                  mt: 2,
                  justifySelf: 'end',
                }}
                label="Free entrance"
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventCard;
