"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Check } from "lucide-react";
import html2canvas from "html2canvas";
import { capitalizeFirstLetters } from "@/utils/helpers";

export default function SocialShareModal({ ad }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/ad/${ad.ad_id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true, // Important for images
        backgroundColor: null, 
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `noter-kapanmadan-${ad.ad_id}.png`;
      link.click();
    }
  };

  // Get first image or placeholder
  const imageUrl = ad.images && ad.images.length > 0 
    ? ad.images[0] 
    : (ad.base64Images && ad.base64Images.length > 0 ? ad.base64Images[0] : "/placeholder.png");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Share2 className="mr-2 h-4 w-4" />
          Share Ad
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this Vehicle</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 items-center">
          {/* Preview Card */}
          <div 
            ref={cardRef} 
            className="w-full aspect-[4/5] bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl text-white shadow-2xl relative overflow-hidden flex flex-col justify-between"
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-10 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
            
            {/* Brand */}
            <div className="z-10">
              <h3 className="text-xl font-bold tracking-tighter text-blue-400">NoterKapanmadan</h3>
            </div>

            {/* Image */}
            <div className="z-10 relative my-4 flex-grow rounded-lg overflow-hidden border border-slate-600 shadow-md">
                {/* We use standard img for html2canvas compatibility */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={imageUrl} 
                    alt={ad.title} 
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                />
                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                     <p className="text-2xl font-bold">{ad.price} TL</p>
                 </div>
            </div>

            {/* Details */}
            <div className="z-10 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/10">
              <h2 className="font-bold text-lg mb-1 line-clamp-2">{ad.title}</h2>
              <div className="flex justify-between text-sm text-slate-300">
                <span>{ad.year} • {capitalizeFirstLetters(ad.fuel_type)}</span>
                <span>{ad.location}</span>
              </div>
            </div>

          </div>

          <div className="flex gap-2 w-full">
            <Button onClick={handleCopyLink} className="flex-1" variant="secondary">
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? "Copied" : "Copy Link"}
            </Button>
            <Button onClick={handleDownload} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download Card
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
