import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AdSlider = () => {
  const adverts = [
    {
      id: 1,
      imageUrl: 'https://ke.jumia.is/cms/2024/W35/Beauty/Cat/KE_BeautyEX_DailyFS_3rd_0724_S.gif',
      link: '#',
      alt: 'Special Offer'
    },
    {
      id: 2,
      imageUrl: 'https://ke.jumia.is/cms/2024/W35/Beauty/Cat/KE_BeautyEX_DailyFS_3rd_0724_S.gif',
      link: '#',
      alt: 'New Arrivals'
    },
    {
      id: 3,
      imageUrl: 'https://ke.jumia.is/cms/2024/W35/Beauty/Cat/KE_BeautyEX_DailyFS_3rd_0724_S.gif',
      link: '#',
      alt: 'Limited Time Deal'
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: true,
    appendDots: dots => (
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <ul className="flex space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-2 h-2 rounded-full bg-white opacity-50 hover:opacity-100 transition-opacity"></div>
    )
  };

  return (
  <div className="w-full max-h-[600px] md:max-h-[500px] lg:max-h-[400px] bg-gray-100 overflow-hidden relative">
    <Slider {...settings}>
      {adverts.map(ad => (
        <div key={ad.id}>
          <a href={ad.link} className="block">
            <img 
              src={ad.imageUrl} 
              alt={`Advert ${ad.id}`}
              className="w-full h-auto max-h-[600px] md:max-h-[500px] lg:max-h-[400px] object-contain"
            />
          </a>
        </div>
      ))}
    </Slider>
    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
  </div>
);

};

export default AdSlider;