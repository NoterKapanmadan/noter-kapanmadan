"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt, getAuthToken } from "@/lib/auth";
import { SERVER_URL } from "@/utils/constants";
import { revalidatePath, revalidateTag } from "next/cache";
import { mapsReverseGeocode } from "@/utils/maps";

export const revalidatePathClient = revalidatePath;
export const revalidateTagClient = revalidateTag;

export const logout = async () => {
  cookies().delete("Authorization");
  redirect("/");
};

export const getAccountID = async () => {
  const token = getAuthToken();
  const payload = await decrypt(token);

  return payload?.account_id;
};

export const isAdmin = async () => {
  const token = getAuthToken();
  const payload = await decrypt(token);

  return !!payload?.account_id && !!payload.isAdmin;
};

export const updateProfile = async (formData, account_id) => {
  const response = await fetch(`${SERVER_URL}/profile/${account_id}`, {
    method: "POST",
    cache: "no-store",
    body: formData,
    headers: {
      Cookie: "Authorization=" + getAuthToken(),
    },
  });

  const { msg, error } = await response.json();

  return { msg, error };
};

export const isAuthenticated = async () => {
  const token = getAuthToken();
  const payload = await decrypt(token);

  return !!payload?.account_id;
};

export const getCurrentUserInfo = async () => {
  const token = getAuthToken();
  const payload = await decrypt(token);

  if (!!payload?.account_id) {
    const res = await fetch(`${SERVER_URL}/profile/${payload.account_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 600, tags: ["currentUser"] },
    });
    const user = await res.json();
    return user;
  }

  return null;
};

export const sendHistory = async (adID) => {
  const authenticated = await isAuthenticated();
  const admin = await isAdmin();
  
  if (!authenticated || admin) return;

  const response = await fetch(`${SERVER_URL}/history/add-history`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: "Authorization=" + getAuthToken(),
    },
    body: JSON.stringify({ adID }),
  });

  const { msg, error } = await response.json();
  return { msg, error };
};

export const getHistory = async () => {
  const response = await fetch(`${SERVER_URL}/history/get-recent-ads`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: "Authorization=" + getAuthToken(),
    },
  });
  const res = await response.json();
  return res;
};

export async function getLocationToAddress(lat, lng) {
  const res = await mapsReverseGeocode(lat, lng);
  return res;
}
export const getBalance = async () => {
  const response = await fetch(`${SERVER_URL}/balance/set-balance`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: "Authorization=" + getAuthToken(),
    },
  });
  const res = await response.json();
  return res;
}

export const getTransactions = async () => {
  const response = await fetch(`${SERVER_URL}/transaction/get-transactions`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: "Authorization=" + getAuthToken(),
    },
  });
  const res = await response.json();
  return res;
}

export const getOffers = async () => {
  const response = await fetch(`${SERVER_URL}/offer/get-offers`, {
    method: "GET",
    cache: "no-cache",
    next: { tags: ["offers"] },
    headers: {
      "Content-Type": "application/json",
      Cookie: "Authorization=" + getAuthToken(),
    },
  });

  const res = await response.json();
  return res;
}

export const getChatRoom = async (account_ID) => {
  const response = await fetch(`${SERVER_URL}/chat/get-chat/${account_ID}`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: "Authorization=" + getAuthToken(),
    },
  });

  const res = await response.json();
  return res;
}

export const getChatRooms = async () => {
  const response = await fetch(`${SERVER_URL}/chat/get-chats`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: "Authorization=" + getAuthToken(),
    },
  });

  const res = await response.json();
  return res;
}

export const getRecommendedAds = async () => {
  const response = await fetch(`${SERVER_URL}/ad/recommended-ads`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: "Authorization=" + getAuthToken(),
    },
  });

  const res = await response.json();
  return res;
}

/*export async function updateAd(ad_ID, updatedData) {
  const res = await fetch(`${SERVER_URL}/ad/update-ad/${ad_ID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: "Authorization=" + getAuthToken(),
    },
    body: JSON.stringify(updatedData),
    cache: 'no-cache',
  });


  if (!res.ok) {
    throw new Error("Failed to update ad");
  }

  const data = await res.json();
  return data;
}*/

export const getBrands = async () => {
  const response = await fetch(`${SERVER_URL}/vehicles/get-brands`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const res = await response.json();
  return res.brands;
}

export const getModels = async (brand) => {
  const response = await fetch(`${SERVER_URL}/vehicles/get-models/${brand}`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const res = await response.json();
  return res.models;
}

export const getRatings = async (account_id) => {
  const response = await fetch(`${SERVER_URL}/rating/get-ratings/${account_id}`, {
    method: "GET",
    cache: "no-cache",
    next: { tags: ["ratings"] },
    headers: {
      "Content-Type": "application/json",
    },
  });

  const res = await response.json();
  return res;
}