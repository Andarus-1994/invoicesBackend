const { Pool } = require("pg")
require("dotenv").config()
console.log(process.env.DB_USER_PSQL)
console.log(process.env.DB_PASSWORD_PSQL)
console.log(process.env.DB_HOST_PSQL)
const pool = new Pool({
  user: process.env.DB_USER_PSQL,
  password: process.env.DB_PASSWORD_PSQL,
  host: process.env.DB_HOST_PSQL,
  database: process.env.DB_NAME_PSQL,
  port: process.env.DB_PORT_PSQL || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  ssl: { rejectUnauthorized: false },
})

console.log("PostgreSQL connection details:", pool.options)

const executeQueryPsql = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.connect((err, client, done) => {
      if (err) {
        reject(err)
        return
      }

      client.query(sql, values, (queryErr, results) => {
        done() // Release the client back to the pool

        if (queryErr) {
          reject(queryErr)
        } else {
          resolve(results.rows)
        }
      })
    })
  })
}

module.exports = { executeQueryPsql }
