require('dotenv').config()
const {server} = require("./app");
require("./ws")

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log("Server started on port: "+PORT))