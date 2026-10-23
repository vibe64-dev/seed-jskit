import { computed, ref } from "vue";

/**
 * One owner action at a time: `ask` opens the confirmation with its details,
 * `confirm` runs the action, reloads, and leaves a one-sentence notice.
 * Details carry `run()` and `done` (the notice) besides the dialog text.
 */
function useConfirmedAction(reload) {
  const pending = ref(null);
  const busy = ref(false);
  const error = ref("");
  const notice = ref("");

  const dialogOpen = computed({
    get: () => Boolean(pending.value),
    set: (open) => {
      if (!open) pending.value = null;
    }
  });

  // Vue reads "" as true for a Boolean prop, so the snackbar's open state is explicit.
  const noticeOpen = computed({
    get: () => Boolean(notice.value),
    set: (open) => {
      if (!open) notice.value = "";
    }
  });

  function ask(details) {
    error.value = "";
    pending.value = details;
  }

  async function confirm() {
    busy.value = true;
    error.value = "";
    try {
      await pending.value.run();
      await reload();
      notice.value = pending.value.done;
      pending.value = null;
    } catch (problem) {
      error.value = problem.message;
    } finally {
      busy.value = false;
    }
  }

  return { pending, busy, error, notice, dialogOpen, noticeOpen, ask, confirm };
}

export { useConfirmedAction };
