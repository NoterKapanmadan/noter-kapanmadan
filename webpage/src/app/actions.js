'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt, getAuthToken } from "@/lib/auth";
import { SERVER_URL } from "@/utils/constants";
import { revalidatePath, revalidateTag } from "next/cache";

export const revalidatePathClient = revalidatePath;
export const revalidateTagClient = revalidateTag;

export const logout = async () => {
  cookies().delete("Authorization");
  redirect('/');
};

export const isAuthenticated = async () => {
  const token = getAuthToken()
  const payload = await decrypt(token)
  const isAuthenticated = payload?.account_id

  return Boolean(payload?.account_id)
}

export const sendHistory = async (adID) => {
  if (!isAuthenticated()) return

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