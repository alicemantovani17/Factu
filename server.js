const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const conectarMongoDB = require("./db");
const Usuario = require("./dados");

const app = express();

app.use(session({ secret: "secreto", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("./"));

// Salva o usuário na sessão
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
 clientID: "676591413692-n1ed6aofnp6d40rts0gqchktcdl70q1l.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://factu.onrender.com/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log("✅ Dados do Google:", profile); // Log do profile completo

    const userData = {
      google_id: profile.id,
      nome: profile.displayName,
      email: profile.emails?.[0]?.value || "sem email",
      foto: profile.photos?.[0]?.value || "sem foto"
    };

    await salvarUsuarioNoBanco(userData);
    return done(null, userData);
  } catch (err) {
    console.error("❌ Erro durante o processamento do login:", err);
    return done(err);
  }
}
));

// Rotas
app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account"
}));

app.get("/auth/google/callback",
  (req, res, next) => {
    console.log("🔁 Chegou na rota de callback do Google");
    next();
  },
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    console.log("✅ Usuário autenticado com sucesso, redirecionando para Pagina Inicial");
    res.redirect("factu.html");
  }
);


// Exemplo: dashboard com dados do usuário
app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/");
  res.json(req.user); // ou renderiza uma página
});

async function salvarUsuarioNoBanco(userData) {
  try {
    console.log(" Salvando no MongoDB...", userData);

    const existente = await Usuario.findOne({ google_id: userData.google_id });

    if (!existente) {
      await Usuario.create(userData);
      console.log("✅ Usuário salvo no MongoDB.");
    } else {
      console.log("Usuário já Esta Salvo.");
    }
  } catch (err) {
    console.error("❌ Erro ao salvar no MongoDB:", err);
  }
}

conectarMongoDB().then(() => {
  app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
});

