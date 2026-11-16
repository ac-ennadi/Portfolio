"use client";
import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from "react";
import type {Mode} from "@/data/portfolioData";
type Theme={primary:string;secondary:string;label:string;emphasis:string};
const themes:Record<Mode,Theme>={systems:{primary:"#38BDF8",secondary:"#818CF8",label:"Systems & Code",emphasis:"monospace"},unified:{primary:"#38BDF8",secondary:"#F59E0B",label:"Unified",emphasis:"balanced"},creative:{primary:"#F59E0B",secondary:"#FB7185",label:"Creative & Motion",emphasis:"editorial"}};
const Context=createContext<{mode:Mode;setMode:(mode:Mode)=>void;theme:Theme}|null>(null);
export function ModeProvider({children}:{children:ReactNode}){const[mode,setMode]=useState<Mode>("unified");const theme=useMemo(()=>themes[mode],[mode]);useEffect(()=>{document.documentElement.dataset.mode=mode;document.documentElement.style.setProperty("--accent",theme.primary);document.documentElement.style.setProperty("--accent-secondary",theme.secondary)},[mode,theme]);return <Context.Provider value={{mode,setMode,theme}}>{children}</Context.Provider>}
export function useMode(){const value=useContext(Context);if(!value)throw new Error("useMode must be used inside ModeProvider");return value}
