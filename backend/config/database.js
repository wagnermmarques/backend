const mongoose = require("mongoose");

const connectMongo = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI não está configurado. Use .env ou defina a variável de ambiente.");
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado ao MongoDB");
  } catch (error) {
    console.error("Falha ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = { connectMongo };
