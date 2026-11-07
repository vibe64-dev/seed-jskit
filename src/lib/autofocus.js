// v-autofocus puts the caret in a form's first field once, as the field
// mounts. Vuetify's own autofocus prop also focuses the field again 50 ms after
// it first shows, wherever the focus is by then, so text already being typed
// into the next field went into the first one.
export const vAutofocus = {
  mounted(el) {
    el.querySelector("input, textarea")?.focus();
  }
};
