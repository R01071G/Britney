import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔑 Tus credenciales de Supabase
const SUPABASE_URL = "https://phikuwjapkwmflnhekrg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoaWt1d2phcGt3bWZsbmhla3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNzQ1MzIsImV4cCI6MjA3Mzc1MDUzMn0.a1bGSecYAQG4q_IOdndOo6r76CgeEGLnoODFLemQwZc";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // 🔑 Login con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // ✅ Login correcto → redirigir
    window.location.href = "upload.html";
  } catch (err) {
    errorMessage.style.display = "block";
    errorMessage.textContent = "⚠ " + err.message;
  }
});

// Ejemplo de subir archivo al bucket "chicarap"
async function subirArchivo(file) {
  const { data, error } = await supabase.storage
    .from("chicarap")       // nombre del bucket
    .upload(file.name, file); 

  if (error) {
    console.error("Error al subir archivo:", error.message);
    return null;
  }
  console.log("Archivo subido correctamente:", data);
  return data;
}

// Ejemplo de uso:
// const archivoInput = document.getElementById("archivo");
// archivoInput.addEventListener("change", (e) => subirArchivo(e.target.files[0]));
