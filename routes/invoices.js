const express = require("express")
const router = express.Router()

const { getAll, getById, create, filter, update, remove } = require("../controllers/invoices")

module.exports = () => {
  router.post("/create", create)

  router.get("/getAll", getAll)

  router.post("/getById", getById)

  router.post("/filter", filter)

  router.post("/update", update)

  router.post("/remove", remove)

  return router
}
