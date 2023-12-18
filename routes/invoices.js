const express = require("express")
const router = express.Router()

const { getAll, create, filter } = require("../controllers/invoices")

module.exports = () => {
  router.post("/create", create)

  router.get("/getAll", getAll)

  router.post("/filter", filter)

  return router
}
