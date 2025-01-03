"use client"
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { getImageSrc } from '@/utils/file'

export default function RecommendedAds({ads}) {
    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 1536 }, items: 4 },
        desktop: { breakpoint: { max: 1536, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 3 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
    };

    return (
        <>
            <h3 className="font-semibold text-xl mb-1">Recommended Ads</h3>
            <Carousel
            responsive={responsive}
            containerClass="w-full bg-red-500 rounded-lg mb-4 bg-white border shadow-sm"
            itemClass="p-2"
            ssr = {false}
        >
        {ads.map(ad => (
            <Card key={ad.ad_id} className="flex flex-col bg-gray-50">
            <CardHeader className="p-3">
                {ad.images ?
                <Image
                    src={getImageSrc(ad.images[0], 'medium_resized')}
                    alt={ad.title}
                    width={667}
                    height={500}
                    blurDataURL={ad.base64Image}
                    placeholder={ad.base64Image ? "blur" : "empty"}
                    className="max-w-64 w-64 h-48 object-cover rounded-lg" />
                :
                <div className="w-full h-48 bg-gray-300 rounded-lg" />
                }
            </CardHeader>
            <CardContent className="flex-grow p-3">
                <h3 className="font-medium text-lg mb-1">{ad.title.length > 20 ? `${ad.title.slice(0, 20)}...` : ad.title}</h3>
                  <p className="font-bold text-base mb-2">{`${ad.price}`.length > 35 ? `${ad.price.slice(0, 35)}... TL` : ad.price}</p>
                  <p className="text-sm text-muted-foreground mb-2">{ad.location.length > 35 ? `${ad.location.slice(0, 35)}...` : ad.location}</p>
                  {`${ad.brand} ${ad.model} ${ad.year} • ${ad.km}`.length > 35 
                    ? `${ad.brand} ${ad.model} ${ad.year} • ${ad.km}`.slice(0, 35) + '...' 
                    : `${ad.brand} ${ad.model} ${ad.year} • ${ad.km}`}
            </CardContent>
            <CardFooter className="p-3">
                <Button className="w-full" asChild>
                <Link href={`/ad/${ad.ad_id}`}>View Details</Link>
                </Button>
            </CardFooter>
            </Card>
      ))}
        </Carousel>
        </>
    );
}