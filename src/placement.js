import { createPlacementRegistry } from "@jskit-ai/shell-web/client/placement";

const registry = createPlacementRegistry();
const { addPlacement } = registry;

export { addPlacement };

export default function getPlacements() {
  return registry.build();
}

addPlacement({
  id: "account-app.home.menu.home",
  target: "shell.primary-nav",
  kind: "link",
  surfaces: ["home"],
  order: 50,
  props: {
    label: "Home",
    surface: "home",
    scopedSuffix: "/",
    unscopedSuffix: "/",
    exact: true
  }
});

addPlacement({
  id: "auth.profile.widget",
  target: "shell.status",
  kind: "component",
  surfaces: ["*"],
  order: 1000,
  componentToken: "auth.web.profile.widget"
});

addPlacement({
  id: "auth.profile.menu.sign-in",
  target: "auth.profile-menu",
  kind: "link",
  surfaces: ["*"],
  order: 200,
  when: (context) => context?.auth?.authenticated !== true,
  props: {
    label: "Sign in",
    to: "/auth/login"
  }
});

addPlacement({
  id: "users.profile.menu.settings",
  target: "auth.profile-menu",
  kind: "link",
  surfaces: ["*"],
  order: 500,
  when: (context) => context?.auth?.authenticated === true,
  props: {
    label: "Account settings",
    to: "/account"
  }
});

addPlacement({
  id: "auth.profile.menu.sign-out",
  target: "auth.profile-menu",
  kind: "link",
  surfaces: ["*"],
  order: 1000,
  when: (context) => context?.auth?.authenticated === true,
  props: {
    label: "Sign out",
    to: "/auth/signout"
  }
});

addPlacement({
  id: "users.account.settings.profile",
  target: "settings.sections",
  owner: "account-settings",
  kind: "component",
  surfaces: ["account"],
  order: 100,
  componentToken: "local.main.account-settings.section.profile",
  props: {
    value: "profile",
    title: "Profile",
    usesSharedRuntime: true
  }
});

addPlacement({
  id: "users.account.settings.preferences",
  target: "settings.sections",
  owner: "account-settings",
  kind: "component",
  surfaces: ["account"],
  order: 200,
  componentToken: "local.main.account-settings.section.preferences",
  props: {
    value: "preferences",
    title: "Preferences",
    usesSharedRuntime: true
  }
});

addPlacement({
  id: "users.account.settings.notifications",
  target: "settings.sections",
  owner: "account-settings",
  kind: "component",
  surfaces: ["account"],
  order: 300,
  componentToken: "local.main.account-settings.section.notifications",
  props: {
    value: "notifications",
    title: "Notifications",
    usesSharedRuntime: true
  }
});
