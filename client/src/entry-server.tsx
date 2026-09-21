import React from "react";
import { renderToString } from "react-dom/server";
import {
  QueryClient,
  dehydrate,
  type DehydratedState,
} from "@tanstack/react-query";

import App from "./App";
import type { Language } from "./lib/i18n";

export type SSRPrefetchData = {
  slider?: unknown[];
  services?: unknown[];
  projects?: unknown[];
  news?: unknown[];
  service?: {
    slug: string;
    data: unknown;
  };
  project?: {
    slug: string;
    data: unknown;
  };
  newsItem?: {
    slug: string;
    data: unknown;
  };
};

export type SSRRenderOptions = {
  path: string;
  language: Language;
  prefetch?: SSRPrefetchData;
};

export type SSRRenderResult = {
  html: string;
  dehydratedState: DehydratedState;
};

export function render({
  path,
  language,
  prefetch = {},
}: SSRRenderOptions): SSRRenderResult {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  if (prefetch.slider) {
    client.setQueryData(["/api/slider"], prefetch.slider);
  }

  if (prefetch.services) {
    client.setQueryData(["/api/services"], prefetch.services);
  }

  if (prefetch.projects) {
    client.setQueryData(["/api/projects"], prefetch.projects);
  }

  if (prefetch.news) {
    client.setQueryData(["/api/news"], prefetch.news);
  }

  if (prefetch.service) {
    client.setQueryData(
      ["/api/services", prefetch.service.slug],
      prefetch.service.data,
    );
  }

  if (prefetch.project) {
    client.setQueryData(
      ["/api/projects", prefetch.project.slug],
      prefetch.project.data,
    );
  }

  if (prefetch.newsItem) {
    client.setQueryData(
      ["/api/news", prefetch.newsItem.slug],
      prefetch.newsItem.data,
    );
  }

  const dehydratedState = dehydrate(client);

  const html = renderToString(
    <App
      ssrPath={path}
      initialLanguage={language}
      dehydratedState={dehydratedState}
      client={client}
    />,
  );

  return {
    html,
    dehydratedState,
  };
}
