import { lazy } from "react";

export const Landing = lazy(() => import("./Landing"));
export const Login = lazy(() => import("./Login"));
export const Register = lazy(() => import("./Register"));
export const Dashboard = lazy(() => import("./Dashboard"));
export const StockMarket = lazy(() => import("./StockMarket"));
export const StockDetail = lazy(() => import("./StockDetail"));
export const Portfolio = lazy(() => import("./Portfolio"));
export const Transactions = lazy(() => import("./Transactions"));
export const Watchlist = lazy(() => import("./Watchlist"));
export const Profile = lazy(() => import("./Profile"));
export const About = lazy(() => import("./About"));