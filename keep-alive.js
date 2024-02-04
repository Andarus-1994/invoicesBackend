const cron = require("node-cron")
const axios = require("axios")

// Replace 'http://your-server-url/keep-alive-endpoint' with the actual URL and endpoint on your server
const serverUrl = "http://invoices-backend-andrey.onrender.com"

// Schedule the task to run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {
    const response = await axios.get(serverUrl)
    console.log("Keep-alive request successful:", response.data)
  } catch (error) {
    console.error("Error making keep-alive request:", error.message)
  }
})
