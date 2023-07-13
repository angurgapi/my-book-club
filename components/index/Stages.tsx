import { Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const Stages = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  const stagesData = [
    {
      title: 'Share your thoughts',
      image: '/images/people-reading.png',
      text: 'Come and discuss most exciting books with fellow readers. Expand your hobbies list and have some quality time!',
    },
    {
      title: 'Meet new people',
      image: '/images/people-standing.png',
      text: 'Feeling lonely? Joining a book club is a great way to find friends, even if you are a shy one!',
    },
    {
      title: 'Start your own club',
      image: '/images/ladies.png',
      text: `Nothing going on where you live? Feeling urge to lead the community? Organize events, invite people and control attendance - it's easy.`,
    },
  ];
  return (
    <section className="w-full bg-[#FFFADE] p-3">
      <Typography
        variant="h4"
        className="text-center text-indigo-900"
        sx={{ marginTop: 7 }}
      >
        How it works
      </Typography>
      <div className="flex flex-col max-w-[1000px] m-auto">
        <Swiper
          autoHeight
          className="mt-8 flex flex-col grow w-full content-stretch py-5"
          spaceBetween={50}
          slidesPerView={isSmall ? 1 : 3}
          navigation
          pagination={{ clickable: true }}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
          modules={[Pagination, Scrollbar, Navigation]}
        >
          {stagesData.map((stage, index) => (
            <SwiperSlide
              key={index}
              className="flex grow h-full self-stretch grow p-3 pb-6"
            >
              <div className="flex flex-col items-center max-w-[300px] m-auto h-full">
                <Image
                  className="rounded-full"
                  src={stage.image}
                  height={300}
                  width={300}
                  alt="people and books"
                />
                <p className="text-center mt-3 text-xl text-indigo-900 max-w-[250px]">
                  {stage.title}
                </p>
                <p className="text-center mt-4 max-w-[250px]">{stage.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Stages;
