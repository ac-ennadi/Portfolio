import type {Metadata} from "next";
import {Inter,JetBrains_Mono} from "next/font/google";
import "./globals.css";
import "./raycast.css";
import "./polish.css";
const ui=Inter({subsets:["latin"],variable:"--font-ui",display:"swap"});
const mono=JetBrains_Mono({subsets:["latin"],variable:"--font-mono",display:"swap"});
export const metadata:Metadata={title:"Achraf Ennadiri — Engineer & Creative Director",description:"Software engineer and commercial video editor building systems and directing visuals in Ben Guerir, Morocco."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-mode="unified"><body className={`${ui.variable} ${mono.variable}`}>{children}</body></html>}
