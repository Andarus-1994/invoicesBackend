const express = require("express")
const router = express.Router()
const { executeQuery } = require("../utils/database")

module.exports = () => {
  router.post("/insertData", async (req, res) => {
    console.log("enter")
    const insertDataQuery = "INSERT INTO invoices (name, value) VALUES (?, ?)"
    const values = [req.body.name, req.body.value]

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
      "SELECT c.name as client, c.company_address, c.address, c.company_name, i.* FROM invoices i LEFT JOIN clients c ON i.client_id = c.id"
    try {
      const results = await executeQuery(selectDataQuery)
      res.json({ success: true, results })
    } catch (error) {
      console.error("Error inserting data:", error)
      res.status(500).json({ success: false, error: "Internal Server Error" })
    }
  })

  router.post("/filter", async (req, res) => {
    let selectDataQuery =
      "SELECT c.name as client, c.company_address, c.address, c.company_name, i.* FROM invoices i LEFT JOIN clients c ON i.client_id = c.id "
    const values = []

    if (req.body.period !== "") {
      selectDataQuery += " WHERE issue_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY) AND issue_date <= CURDATE()"
      values.push(req.body.period)
    }
    // limit to 20 invoices and order by issue_date
    selectDataQuery += "ORDER BY issue_date LIMIT 20"

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
