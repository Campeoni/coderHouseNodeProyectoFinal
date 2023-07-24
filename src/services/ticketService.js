import ticketModel from "../models/MongoDB/ticketModel.js";

export const findTicketById = async (tid) => {
    try {
      const ticket = await ticketModel.findById(tid)
      return ticket
    } catch (error) {
      throw new Error(error)
    }
}

export const findTicketByCode = async (code) => {
  try {
    const ticket = await ticketModel.findOne({ code: code })
    return ticket
  } catch (error) {
    throw new Error(error)
  }
}

export const findTicketMaxCode = async () => {
  try {
    const ticket = await ticketModel.findOne().sort('-code')
    if (ticket) {
      return ticket.code











    } else {
      return 0
    }      
  } catch (error) {
    throw new Error(error)
  }
}

export const createTicket = async (ticket) => {
    try {
      const newTicket = await ticketModel(ticket)
      await newTicket.save()
      return newTicket
    } catch (error) {
      throw new Error(error)
    }
}

export const updateTicket = async (tid, data) => {
  try {
    return await ticketModel.findByIdAndUpdate(tid, data);
  } catch (error) {
    throw new Error(error);
  }
}

export const deleteTicketServ = async (tid) => {
  try {
    return await ticketModel.findByIdAndDelete(tid);
  } catch (error) {
    throw new Error(error);
  }
}