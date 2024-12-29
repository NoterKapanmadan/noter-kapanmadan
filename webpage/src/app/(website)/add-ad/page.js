import { getBrands } from "@/app/actions";
import AddAd from "@/components/layout/AddAd";

export default async function AddAdPage() {


  const brands = await getBrands();

  return(
    <AddAd brands={brands}/>
  )
}

