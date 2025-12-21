"use client";

import { useCompare } from "@/components/layout/CompareContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { capitalizeFirstLetters } from "@/utils/helpers";

export default function ComparisonTable() {
  const { compareList, removeFromCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">No vehicles to compare</h2>
        <p className="text-muted-foreground mb-8">Add vehicles to your comparison list to see them here.</p>
        <Link href="/">
          <Button>Find Vehicles</Button>
        </Link>
      </div>
    );
  }

  const attributes = [
    { label: "Price", key: "price", format: (val) => `${val} TL` },
    { label: "Brand", key: "brand", format: (val) => capitalizeFirstLetters(val) },
    { label: "Model", key: "model", format: (val) => capitalizeFirstLetters(val) },
    { label: "Year", key: "year" },
    { label: "Mileage", key: "km", format: (val) => `${val} km` },
    { label: "Gear", key: "gear_type", format: (val) => capitalizeFirstLetters(val) },
    { label: "Fuel", key: "fuel_type", format: (val) => capitalizeFirstLetters(val) },
    { label: "Location", key: "location" },
  ];

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Feature</TableHead>
            {compareList.map((ad) => (
              <TableHead key={ad.ad_id} className="min-w-[250px] relative">
               <div className="flex justify-between items-start">
                 <span className="font-bold text-lg text-primary truncate block w-full pr-8">
                   <Link href={`/ad/${ad.ad_id}`} className="hover:underline">{ad.title}</Link>
                 </span>
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className="absolute right-0 top-0 text-muted-foreground hover:text-red-500"
                   onClick={() => removeFromCompare(ad.ad_id)}
                 >
                   <X size={16} />
                 </Button>
               </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
                <TableCell className="font-medium">Image</TableCell>
                {compareList.map((ad) => (
                    <TableCell key={ad.ad_id}>
                         <div className="aspect-video relative rounded-md overflow-hidden h-32 w-full bg-slate-100">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img 
                                src={ad.images && ad.images[0] ? ad.images[0] : (ad.base64Images ? ad.base64Images[0] : '/placeholder.png')} 
                                alt={ad.title}
                                className="object-cover w-full h-full"
                             />
                         </div>
                    </TableCell>
                ))}
            </TableRow>
          {attributes.map((attr) => (
            <TableRow key={attr.key}>
              <TableCell className="font-medium">{attr.label}</TableCell>
              {compareList.map((ad) => (
                <TableCell key={`${ad.ad_id}-${attr.key}`}>
                  {attr.format ? attr.format(ad[attr.key]) : (ad[attr.key] || "-")}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell>Action</TableCell>
            {compareList.map((ad) => (
                <TableCell key={ad.ad_id}>
                     <Link href={`/ad/${ad.ad_id}`}>
                        <Button className="w-full" variant="secondary">
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                     </Link>
                </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
