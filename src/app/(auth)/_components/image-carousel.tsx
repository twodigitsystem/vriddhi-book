//src/components/image-carousel.tsx
"use client";
import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
import Image from "next/image";
import styles from "./image-carousel.module.css";

interface ImageCarouselProps {
  images: string[];
  texts: string[]; // Array of text for each slide
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, texts }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Fade()]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const autoplayInterval = setInterval(scrollNext, 3000);

    return () => clearInterval(autoplayInterval);
  }, [emblaApi, scrollNext]);

  return (
    <div className={styles.embla_fade} ref={emblaRef}>
      <div className={styles.embla_fade__container}>
        {images.map((image, index) => (
          <div key={index} className={styles.embla_fade__slide}>
            <div className="relative h-full w-full">
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover dark:brightness-[0.8]"
                priority={index === 0}
              />
              <div className="absolute inset-0 flex items-end justify-center bg-black/60">
                <h1 className="mb-15 px-4 text-center text-5xl font-bold text-yellow-400">
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
