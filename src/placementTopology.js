// The hub draws its own navigation, so it declares no shell placement outlets.
const placements = [];

function addPlacementTopology(value = {}) {
  placements.push(value);
}

export { addPlacementTopology };
export default { placements };
