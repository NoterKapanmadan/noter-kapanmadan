"use client"

import Link from 'next/link';
import { useState } from 'react';
import { isAuthenticated } from '@/app/actions';
import LoginDialog from '@/components/layout/LoginDialog';
import RegisterDialog from '@/components/layout/RegisterDialog';
import { useRouter, usePathname } from 'next/navigation';
import { revalidatePathClient } from '@/app/actions';

export default function AuthLink({ href = "/", children, refresh = false }) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navigate = () => {
    const path = refresh ? pathname : href;
    revalidatePathClient(path);
    router.push(path);
  }

  const checkAuth = async (e) => {
    e.preventDefault();

    const isAuth = await isAuthenticated();

    if (!isAuth) {
      setLoginOpen(true);
    } else {
      navigate()
    }
  }

  const switchModal = () => {
    setLoginOpen(val => !val);
    setRegisterOpen(val => !val);
  }

  return (
    <>
      <Link href={href} onClick={checkAuth} >
        {children}
      </Link>
      <LoginDialog open={loginOpen} setOpen={setLoginOpen} switchModal={switchModal} navigate={navigate} />
      <RegisterDialog open={registerOpen} setOpen={setRegisterOpen} switchModal={switchModal} />
    </>
  );
}