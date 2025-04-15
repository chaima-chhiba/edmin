const Client = require("../models/Client");

const mongoose = require("mongoose");


async function addClient(req, res) {
  try {
    const { logo, schoolName, schoolType, tel, idHubSpot, dbName, pack,headMaster, address, legalName, user} = req.body;

    const newClient = new Client({
      logo,
      schoolName,
      schoolType,
      tel,
      idHubSpot,
      dbName,
      pack,
      headMaster,
      address,
      legalName,
      user: {
        userName: user.userName,
        password: user.password,
      }
    });
    await newClient.save();

 

  
    res.status(201).json({
      message: "Client and admin user added successfully",
      client: newClient,
      
    });
  } catch (error) {
    console.error("Add Client Error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
// Function to get a client by ID
async function getClient(req, res) {
  try {
    const clientId = req.params.id;
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    console.error("Get Client Error:", error);
    res.status(500).json({ error: "Server error" });
  }
}

// Function to update a client
async function updateClient(req, res) {
  try {
    const clientId = req.params.id;
    const updateData = req.body;

    const updatedClient = await Client.findByIdAndUpdate(clientId, updateData, {
      new: true,
    });

    if (!updatedClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({ message: "Client updated successfully", client: updatedClient });
  } catch (error) {
    console.error("Update Client Error:", error);
    res.status(500).json({ error: "Server error" });
  }
}

// Function to disable a client
async function disableClient(req, res) {
  try {
    const clientId = req.params.id;
    const { status } = req.body;

    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      { status },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({
      message: "Client disabled successfully",
      client: updatedClient,
    });
  } catch (error) {
    console.error("Disable Client Error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
// Function to get all clients
async function getAllClients(req, res) {
  try {
    const clients = await Client.find();
    res.json({ clients });
  } catch (error) {
    console.error("Get All Clients Error:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function filterClients(req, res) {
  try {
    const clients = await Client.find(req.body);
    res.json(clients);
  } catch (error) {
    console.error("Filter Clients Error:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function deleteClient(req, res) {
  try {
    const clientId = req.params.id;

    // Delete client by ID
    const deletedClient = await Client.findByIdAndDelete(clientId);

    if (!deletedClient) {
      return res.status(404).json({ error: "Client not found" });
    }

   

    res.json({ message: "Client deleted successfully", client: deletedClient });
  } catch (error) {
    console.error("Delete Client Error:", error);
    res.status(500).json({ error: "Server error" });
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

module.exports = {
  addClient,
  getClient,
  updateClient,
  disableClient,
  getAllClients,
  deleteClient,
  filterClients,
  checkClientByHubSpotId
};
