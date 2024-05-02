const { executeQueryPsql } = require("../services/databasePsql")
const { parseFrontendDate } = require("../utils/DateParser")
const { createMultiple } = require("./items")

const getAll = async (req, res) => {
  const selectDataQuery =
    "SELECT c.name as client, c.company_address, c.address, c.company_name, i.*, COALESCE(i.amount_paid, 0) as amount_paid, " +
    "(SELECT JSON_AGG(items.*) FROM items WHERE items.invoice_id = i.id AND items.client_id = c.id) AS items " +
    " FROM invoices i LEFT JOIN clients c ON i.client_id = c.id ORDER BY issue_date DESC LIMIT 20 "

  try {
    const results = await executeQueryPsql(selectDataQuery)

    // if some results have no items we assign empty []
    results.forEach((result) => {
      if (!result.items) result.items = []
    })

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
    console.log(results)
    if (results.length && results[0].id) {
      req.body.invoice_id = results[0].id
      // here we create the Items
      await createMultiple(req)
    }
    res.json({ success: true, results })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: "Internal Server Error" })
  }
}

const filter = async (req, res) => {
  // created a small timeout

  let selectDataQuery =
    "SELECT c.name as client, c.company_address, c.address, c.company_name, i.*, " +
    "(SELECT JSON_AGG(items.*) FROM items WHERE items.invoice_id = i.id AND items.client_id = c.id) AS items " +
    " FROM invoices i LEFT JOIN clients c ON i.client_id = c.id "
  const values = []
  const period = req.body.period

  if (period && period !== "") {
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - period)

    selectDataQuery += " WHERE issue_date >= $1 AND issue_date <= NOW() "
    values.push(fromDate.toISOString().split("T")[0])
  }

  // limit to 20 invoices and order by issue_date
  selectDataQuery += "ORDER BY issue_date DESC LIMIT 20"

  try {
    const results = await executeQueryPsql(selectDataQuery, values)

    // if some results have no items we assign empty []
    results.forEach((result) => {
      if (!result.items) result.items = []
    })

    res.json({ success: true, results })
  } catch (error) {
    console.error("Error filtering data:", error)
    res.status(500).json({ success: false, error: "Internal Server Error" })
  }
}

const getById = async (req, res) => {
  // created a small timeout

  if (!req.body.id) return res.json({ error: true, message: "No ID was selected." })

  let selectDataQuery = "SELECT * FROM invoices WHERE id = $1"
  const values = []
  values.push(req.body.id)

  try {
    const results = await executeQueryPsql(selectDataQuery, values)
    if (results.length) res.json({ success: true, data: results[0] })
    else res.json({ success: false, error: "Invoice Not Found" })
  } catch (error) {
    console.error("Error getting data by ID:", error)
    res.status(500).json({ success: false, error: "Internal Server Error" })
  }
}

const remove = async (req, res) => {
  // created a small timeout

  let removeInvoiceQuery = "DELETE FROM invoices WHERE id = $1"
  const idInvoice = req.body.id
  const values = [idInvoice]
  try {
    const results = await executeQueryPsql(removeInvoiceQuery, values)

    res.json({ success: true, results })
  } catch (error) {
    console.error("Error removing data:", error)
    res.status(500).json({ success: false, error: "Internal Server Error" })
  }
}

const update = async (req, res) => {
  if (!req.body.id) return res.json({ error: true, message: "No ID was selected." })

  const { id, ...updateValues } = req.body

  const mappedValues = Object.entries(updateValues)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => (key === "due_date" || key === "issue_date" ? [key, parseFrontendDate(value)] : [key, value]))

  const columnsToUpdate = mappedValues.map(([key], index) => `${key} = $${index + 1}`).join(", ")

  const updateDataQuery = `UPDATE invoices SET ${columnsToUpdate} WHERE id = $${mappedValues.length + 1}`

  try {
    const values = mappedValues.map(([_, value]) => value)
    values.push(id)

    await executeQueryPsql(updateDataQuery, values)

    res.json({ success: true })
  } catch (error) {
    console.error("Couldn't be updated ", error)
    res.status(500).json({ success: false, error: "Internal Server Error" })
  }
}

module.exports = {
  getAll,
  getById,
  create,
  filter,
  update,
  remove,
}
