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
  if (!isAuthenticated()) return;

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
    next: { revalidate: 60, tags: ["offers"] },
    headers: {
      "Content-Type": "application/json",
      Cookie: "Authorization=" + getAuthToken(),
    },
  });

  const res = await response.json();
  return res;
}