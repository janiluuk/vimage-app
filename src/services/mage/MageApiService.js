async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }
  return response.json();
}

const MageApiService = {
  getStatus() {
    return fetchJson('/api/status');
  },
  getQueue() {
    return fetchJson('/api/queue');
  },
};

export default MageApiService;
