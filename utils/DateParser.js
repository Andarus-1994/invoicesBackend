const parseFrontendDate = (dateString) => {
  const [day, month, year] = dateString.split("/")

  return new Date(`${year}-${month}-${day}`)
}

module.exports = { parseFrontendDate }
