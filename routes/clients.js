const express = require("express")
const router = express.Router()
const { executeQuery } = require("../utils/database")

module.exports = () => {
  router.get("/getAll", async (req, res) => {
    const selectDataQuery = "SELECT * FROM clients LIMIT 20"
    try {
      const results = await executeQuery(selectDataQuery)
      res.json({ success: true, results })
    } catch (error) {
      console.error("Error inserting data:", error)
      res.status(500).json({ success: false, error: "Internal Server Error" })
    }
  })

  return router
}
