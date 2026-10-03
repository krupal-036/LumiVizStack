// api/index.js
const mod = require("../backend/dist/index.js");
module.exports = mod.default || mod;