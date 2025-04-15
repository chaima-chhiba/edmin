const jwt = require('jsonwebtoken');
const axios = require('axios'); 

async function searchHubSpotCompany(req, res) {
  const companyId = req.params.id;
  console.log("companyId: ", companyId);

  const properties = [
    "name",
    "hs_object_id",
    "hs_lastmodifieddate",
    "createdate",
    "school_address",
    "type_de_l_ecole",
    "school_phone_number",
    "city",
    "school_province"
  ];

  try {
    const result = await hubspotClient.crm.companies.basicApi.getById(companyId, properties);
    console.log(result);
    res.json(result.body || result);
  } catch (error) {
    console.error("Error message: ", error.message);
    res.status(404).json({ message: error.message });
  }
}

async function searchCompanies(req, res) {
  try {
    const searchQuery = req.query.query;
    console.log("searchQuery ", searchQuery);
    const filter = {
      propertyName: "name",
      operator: "CONTAINS_TOKEN",
      value: searchQuery,
    };

    const filterGroup = {
      filters: [filter],
    };

    const sort = JSON.stringify({
      propertyName: "createdate",
      direction: "DESCENDING",
    });

    const properties = [
      "name",
      "hs_object_id",
      "hs_lastmodifieddate",
      "createdate",
      "school_address",
      "type_de_l_ecole",
      "school_phone_number"
    ];
    const limit = 100;
    const after = 0;

    const searchBody = {
      filterGroups: [filterGroup],
      sorts: [sort],
      properties: properties,
      limit: limit,
      after: after,
    };

    const searchResults = await hubspotClient.crm.companies.searchApi.doSearch(searchBody);
    res.json(searchResults.results);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error });
  }
}



function toCamelCase(str) {
  return str
    .replace(/[^a-zA-Z\s]/g, '') 
    .split(' ')
    .map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

async function handleWebhook(req, res) {
  const events = req.body;
console.log(events);
  try {
    for (const event of events) {
      const { objectId, propertyValue } = event;

      if (propertyValue === 'CONNECTED') {
        const companyData = await axios.get(`${process.env.edmin_URL}/api/hubspot/company/${objectId}`);
        const hubSpotId = companyData.data.id;

        let existingCompany;
        try {
          existingCompany = await axios.get(`${process.env.edmin_URL}/api/client/check-client/${hubSpotId}`);
        } catch (err) {
          if (err.response && err.response.status === 404) {
            console.log(`Company with HubSpot ID ${hubSpotId} does not exist. Proceeding to create a new one.`);
            existingCompany = null;
          } else {
            throw err;
          }
        }

        if (existingCompany && existingCompany.data.exists) {
          console.log(`Company with HubSpot ID ${hubSpotId} already exists. Skipping creation.`);
          return res.status(409).send({ message: `Company with HubSpot ID ${hubSpotId} already exists.` });
        }

        const baseName = companyData.data.properties.name.toLowerCase().replace(/\s+/g, '');
        const dbName = toCamelCase(baseName);
        let type = companyData.data.properties.type_de_l_ecole || "ecole"; 

        switch (type) {
          case "Collège;Lycée":
            type = "collegeEtLycee";
            break;
          case "Collège":
            type = "college";
            break;
          case "Lycée":
            type = "lycee";
            break;
          default:
            type = "ecole"; 
        }

        const addressComponents = [
          companyData.data.properties.school_province,
          companyData.data.properties.city,
          companyData.data.properties.school_address
        ];

        const address = addressComponents.filter(Boolean).join(', ');

        let phone = companyData.data.properties.school_phone_number;
        phone = phone.replace(/\D/g, '');
        phone = Number(phone);

        if (isNaN(phone)) {
          return res.status(400).send({
            message: "Invalid phone number received",
            error: "ValidationError: phone number must be a valid number"
          });
        }

        const headMaster = `${companyData.data.properties.name} Headmaster`;
        const userName = `${companyData.data.properties.name.replace(/\s+/g, '').toLowerCase()}admin1`;
        const password = `${companyData.data.properties.name.replace(/\s+/g, '').toLowerCase()}123`;

        const buildingData = {
          dbName: dbName,
          name: companyData.data.properties.name,
          type: type,
          legalName: companyData.data.properties.name,
          adress: address,
          phone: phone,
          headMaster: headMaster,
          sms: {
            solde: 0,
            senderName: "EdTrust"
          }
        };

        const userData = {
          userName: userName,
          password: password
        };

        const token = jwt.sign(
          {
            id: buildingData.name,
            dbName: dbName,
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: '1h',
          }
        );
console.log(buildingData,userData);
        let putResponse;
        try {
          putResponse = await axios.put(`${process.env.SERVER_URL}/api/edmin/crm/building`,
            { building: buildingData, user: userData },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              }
            }
          );
          console.log('Response from the PUT request:', putResponse.data);
        } catch (err) {
          if (err.response && err.response.status === 409) {
            console.error(`Building conflict: ${err.response.data.message}`);
            return res.status(409).send({
              message: `Building conflict: ${err.response.data.message}`,
              error: err.response.data
            });
          } else {
            throw err;
          }
        }

        let postResponse;
        try {
          postResponse = await axios.post(`${process.env.edmin_URL}/api/client`,
            {
              schoolName: companyData.data.properties.name,
              schoolType: type,
              tel: phone,
              idHubSpot: hubSpotId,
              dbName: dbName,
              headMaster: headMaster,
              address: address,
              legalName: companyData.data.properties.name,
              user: {
                userName: userName,
                password: password,
              }
            },
          );
          console.log('User created on your server:', postResponse.data);
        } catch (err) {
          if (err.response && err.response.status === 409) {
            console.error(`User creation conflict: ${err.response.data.message}`);
            return res.status(409).send({
              message: `User creation conflict: ${err.response.data.message}`,
              error: err.response.data
            });
          } else {
            throw err;
          }
        }

        res.status(200).send({
          building: putResponse.data,
          user: postResponse.data,
        });
      } else {
        res.status(204).send();
      }
    }
  } catch (error) {
    console.error(`Failed to process webhook for a company event:`, error.message);
    res.status(500).send({ message: `Failed to process webhook: ${error.message}`, error });
  }
}
async function checkClientByHubSpotId(req, res) {
  try {
    const { idHubSpot } = req.params;
    const client = await Client.findOne({ idHubSpot });
    if (client) {
      return res.json({ exists: true, client });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Check Client by HubSpot ID Error:", error);
    res.status(500).json({ error: "Server error" });
  }
}



module.exports = { searchHubSpotCompany, searchCompanies, handleWebhook ,checkClientByHubSpotId};
