const express = require("express")
const router = express.Router()
const { executeQuery } = require("../utils/database")

const parseFrontendDate = (dateString) => {
  const [day, month, year] = dateString.split("/")

  return new Date(`${year}-${month}-${day}`)
}

module.exports = () => {
  router.post("/create", async (req, res) => {
    const { name, amount, client_id, issue_date, due_date, status } = req.body
    const parsedIssueDate = parseFrontendDate(issue_date)
    const parsedDueDate = parseFrontendDate(due_date)
    const insertDataQuery = "INSERT INTO invoices (name, amount, client_id, issue_date, due_date, status) VALUES (?, ?, ?, ?, ?, ?)"
    const values = [name, amount, client_id, parsedIssueDate, parsedDueDate, status]

    try {
      const results = await executeQuery(insertDataQuery, values)
      res.json({ success: true, results })
    } catch (error) {
      console.error("Error inserting data:", error)
      res.status(500).json({ success: false, error: "Internal Server Error" })
    }
  })

  router.get("/getAll", async (req, res) => {
    const selectDataQuery =
      "SELECT c.name as client, c.company_address, c.address, c.company_name, i.*, COALESCE(i.amount_paid, 0) as amount_paid FROM invoices i LEFT JOIN clients c ON i.client_id = c.id ORDER BY issue_date DESC LIMIT 20"
    try {
      const results = await executeQuery(selectDataQuery)
      res.json({ success: true, results })
    } catch (error) {
      console.error("Error inserting data:", error)
      res.status(500).json({ success: false, error: "Internal Server Error" })
    }
  })

  router.post("/filter", async (req, res) => {
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
      const results = await executeQuery(selectDataQuery, values)
      res.json({ success: true, results })
    } catch (error) {
      console.error("Error inserting data:", error)
      res.status(500).json({ success: false, error: "Internal Server Error" })
    }
  })

  return router
}
