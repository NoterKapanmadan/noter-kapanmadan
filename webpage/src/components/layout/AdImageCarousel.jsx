'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { getImageSrc } from '@/utils/file';
import { SERVER_URL } from "@/utils/constants";
import { revalidateTagClient } from "@/app/actions";
import { useToast } from "@/hooks/use-toast"

export default function AdImageCarousel({ images, base64Images, dimensions, adID, adUserID, currentUserID }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const { toast } = useToast()

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

  const handleEdit = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files.length === 0) return;
    if (files) {
      setIsUploading(true);
      setUploadError(null);

      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });

      try {
        const response = await fetch(`${SERVER_URL}/ad/update-ad/${adID}`, {
          method: "POST",
          body: formData,
          cache: 'no-cache',
        });

        if (!response.ok) {
          throw new Error('Image upload failed');
        }

        const { msg, error } = await response.json();

        if (error) {
          return toast({
            title: 'Something went wrong!',
            description: error,
          });
        }
  
        if (msg) {
          toast({
            title: 'Success!',
            description: msg,
          });
  
          setIsUploading(false);
          e.target.value = '';

          revalidateTagClient(`/ad/${adID}`)
        }

      } catch (error) {
        console.error('Error uploading image:', error);
        setUploadError(error.message || 'Something went wrong');
      }
    }
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
      <input
        id="images"
        name="images"
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="relative h-full group">
        <Image
          src={getImageSrc(images[currentImageIndex], 'high')}
          alt={`Ad Image ${currentImageIndex + 1}`}
          layout="fill"
          objectFit="contain"
          blurDataURL={base64Images?.[currentImageIndex]}
          placeholder={base64Images?.[currentImageIndex] ? 'blur' : 'empty'}
          className="rounded-lg"
        />

        {adUserID == currentUserID ? (
          <>
            <div
              className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-black group-hover:bg-opacity-30 transition duration-300 rounded-lg cursor-pointer"
              onClick={handleEdit}
            >
              <Pencil className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
            </div>

            {/* Uploading Indicator */}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
              </div>
            )}

            {uploadError && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded">
                {uploadError}
              </div>
            )}
        </>
        ): (<></>)}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-background/80"
        onClick={handlePrev}
        aria-label="Previous Image"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-background/80"
        onClick={handleNext}
        aria-label="Next Image"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}