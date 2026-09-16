import { EmergencyContact } from '../models/EmergencyContact.js';

export const getEmergencyContacts = async (req, res, next) => {
  try {
    const { department } = req.query;
    const query = {};

    if (department && department !== 'All') {
      query.department = department;
    }

    const contacts = await EmergencyContact.find(query).sort({ priorityOrder: 1, department: 1 });

    res.json({
      success: true,
      data: contacts,
      count: contacts.length,
    });
  } catch (error) {
    next(error);
  }
};

export const createEmergencyContact = async (req, res, next) => {
  try {
    const contact = await EmergencyContact.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Emergency contact added successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmergencyContact = async (req, res, next) => {
  try {
    const contact = await EmergencyContact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.json({ success: true, message: 'Contact updated successfully', data: contact });
  } catch (error) {
    next(error);
  }
};

export const deleteEmergencyContact = async (req, res, next) => {
  try {
    const contact = await EmergencyContact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    next(error);
  }
};
