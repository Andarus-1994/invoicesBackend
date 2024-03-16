const { executeQueryPsql } = require("../services/databasePsql")

const createMultiple = async (req) => {
  const items = req.body.items
  if (!Array.isArray(items) || items.length === 0) {
    throw "Items array is missing or empty"
  }

  const { client_id, invoice_id } = req.body

  const placeholders = items
    .map((item, index) => `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${index * 6 + 4}, $${index * 6 + 5}, $${index * 6 + 6})`)
    .join(", ")

  const values = items.flatMap((item) => [item.name, item.description, item.quantity, item.price, client_id, invoice_id])
  const insertDataQuery = `INSERT INTO items (name, description, quantity, price, client_id, invoice_id) VALUES ${placeholders} RETURNING *`
  console.log(insertDataQuery)
  try {
    await executeQueryPsql(insertDataQuery, values)
  } catch (error) {
    throw "Error on multiple insert items"
  }
}

module.exports = { createMultiple }
