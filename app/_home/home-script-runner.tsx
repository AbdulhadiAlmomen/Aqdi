"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHome } from "./home-script";

// Starts the homepage's interactions once the markup is in the page, and tears them down on leave.
export function HomeScript() {
  useEffect(() => initHome(gsap, ScrollTrigger), []);
  return null;
}
