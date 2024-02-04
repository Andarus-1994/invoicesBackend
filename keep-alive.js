const cron = require("node-cron")
const axios = require("axios")

const startKeepAlive = () => {
  const serverUrl = "http://invoices-backend-andrey.onrender.com/invoices/getAll"

  cron.schedule("*/5 * * * *", async () => {
    try {
      const response = await axios.get(serverUrl)
      console.log("Keep-alive request successful:", response.data)
    } catch (error) {
      console.error("Error making keep-alive request:", error.message)
    }
  })
}

// Export the function for reuse
module.exports = startKeepAlive
