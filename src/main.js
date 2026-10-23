import { createApp } from "vue";
import { createPinia } from "pinia";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";
import { createRouter, createWebHistory } from "vue-router/auto";
import { routes } from "vue-router/auto-routes";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases as mdiAliases, mdi } from "vuetify/iconsets/mdi-svg";
import App from "./App.vue";
import NotFoundView from "./views/NotFound.vue";
import { bootInstalledClientModules } from "virtual:jskit-client-bootstrap";
import { createSurfaceRuntime } from "@jskit-ai/kernel/shared/surface/runtime";
import {
  shouldRetryTransientQueryFailure,
  transientQueryRetryDelay
} from "@jskit-ai/kernel/shared/support";
import {
  bootstrapClientShellApp,
  createShellRouter
} from "@jskit-ai/kernel/client";
import { config } from "../config/public.js";

const surfaceRuntime = createSurfaceRuntime({
  allMode: config.surfaceModeAll,
  surfaces: config.surfaceDefinitions,
  defaultSurfaceId: config.surfaceDefaultId
});

const surfaceMode = surfaceRuntime.normalizeSurfaceMode(import.meta.env.VITE_SURFACE);
const { router, fallbackRoute } = createShellRouter({
  createRouter,
  history: createWebHistory(),
  routes,
  surfaceRuntime,
  surfaceMode,
  notFoundComponent: NotFoundView,
  guard: {
    surfaceDefinitions: config.surfaceDefinitions,
    defaultSurfaceId: config.surfaceDefaultId,
    webRootAllowed: config.webRootAllowed
  }
});

const vuetify = createVuetify({
  theme: {
    defaultTheme: "system",
    themes: {
      light: {
        dark: false,
        colors: {
          background: "#F6F7FC",
          surface: "#FFFFFF",
          "surface-variant": "#E1E2EC",
          "on-surface-variant": "#44474F",
          primary: "#2F5BB0",
          secondary: "#575E71",
          success: "#1B7F4A",
          warning: "#9A5B00",
          error: "#BA1A1A"
        }
      },
      dark: {
        dark: true,
        colors: {
          background: "#0F1116",
          surface: "#181B22",
          "surface-variant": "#2B2F38",
          "on-surface-variant": "#C4C6D0",
          primary: "#AFC6FF",
          secondary: "#BFC6DC",
          success: "#7FD8A4",
          warning: "#F5BD6B",
          error: "#FFB4AB"
        }
      }
    }
  },
  defaults: {
    VBtn: { rounded: "pill", style: "text-transform: none; letter-spacing: 0;" },
    VTextField: { variant: "outlined", density: "comfortable", color: "primary" },
    VCard: { rounded: "xl" }
  },
  icons: {
    defaultSet: "mdi",
    aliases: mdiAliases,
    sets: { mdi }
  }
});
const pinia = createPinia();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: shouldRetryTransientQueryFailure,
      retryDelay: transientQueryRetryDelay
    }
  }
});

void bootstrapClientShellApp({
  createApp,
  rootComponent: App,
  appConfig: config,
  appPlugins: [
    pinia,
    [VueQueryPlugin, { queryClient }],
    vuetify
  ],
  pinia,
  queryClient,
  router,
  bootClientModules: bootInstalledClientModules,
  surfaceRuntime,
  surfaceMode,
  env: import.meta.env,
  fallbackRoute
}).catch((error) => {
  console.error("Failed to bootstrap client app.", error);
  const status = document.getElementById("startup-status");
  if (status) {
    status.textContent = "The application could not open. Reload the page to try again.";
  }
});
