const { executeQueryPsql } = require("../services/databasePsql")

const getAll = async (req, res) => {
  const selectDataQuery = "SELECT * FROM clients LIMIT 20"
  try {
    const results = await executeQueryPsql(selectDataQuery)
    res.json({ success: true, results })
  } catch (error) {
    console.error("Error inserting data:", error)
    res.status(500).json({ success: false, error: "Internal Server Error" })
  }
}

const create = async (req, res) => {
  const { name, address, company_name, company_address } = req.body
  const insertDataQuery = "INSERT INTO clients (name, address, company_name, company_address) VALUES ($1, $2, $3, $4) RETURNING *"
  const values = [name, address, company_name, company_address]

  try {
    const results = await executeQueryPsql(insertDataQuery, values)
    res.json({ success: true, results })
  } catch (error) {
    console.error("Error inserting data:", error)
    res.status(500).json({ success: false, error: "Internal Server Error" })
  }
}

const update = async (req, res) => {
  const { name, address, company_name, company_address, id } = req.body
  const insertDataQuery = "UPDATE clients SET name = $1, address = $2, company_name = $3, company_address = $4 WHERE id = $5 RETURNING *"
  const values = [name, address, company_name, company_address, id]

  try {
    const results = await executeQueryPsql(insertDataQuery, values)
    res.json({ success: true, results })
  } catch (error) {
    console.error("Error inserting data:", error)
    res.status(500).json({ success: false, error: "Internal Server Error" })
  }
}

module.exports = { getAll, create, update }
