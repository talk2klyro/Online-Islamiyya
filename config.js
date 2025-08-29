// config.js
const CLIENTS = {
  "abdullahi-ibn-abbas": { // Only client
    name: "ABDULLAHI IBN ABBAS",
    motto: "Knowledge is Light 💡",
    email: "abdullahi.ibnabbas@yobe.edu.ng",
    phone: ["08123456789"],
    themeColor: "#1E90FF", // DodgerBlue for branding
    donationDbTitle: "ABDULLAHI IBN ABBAS Donations",
    studentDbTitle: "ABDULLAHI IBN ABBAS Students"
  }
};

function getClientConfig(clientId) {
  return CLIENTS[clientId] || CLIENTS["abdullahi-ibn-abbas"];
}

if (typeof module !== "undefined") {
  module.exports = { CLIENTS, getClientConfig };
}
