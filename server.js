const express = require("express")
const invoicesRoutes = require("./routes/invoices")()
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors())

app.get("/api", (req, res) => {
  res.json({ users: ["user1", "user2", "user3"] })
})

app.use("/invoices", invoicesRoutes)

app.listen(5000, () => {
  console.log("Server started on port 5000")
})
