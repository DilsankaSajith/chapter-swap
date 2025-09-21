import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css/pagination';

const ImageSlider = ({ books }) => {
  const popularBooks = books.filter((book) => book.rating >= 4).slice(0, 3);

  return (
    <>
      <Text mb={3} fontSize={24}>
        Most Popular Books
      </Text>
      <Swiper
        spaceBetween={50}
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={true}
      >
        {popularBooks.map((book) => (
          <SwiperSlide key={book._id}>
            <Link to={`/book/${book._id}`}>
              <div className="bg-[#161C23] ">
                <div className="h-[200px] mb-2 overflow-hidden border boder-[#2A3035]">
                  <div className="flex gap-3">
                    <img
                      src={book.image}
                      alt="book-image"
                      borderRadius="sm"
                      className="w-[200px] h-full"
                    />
                    <div className="p-3 flex flex-col items-start gap-2">
                      <span className="font-bold">{book.title}</span>
                      <Flex alignItems="center" gap="8px">
                        <FaStar style={{ color: '#ffbc03' }} />
                        <span>{book.rating}</span>
                      </Flex>
                      <Link to={`/profile/${book.user?._id}`}>
                        <Box
                          cursor="pointer"
                          bg="gray.800"
                          px={2}
                          py={1}
                          borderRadius="sm"
                          display="flex"
                          alignItems="center"
                          gap={2}
                          _hover={{ bg: 'gray.800' }}
                        >
                          <Avatar
                            size="xs"
                            name={`${book.user?.name}`}
                            src={`${book.user?.profilePicture}`}
                          />
                          <Box display="flex" flexDir="column">
                            <Text>{book.user?.name}</Text>
                            <Text fontSize="xs" color="gray.500">
                              {book.user?.email}
                            </Text>
                          </Box>
                        </Box>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ImageSlider;
