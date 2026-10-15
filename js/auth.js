import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const page = window.location.pathname;

onAuthStateChanged(auth, (user) => {
  if (user) {
    const isAuthPage = page.includes("login") || page.includes("register");
    if (isAuthPage) window.location.href = "/";
  }
});

// ─── LOGIN PAGE ───
if (document.getElementById("loginBtn")) {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const googleBtn = document.getElementById("googleBtn");
  const loginMessage = document.getElementById("loginMessage");

  loginBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      showMsg(loginMessage, "Email dan password wajib diisi.", "error");
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Loading...";

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showMsg(loginMessage, "Login berhasil! Mengalihkan...", "success");
      setTimeout(() => window.location.href = "/", 800);
    } catch (err) {
      showMsg(loginMessage, mapError(err.code), "error");
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
    }
  });

  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      const provider = new GoogleAuthProvider();
      googleBtn.disabled = true;
      try {
        await signInWithPopup(auth, provider);
        showMsg(loginMessage, "Login Google berhasil! Mengalihkan...", "success");
        setTimeout(() => window.location.href = "/", 800);
      } catch (err) {
        showMsg(loginMessage, mapError(err.code), "error");
      } finally {
        googleBtn.disabled = false;
      }
    });
  }
}

// ─── REGISTER PAGE ───
if (document.getElementById("registerBtn")) {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const registerBtn = document.getElementById("registerBtn");
  const googleRegisterBtn = document.getElementById("googleRegisterBtn");
  const registerMessage = document.getElementById("registerMessage");

  registerBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!name || !email || !password) {
      showMsg(registerMessage, "Semua field wajib diisi.", "error");
      return;
    }

    if (password.length < 6) {
      showMsg(registerMessage, "Password minimal 6 karakter.", "error");
      return;
    }

    registerBtn.disabled = true;
    registerBtn.textContent = "Loading...";

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      showMsg(registerMessage, "Akun berhasil dibuat! Mengalihkan...", "success");
      setTimeout(() => window.location.href = "/", 800);
    } catch (err) {
      showMsg(registerMessage, mapError(err.code), "error");
    } finally {
      registerBtn.disabled = false;
      registerBtn.textContent = "Register";
    }
  });

  if (googleRegisterBtn) {
    googleRegisterBtn.addEventListener("click", async () => {
      const provider = new GoogleAuthProvider();
      googleRegisterBtn.disabled = true;
      try {
        await signInWithPopup(auth, provider);
        showMsg(registerMessage, "Berhasil! Mengalihkan...", "success");
        setTimeout(() => window.location.href = "/", 800);
      } catch (err) {
        showMsg(registerMessage, mapError(err.code), "error");
      } finally {
        googleRegisterBtn.disabled = false;
      }
    });
  }
}

function showMsg(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.style.color = type === "error" ? "#e74c3c" : "#2ecc71";
}

function mapError(code) {
  const errors = {
    "auth/user-not-found": "Akun tidak ditemukan.",
    "auth/wrong-password": "Password salah.",
    "auth/invalid-credential": "Email atau password salah.",
    "auth/invalid-email": "Format email tidak valid.",
    "auth/email-already-in-use": "Email sudah terdaftar.",
    "auth/weak-password": "Password terlalu lemah.",
    "auth/too-many-requests": "Terlalu banyak percobaan. Coba lagi nanti.",
    "auth/popup-closed-by-user": "Login Google dibatalkan.",
    "auth/network-request-failed": "Koneksi gagal. Periksa internet kamu."
  };
  return errors[code] || `Terjadi kesalahan. (${code})`;
}
