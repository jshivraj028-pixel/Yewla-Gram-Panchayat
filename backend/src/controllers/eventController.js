import { Event } from '../models/Event.js';
import { Notification } from '../models/Notification.js';

export const getEvents = async (req, res, next) => {
  try {
    const { status, eventType, upcomingOnly = 'false' } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (eventType && eventType !== 'All') {
      query.eventType = eventType;
    }

    if (upcomingOnly === 'true') {
      query.eventDate = { $gte: new Date(new Date().setHours(0, 0, 0, 0)) };
    }

    const events = await Event.find(query).sort({ eventDate: 1 });

    res.json({
      success: true,
      data: events,
      count: events.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);

    // Notify citizens of upcoming Gram Sabha or major event
    await Notification.create({
      recipient: null, // broadcast
      title: `Event Scheduled: ${event.title}`,
      marathiTitle: `कार्यक्रम आयोजित: ${event.marathiTitle || event.title}`,
      message: `${event.title} is scheduled on ${new Date(event.eventDate).toLocaleDateString()} at ${event.time}, Location: ${event.location}`,
      marathiMessage: `${event.marathiTitle || event.title} चे आयोजन ${new Date(event.eventDate).toLocaleDateString()} रोजी वेळ ${event.time}, स्थळ: ${event.location}`,
      type: 'Event',
      referenceId: event._id.toString(),
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, message: 'Event updated successfully', data: event });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};
