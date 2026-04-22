//src/components/image-carousel.tsx
"use client";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
import Image from "next/image";
import styles from "./image-carousel.module.css";
import { Dot } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  texts: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, texts }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Fade()]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || isPaused) return;

    const autoplayInterval = setInterval(scrollNext, 5000);

    return () => clearInterval(autoplayInterval);
  }, [emblaApi, scrollNext, isPaused]);

  return (
    <div
      className={styles.embla_fade}
      ref={emblaRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.embla_fade__container}>
        {images.map((image, index) => (
          <div key={index} className={styles.embla_fade__slide}>
            <div className="relative h-full w-full">
              <div className="absolute inset-0 animate-[kenBurns_8s_ease-in-out_infinite]">
                <Image
                  src={image}
                  alt={`Slide ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain dark:brightness-[0.8]"
                  priority={index === 0}
                />
              </div>
              <div className="absolute inset-0 flex items-end justify-center bg-black/40">
                <h1 className="mb-12 px-4 text-center text-5xl font-bold text-yellow-800 animate-[slideUpFade_0.8s_ease-out_0.3s_both]">
                  {texts[index] || `Slide ${index + 1}`}
                </h1>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className="transition-all duration-300"
            aria-label={`Go to slide ${index + 1}`}
          >
            <Dot
              className={`size-3 transition-all duration-300 ${
                index === selectedIndex
                  ? "fill-yellow-800 text-yellow-800 scale-125"
                  : "text-white/50 hover:text-white/80"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
