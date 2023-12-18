const express = require("express")
const invoicesRoutes = require("./routes/invoices")()
const clientsRoutes = require("./routes/clients")()
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors())

app.use("/invoices", invoicesRoutes)
app.use("/clients", clientsRoutes)

app.listen(5000, () => {
  console.log("Server started on port 5000")
})
