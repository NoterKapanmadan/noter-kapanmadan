"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { SERVER_URL } from "@/utils/constants";

export const logout = async () => {
  cookies().delete("Authorization");
  redirect("/login");
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
