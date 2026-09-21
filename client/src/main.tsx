import { createRoot, hydrateRoot } from "react-dom/client";
import type { DehydratedState } from "@tanstack/react-query";

import App from "./App";
import { createQueryClient } from "./lib/queryClient";
import type { Language } from "./lib/i18n";
import "./index.css";

declare global {
  interface Window {
    __NORMYACHT_SSR__?: {
      language: Language;
      dehydratedState: DehydratedState;
    };
  }
}

const root = document.getElementById("root")!;

const ssr = window.__NORMYACHT_SSR__;

if (root.hasChildNodes() && ssr) {
  const client = createQueryClient();

  hydrateRoot(
    root,
    <App
      initialLanguage={ssr.language}
      dehydratedState={ssr.dehydratedState}
      client={client}
    />,
  );
} else {
  createRoot(root).render(<App />);
}
