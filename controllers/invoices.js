const { executeQueryPsql } = require("../services/databasePsql")
const { parseFrontendDate } = require("../utils/DateParser")
const { createMultiple } = require("./items")

const getAll = async (req, res) => {
  const selectDataQuery =
    "SELECT c.name as client, c.company_address, c.address, c.company_name, i.*, COALESCE(i.amount_paid, 0) as amount_paid FROM invoices i LEFT JOIN clients c ON i.client_id = c.id ORDER BY issue_date DESC LIMIT 20"
  try {
    const results = await executeQueryPsql(selectDataQuery)
    res.json({ success: true, results })
  } catch (error) {
    console.error("Error reading data:", error)
    res.status(500).json({ success: false, error: "Internal Server Error" })
  }
}

const create = async (req, res) => {
  const { name, amount, client_id, issue_date, due_date, status, items } = req.body
  const parsedIssueDate = parseFrontendDate(issue_date)
  const parsedDueDate = parseFrontendDate(due_date)
  const insertDataQuery = "INSERT INTO invoices (name, amount, client_id, issue_date, due_date, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *"
  const values = [name, amount, client_id, parsedIssueDate, parsedDueDate, status]

  if (!Array.isArray(items) || items.length === 0) {
    res.status(500).json({ success: false, error: "Internal Server Error" })
  }

  try {
    const results = await executeQueryPsql(insertDataQuery, values)
    if (results.insertId) {
      req.body.invoice_id = results.insertId
      await createMultiple(req)
    }
    res.json({ success: true, results })
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" })
  }
}

const filter = async (req, res) => {
  // created a small timeout
  const timeoutPromise = () => new Promise((resolve) => setTimeout(resolve, 3000))
  await timeoutPromise()

  let selectDataQuery =
    "SELECT c.name as client, c.company_address, c.address, c.company_name, i.* FROM invoices i LEFT JOIN clients c ON i.client_id = c.id "
  const values = []

  if (req.body.period !== "") {
    selectDataQuery += " WHERE issue_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY) AND issue_date <= CURDATE()"
    values.push(req.body.period)
  }
  // limit to 20 invoices and order by issue_date
  selectDataQuery += "ORDER BY issue_date DESC LIMIT 20"

  try {
    const results = await executeQueryPsql(selectDataQuery, values)
    res.json({ success: true, results })
  } catch (error) {
    console.error("Error inserting data:", error)
    res.status(500).json({ success: false, error: "Internal Server Error" })
  }
}

module.exports = {
  getAll,
  create,
  filter,
}
