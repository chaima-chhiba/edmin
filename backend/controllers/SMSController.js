const SMShistory = require("../models/SMShistory");

const getAllSMShistoryEntries = async (req, res) => {
  try {
   
    const smsHistoryEntries = await SMShistory.find({})
      .sort("-date")
      .populate({
        path: 'clientId', 
        select: 'schoolName',  
      });

    
    const populatedEntries = smsHistoryEntries.map(entry => ({
      ...entry.toObject(),  
      schoolName: entry.clientId ? entry.clientId.schoolName : 'Unknown',  
    }));

    res.status(200).json(populatedEntries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Controller to get all SMS history entries for a specific client
const getSMShistory = async (req, res) => {
  const { clientId } = req.query; 

  try {
    const smsHistory = await SMShistory.find({ clientId });
    res.status(200).json(smsHistory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to add a new SMS history entry
const addSMShistory = async (req, res) => {
  const { clientId, amountAdded, addedBy, comment, date, oldBalance, newSolde} = req.body;
  const newHistoryEntry = new SMShistory({
    clientId, 
    amountAdded,
    addedBy,
    comment,
    date,
    oldBalance,
    newSolde
  });

  try {
    const savedEntry = await newHistoryEntry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getSMShistory,
  addSMShistory,
  getAllSMShistoryEntries
};
