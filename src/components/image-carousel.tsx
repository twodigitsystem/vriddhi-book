//src/components/image-carousel.tsx
"use client";
import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  // Initialize the embla carousel with options
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  // Function to scroll to next slide
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Set up the autoplay functionality
  useEffect(() => {
    if (!emblaApi) return;

    // Set interval for auto sliding - 3000ms (3 seconds)
    const autoplayInterval = setInterval(scrollNext, 3000);

    // Clean up the interval when component unmounts
    return () => clearInterval(autoplayInterval);
  }, [emblaApi, scrollNext]);

  return (
    <div ref={emblaRef} className="h-full w-full overflow-hidden">
      <div className="flex h-full">
        {images.map((image, index) => (
          <div key={index} className="flex-[0_0_100%] min-h-full">
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="h-full w-full object-cover dark:brightness-[0.8]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
