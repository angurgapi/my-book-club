import React from 'react';
import { IEvent } from '@/types/event';

import dayjs from 'dayjs';
import Link from 'next/link';
import {
  Box,
  Typography,
  Chip,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PublicIcon from '@mui/icons-material/Public';

interface EventCardProps {
  event: IEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = dayjs.unix(event.date).format('MMM DD hh:mm a');

  const getImgSrc = event.coverUrl || '/images/cover.jpg';

  return (
    <Link href={`/event/${event.id}`} className="w-fill">
      <Card
        sx={{
          width: '100%',
          display: 'flex',
          height: '100%',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <CardContent
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="p"
            className="event-card-title"
          >
            {event.bookTitle} | {event.bookAuthor}
          </Typography>

          <div className="flex items-center mt-2">
            <CalendarMonthIcon className="text-teal-500 mr-2" />
            <span className="text-start">{formattedDate}</span>
          </div>

          <div className="flex items-center  mt-2">
            <LocationOnIcon className="text-teal-500 mr-2" />
            <span> {event.city}</span>
          </div>
          <Box
            sx={{ display: 'flex', flexGrow: 1 }}
            justifyContent="start"
            alignItems="end"
          >
            {event.fee ? (
              <div className="flex items-center  mt-2">
                <MonetizationOnIcon className="text-teal-500 mr-2" />
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

        <CardMedia
          component="img"
          image={getImgSrc}
          alt="bookclub event cover"
          sx={{ aspectRatio: '3/4', width: '100%', maxHeight: '320px' }}
        />
      </Card>
    </Link>
  );
};

export default EventCard;
