const hubspot = require("@hubspot/api-client");
const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPORT_ACCESS_TOKEN,
});
module.exports = hubspotClient;
