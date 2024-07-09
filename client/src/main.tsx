import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ProModalContext } from "./contexts/ProModal";
import Modal from "./components/custom/Modal";
import { Toaster } from "react-hot-toast";
import CrispProvider from "./components/custom/CrispProvider";
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CrispProvider />
    <ProModalContext>
      <QueryClientProvider client={queryClient}>
        <Modal />
        <App />
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ProModalContext>
  </React.StrictMode>,
);
