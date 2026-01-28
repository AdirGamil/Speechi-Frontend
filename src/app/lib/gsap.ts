/**
 * GSAP plugin registration (once at app init).
 * ScrollTrigger used for landing trust section; useGSAP for React cleanup.
 */

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);
