const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  google_id: String,
  nome: String,
  email: String,
  foto: String
});

module.exports = mongoose.model("Usuario", usuarioSchema);
