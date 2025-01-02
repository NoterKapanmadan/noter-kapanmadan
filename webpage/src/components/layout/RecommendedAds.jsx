"use client"
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { getRecommendedAds } from "@/app/actions";
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { getImageSrc } from '@/utils/file'
import { formatDate } from '@/utils/date'

function getTruncatedLocation(loc) {
    if (!loc) return '';
    if (loc.length > 41) return loc.substring(0, 39) + '..';
    return loc;
}

export default async function RecommendedAds() {
    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 1536 }, items: 4 },
        desktop: { breakpoint: { max: 1536, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 3 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
    };
    const res = await getRecommendedAds();
    const ads = res.finalizedAds
    console.log(ads);
    
    return (
        <Carousel
            responsive={responsive}
            containerClass="w-full"
            itemClass="p-2"
        >
        {ads.map(ad => (
        <div>
            <Card key={ad.ad_id} className="flex flex-col">
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
                <CardTitle className="mb-2">{ad.title}</CardTitle>
                <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">${ad.price}</p>
                <p className="text-sm text-muted-foreground">{formatDate(ad.date)}</p>
                <p className="text-sm text-muted-foreground">
                    {getTruncatedLocation(ad.location)}
                </p>
                <p className="text-sm">{ad.brand} - {ad.model}</p>
                <p className="text-sm">{ad.year} - {ad.km} km</p>
                <p className="text-sm">{ad.gear_type} - {ad.fuel_type}</p>
                </div>
            </CardContent>
            <CardFooter className="p-3">
                <Button className="w-full" asChild>
                <Link href={`/ad/${ad.ad_id}`}>View Details</Link>
                </Button>
            </CardFooter>
            </Card>
        </div> 
      ))}
        </Carousel>
    );
}