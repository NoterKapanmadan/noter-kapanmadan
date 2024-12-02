'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { SERVER_URL } from "@/utils/constants";

export const logout = async () => {
  cookies().delete("Authorization");
  redirect('/login');
};

export const sendHistory = async (adID) => {

  const response = await fetch(`${SERVER_URL}/history/add-history`, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Cookie: "Authorization=" + getAuthToken(),
    },
    body: JSON.stringify({ adID }),
  })

  const { msg, error } = await response.json();
  return { msg, error };
};

export const getHistory = async () => {
  const response = await fetch(`${SERVER_URL}/history/get-recent-ads`, {
    method: 'GET',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Cookie: "Authorization=" + getAuthToken(),
    },
  })
  const res = await response.json();
  return res;
};