"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("compareList");
    if (saved) {
      try {
        setCompareList(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse compare list", e);
      }
    }
  }, []);

  const addToCompare = (ad) => {
    if (compareList.find((item) => item.ad_id === ad.ad_id)) {
      toast({
        title: "Already Added",
        description: "This vehicle is already in your comparison list.",
      });
      return;
    }

    if (compareList.length >= 3) {
      toast({
        title: "Limit Reached",
        description: "You can compare up to 3 vehicles at a time.",
        variant: "destructive",
      });
      return;
    }

    const updatedList = [...compareList, ad];
    setCompareList(updatedList);
    localStorage.setItem("compareList", JSON.stringify(updatedList));
    
    toast({
      title: "Added to Compare",
      description: "Vehicle added to comparison list.",
    });
  };

  const removeFromCompare = (adID) => {
    const updatedList = compareList.filter((item) => item.ad_id !== adID);
    setCompareList(updatedList);
    localStorage.setItem("compareList", JSON.stringify(updatedList));
  };

  const isInCompare = (adID) => {
    return compareList.some((item) => item.ad_id === adID);
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
