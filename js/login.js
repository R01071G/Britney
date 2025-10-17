import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔑 Configuración Supabase (Chicarap)
const SUPABASE_URL = "https://phikuwjapkwmflnhekrg.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoaWt1d2phcGt3bWZsbmhla3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNzQ1MzIsImV4cCI6MjA3Mzc1MDUzMn0.a1bGSecYAQG4q_IOdndOo6r76CgeEGLnoODFLemQwZc";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const googleLoginBtn = document.getElementById("googleLogin");

// 🟢 Login con correo y contraseña
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    errorMessage.style.display = "block";
    errorMessage.textContent = "⚠ Por favor ingresa correo y contraseña.";
    errorMessage.style.color = "red";
    return;
  }

  errorMessage.style.display = "block";
  errorMessage.textContent = "Verificando...";
  errorMessage.style.color = "gray";

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // ✅ Login correcto → redirigir al index
    errorMessage.textContent = "✅ Bienvenido, redirigiendo...";
    errorMessage.style.color = "green";
    setTimeout(() => (window.location.href = "index.html"), 1500);

  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    errorMessage.style.display = "block";
    errorMessage.textContent = "⚠ Correo o contraseña incorrectos.";
    errorMessage.style.color = "red";
  }
});

// 🔵 Login con Google (OAuth)
googleLoginBtn.addEventListener("click", async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/index.html", // ✅ Corregido el slash
      },
    });

    if (error) throw error;
    // Supabase gestiona la redirección automáticamente
  } catch (err) {
    console.error("Error con Google:", err);
    errorMessage.style.display = "block";
    errorMessage.textContent = "⚠ Error con Google: " + err.message;
    errorMessage.style.color = "red";
  }
});
