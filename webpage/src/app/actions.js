"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthToken, decrypt } from "@/lib/auth";
import { SERVER_URL } from "@/utils/constants";

export const logout = async () => {
  cookies().delete("Authorization");
  redirect("/login");
};

export const getAccountID = async () => {
  const token = getAuthToken();
  const payload = await decrypt(token);

  return payload?.account_id;
};

export const updateProfile = async (formData, account_id) => {
  console.log("update profile test");
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
