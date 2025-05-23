const mongoose = require("mongoose");

async function conectarMongoDB() {
  try {
    await mongoose.connect("mongodb+srv://liceli17:Fp03122007@factu.hjfbwgi.mongodb.net/?retryWrites=true&w=majority&appName=Factu");
    console.log("🟢 MongoDB conectado com sucesso!");
  } catch (erro) {
    console.error("🔴 Erro ao conectar no MongoDB:", erro);
  }
}

module.exports = conectarMongoDB;
