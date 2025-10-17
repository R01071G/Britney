import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Configuración actualizada de Supabase
const SUPABASE_URL = "https://phikuwjapkwmflnhekrg.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoaWt1d2phcGt3bWZsbmhla3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNzQ1MzIsImV4cCI6MjA3Mzc1MDUzMn0.a1bGSecYAQG4q_IOdndOo6r76CgeEGLnoODFLemQwZc";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🔹 Para usar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Servir toda la raíz del proyecto como estática
app.use(express.static(path.join(__dirname, "../")));

// 🔹 Servir carpetas específicas (asegura subcarpetas)
const carpetas = ["js", "img", "css", "cursos", "cursoscss", "admin", "admincss"];
carpetas.forEach((carpeta) => {
  app.use(`/${carpeta}`, express.static(path.join(__dirname, `../${carpeta}`)));
});

// 🔹 Servir index.html por defecto en "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// 🔹 Ruta API para listar archivos del bucket "chicarap"
app.get("/api/archivos", async (req, res) => {
  const { data, error } = await supabase.storage.from("chicarap").list("", {
    limit: 100,
    offset: 0,
  });

  if (error) return res.status(500).json({ error: error.message });

  const archivos = data.map((file) => ({
    nombre: file.name,
    url: `${SUPABASE_URL}/storage/v1/object/public/chicarap/${file.name}`,
  }));

  res.json(archivos);
});

// 🔹 Registrar usuario en tabla "usuarios"
app.post("/api/registrar", async (req, res) => {
  const { correo, rol } = req.body;

  try {
    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ correo, rol }]);

    if (error) throw error;

    res.json({ mensaje: "Usuario registrado correctamente", data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Registrar usuario en Auth (con rol)
app.post("/api/registrar-auth", async (req, res) => {
  const { correo, password, rol } = req.body;

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: correo,
      password: password,
      email_confirm: true,
      user_metadata: { rol },
    });

    if (error) throw error;

    res.json({ mensaje: "Usuario creado en Auth correctamente", data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Puerto del servidor
app.listen(4000, () => {
  console.log("✅ Servidor backend corriendo en http://localhost:4000");
});
