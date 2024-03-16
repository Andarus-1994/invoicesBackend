const express = require("express")
const router = express.Router()

const { getAll, create, filter, remove } = require("../controllers/invoices")

module.exports = () => {
  router.post("/create", create)

  router.get("/getAll", getAll)

  router.post("/filter", filter)

  router.post("/remove", remove)

  return router
}
