import { createPlacementRegistry } from "@jskit-ai/shell-web/client/placement";

// The hub draws its own navigation (src/components/hub/HubAppLayout.vue), so
// it registers no shell placements.
const registry = createPlacementRegistry();

export const { addPlacement } = registry;

export default function getPlacements() {
  return registry.build();
}
