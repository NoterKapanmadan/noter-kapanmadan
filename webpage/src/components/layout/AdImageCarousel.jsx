'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageSrc } from '@/utils/file';

export default function AdImageCarousel({ images, base64Images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!images || images.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-200">
        No Image Available
      </div>
    );
  }

  return (
    <div className="relative h-[400px]">
      <Image
        src={getImageSrc(images[currentImageIndex], 'high')}
        alt={`Ad Image ${currentImageIndex + 1}`}
        layout="fill"
        objectFit="contain"
        blurDataURL={ad.base64Images?.[currentImageIndex]}
        placeholder={ad.base64Images?.[currentImageIndex] ? 'blur' : 'empty'}
        width={ad.dimensions?.[currentImageIndex]?.width}
        height={ad.dimensions?.[currentImageIndex]?.height}
        className="rounded-lg"
      />
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-background/80"
        onClick={handlePrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-background/80"
        onClick={handleNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
