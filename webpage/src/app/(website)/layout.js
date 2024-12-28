import Header from "@/components/layout/Header";

export default function RootLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
