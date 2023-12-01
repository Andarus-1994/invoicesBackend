const mysql = require("mysql2")
require("dotenv").config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
})

const executeQuery = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
        return
      }

      connection.query(sql, values, (queryErr, results) => {
        connection.release() // Release the connection back to the pool

        if (queryErr) {
          reject(queryErr)
        } else {
          resolve(results)
        }
      })
    })
  })
}

module.exports = { executeQuery }
