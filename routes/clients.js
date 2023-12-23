const express = require("express")
const router = express.Router()
const { getAll, create, update } = require("../controllers/clients")

module.exports = () => {
  router.get("/getAll", getAll)

  router.post("/create", create)

  router.post("/update", update)

  return router
}
