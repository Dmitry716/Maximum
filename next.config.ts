import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async redirects() {
    return [
      {
        source: "/obrazovanie/:slug",
        destination: "/courses/:slug",
        permanent: true,
      },
      {
        source: "/sport/:slug",
        destination: "/courses/:slug",
        permanent: true,
      },
      {
        source: "/razvitie/:slug",
        destination: "/courses/:slug",
        permanent: true,
      },
      {
        source: "/logoped/:slug",
        destination: "/courses/:slug",
        permanent: true,
      },
      // {
      //   source: "/obrazovanie/podgotovka-k-ct-i-ce-po-himii-i-biologii",
      //   destination: "/courses/podgotovka-k-ct-i-ce-po-himii-i-biologii",
      //   permanent: true,
      // },
      // {
      //   source: "/sport/gimnastika-razvivayushaya",
      //   destination: "/courses/gimnastika-razvivayushaya",
      //   permanent: true,
      // },
      // {
      //   source: "/sport/gimnastika-razvivayushaya",
      //   destination: "/courses/gimnastika-razvivayushaya",
      //   permanent: true,
      // },
      // {
      //   source: "/sport/gimnastika-razvivayushaya",
      //   destination: "/courses/gimnastika-razvivayushaya",
      //   permanent: true,
      // },
      // {
      //   source: "/obrazovanie/anglijskij-yazyk",
      //   destination: "/courses/anglijskij-yazyk",
      //   permanent: true,
      // },
      // {
      //   source: "/obrazovanie/graficheskij-dizajn",
      //   destination: "/courses/graficheskij-dizajn",
      //   permanent: true,
      // },
      // {
      //   source: "/razvitie/bloger-studiya-teenwave",
      //   destination: "/courses/bloger-studiya-teenwave",
      //   permanent: true,
      // },
      // {
      //   source: "/obrazovanie/podgotovka-k-shkole",
      //   destination: "/courses/podgotovka-k-shkole",
      //   permanent: true,
      // },
      // {
      //   source: "/razvitie/kalligrafiya",
      //   destination: "/courses/kalligrafiya",
      //   permanent: true,
      // },
      // {
      //   source: "/razvitie/skorochtenie",
      //   destination: "/courses/skorochtenie",
      //   permanent: true,
      // },
      // {
      //   source: "/sport/nastolnyj-tennis",
      //   destination: "/courses/nastolnyj-tennis",
      //   permanent: true,
      // },
      // {
      //   source: "/razvitie/klub-veselyh-i-nahodchivyh",
      //   destination: "/courses/klub-veselyh-i-nahodchivyh",
      //   permanent: true,
      // },
      // {
      //   source: "/obrazovanie/programmirovanie-scratch",
      //   destination: "/courses/programmirovanie-scratch",
      //   permanent: true,
      // },
    ];
  },
  images: {
    domains: ["localhost", "maxximum.by"],
  },
  output: "standalone",
};

export default nextConfig;
