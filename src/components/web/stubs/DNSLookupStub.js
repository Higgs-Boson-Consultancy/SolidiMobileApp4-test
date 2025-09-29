// Stub for react-native-dns-lookup

export const getIpAddressesForHostname = (hostname) => {
  console.warn(`DNS Lookup stub: getIpAddressesForHostname called for ${hostname}`);
  // Return a Promise that resolves to an empty array since DNS lookup is not available in web
  return Promise.resolve([]);
};

export default {
  getIpAddressesForHostname,
};