import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../src/AdSlider.css';
 // Custom styles for positioning


const AdSlider = () => {
  const adverts = [
    {
      id: 1,
      imageUrl: 'https://ke.jumia.is/cms/2024/W35/Beauty/Cat/KE_BeautyEX_DailyFS_3rd_0724_S.gif',
      link: 'https://example.com/product1'
    },
    {
      id: 2,
      imageUrl: 'https://ke.jumia.is/cms/2024/W35/Beauty/Cat/KE_BeautyEX_DailyFS_3rd_0724_S.gif',
      link: 'https://example.com/product2'
    },
    {
      id: 3,
      imageUrl: 'https://ke.jumia.is/cms/2024/W35/Beauty/Cat/KE_BeautyEX_DailyFS_3rd_0724_S.gif',
      link: 'https://example.com/product3'
    },
    {
      id: 4,
      imageUrl: 'https://ke.jumia.is/cms/2024/W35/Beauty/Cat/KE_BeautyEX_DailyFS_3rd_0724_S.gif',
      link: 'https://example.com/product4'
    },
    {
      id: 5,
      imageUrl: 'https://ke.jumia.is/cms/2024/W35/Beauty/Cat/KE_BeautyEX_DailyFS_3rd_0724_S.gif',
      link: 'https://example.com/product5'
    }
  ];

  const settings = {
    dots: false, // Disable dots to avoid distraction
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Show only one item at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Hide arrows for a cleaner look
  };

  return (
    <div className="ad-slider-container">
      <Slider {...settings}>
        {adverts.map(ad => (
          <div key={ad.id} className="ad-slide">
            <a href={ad.link}>
              <img src={ad.imageUrl} alt={`Advert ${ad.id}`} />
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AdSlider;
