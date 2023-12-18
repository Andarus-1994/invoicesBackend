const express = require("express")
const router = express.Router()
const { executeQuery } = require("../services/database")
const { getAll, create } = require("../controllers/clients")

module.exports = () => {
  router.get("/getAll", getAll)

  router.post("/create", create)

  return router
}
