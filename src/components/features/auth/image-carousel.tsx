//src/components/image-carousel.tsx
"use client";
import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface ImageCarouselProps {
  images: string[];
  texts: string[]; // Array of text for each slide
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, texts }) => {
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
            <div className="relative inline-block w-full h-full">
              {/* Image */}
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="h-full w-full object-cover dark:brightness-[0.8]"
              />
              {/* Overlay with light transparent background, matching image size */}
              <div className="absolute inset-0 bg-black/60 flex items-end justify-center">
                {/* Text on overlay */}
                <h1 className="text-5xl font-bold text-yellow-400 text-center px-4 mb-15">
                  {texts[index] || `Slide ${index + 1}`}
                </h1>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
