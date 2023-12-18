const { executeQuery } = require("../services/database")

const createMultiple = async (req) => {
  const items = req.body.items
  if (!Array.isArray(items) || items.length === 0) {
    throw "Items array is missing or empty"
  }

  const { client_id, invoice_id } = req.body

  const placeholders = items.map(() => "(?, ?, ?, ?, ?, ?)").join(", ")
  const values = items.flatMap((item) => [item.name, item.description, item.quantity, item.price, client_id, invoice_id])
  const insertDataQuery = `INSERT INTO items (name, description, quantity, price, client_id, invoice_id) VALUES ${placeholders}`

  try {
    await executeQuery(insertDataQuery, values)
  } catch (error) {
    throw "Error on multiple insert items"
  }
}

module.exports = { createMultiple }
