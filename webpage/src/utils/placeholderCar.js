import { capitalizeFirstLetters } from "./helpers";

const url =
  "https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?fuel_type=diesel&limit=30";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    "x-rapidapi-host": "cars-by-api-ninjas.p.rapidapi.com",
  },
};

export const createCarImage = (car) => {
  const url = new URL("https://cdn.imagin.studio/getimage");

  const { make, year, model } = car;

  url.searchParams.append("customer", "hrjavascript-mastery");
  url.searchParams.append("zoomType", "fullscreen");
  url.searchParams.append("paintdescription", "radiant-green");
  url.searchParams.append("modelFamily", model.split(" ")[0]);
  url.searchParams.append("make", make);
  url.searchParams.append("modelYear", `${year}`);
  url.searchParams.append("angle", `90`);

  return `${url}`;
};

const getRandomLocation = () => {
  const locations = [
    "New York",
    "Chicago",
    "Los Angeles",
    "San Francisco",
    "Miami",
    "Ankara",
    "Amsterdam",
    "Berlin",
    "Paris",
    "London",
  ];
  const randomIndex = Math.floor(Math.random() * locations.length);

  return locations[randomIndex];
};

const getRandomFormattedDate = () => {
  const year = Math.floor(Math.random() * 3) + 2021;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;

  return `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;
};

export const getRandomCars = async () => {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const carsWithImages = result.map((car, index) => {
      return {
        ...car,
        model: capitalizeFirstLetters(car.model),
        make: capitalizeFirstLetters(car.make),
        transmission: capitalizeFirstLetters(car.transmission),
        image: createCarImage(car),
        id: index,
        title: capitalizeFirstLetters(`${car.make} ${car.model} ${car.year}`),
        price: Math.floor(Math.random() * 300 + 100) * 100,
        date: getRandomFormattedDate(),
        location: getRandomLocation(),
        brand: capitalizeFirstLetters(car.model),
        km: Math.floor(Math.random() * 10000) * 10,
        gear_type: (car.transmission = "A" ? "Automatic" : "Manual"),
        fuel_type: capitalizeFirstLetters(car.fuel_type),
      };
    });

    return carsWithImages;
  } catch (error) {
    console.error(error);
    return [];
  }
};
