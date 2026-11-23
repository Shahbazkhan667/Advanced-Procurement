// Mock service boundary. Replace these functions with fetch calls when the API is ready.
export const procurementService = {
  async list(collection, state) { return state[collection] || []; },
  async save(collection, item, actions) { if (collection === "vendors") actions.addVendor(item); if (collection === "requests") actions.addRequest(item); },
};
