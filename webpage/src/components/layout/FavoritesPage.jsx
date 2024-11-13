"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ExternalLink, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function Component({ favorites: initialFavorites }) {
  const [favorites, setFavorites] = useState(initialFavorites);

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter((favorite) => favorite.id !== id));
    // Here you would typically make an API call to remove the favorite
    console.log(`Removed favorite ${id}`);
  };

  const handleViewDetails = (id) => {
    // Here you would typically navigate to the car details page
    console.log(`Viewing details for ${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Favorite Cars</h1>
      {favorites.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven't added any cars to your favorites yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => (
            <Card key={favorite.id}>
              <CardHeader>
                <CardTitle>{favorite.model}</CardTitle>
                <CardDescription>${favorite.price}</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={favorite.image}
                  alt={favorite.model}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="secondary">{favorite.km} miles</Badge>
                  <span className="text-sm text-muted-foreground">
                    {favorite.location}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 mb-2">
                  <Badge variant="outline">{favorite.fuel_type}</Badge>
                  <Badge variant="outline">{favorite.gear_type}</Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Listed on {format(favorite.date, "MMMM d, yyyy")}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveFavorite(favorite.id)}
                >
                  <Heart className="mr-2 h-4 w-4 fill-current" /> Remove
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleViewDetails(favorite.id)}
                >
                  <ExternalLink className="mr-2 h-4 w-4" /> View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
