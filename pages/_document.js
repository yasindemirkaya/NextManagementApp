import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  // Tema bilgisini localStorage'dan alıyoruz
  const theme = typeof window !== "undefined" && localStorage.getItem("theme");

  return (
    <Html lang="en" data-bs-theme={theme || "light"}> {/* Eğer tema yoksa, varsayılan olarak "light" kullanılır */}
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
