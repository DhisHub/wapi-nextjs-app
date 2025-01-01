import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Blog from "@/components/Blog";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Video from "@/components/Video";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wapi.so - Effortless WhatsApp API for Developers 🚀",
  description:
    "Discover Wapi.so, an open-source, simple, and reliable WhatsApp API. Easily send texts, files, voice, and videos, and create multiple sessions. Perfect for developers who need a seamless way to integrate WhatsApp.",
  keywords: [
    "WhatsApp API",
    "WhatsApp integration",
    "open-source WhatsApp API",
    "WhatsApp developer tools",
    "send text WhatsApp API",
    "WhatsApp file API",
    "WhatsApp voice API",
    "WhatsApp video API",
    "create WhatsApp sessions",
    "developer-friendly WhatsApp API",
    "Wapi.so",
  ],
  creator: "Wapi.so Team",
  robots: "index, follow",
  openGraph: {
    title: "Wapi.so - Simplify WhatsApp API Integration",
    description:
      "Wapi.so is your go-to open-source solution for WhatsApp API integration, featuring text, file, voice, and video sending capabilities, and the ability to create multiple sessions.",
    url: "https://wapi.so",
    images: [
      {
        url: "https://wapi.so/images/screenshot/wapi.png", // Link to the image you want to show
        width: 1200,
        height: 630,
        alt: "Wapi.so WhatsApp API",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image", // Ensures large image preview on Twitter
    title: "Wapi.so - Effortless WhatsApp API for Developers",
    description:
      "Wapi.so offers developers a simple way to integrate WhatsApp with features like text, file, voice, and video sending. Easily manage multiple sessions with an open-source API.",
    images: [
      {
        url: "https://wapi.so/images/screenshot/wapi.png", // Link to the image you want to show
        alt: "Wapi.so WhatsApp API",
      },
    ],
    creator: "@wapi_so",
  },
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      {/* <Video /> */}
      {/* <Brands /> */}
      <AboutSectionOne />
      <AboutSectionTwo />
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
    </>
  );
}
