const apiBase = "/api";
const tokenKey = "jukeboxd_token";
const protectedPages = ["usuario.html", "editarPerfil.html", "senha.html", "avaliacao.html", "suaAvaliacao.html"];

const getAuthHeaders = () => {
  const token = localStorage.getItem(tokenKey);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getCurrentPage = () => window.location.pathname.split("/").pop();

const hasAuthToken = () => Boolean(localStorage.getItem(tokenKey));

const redirectToLogin = () => {
  localStorage.removeItem(tokenKey);
  window.location.href = "entre.html";
};

const maybeRedirectIfProtected = () => {
  const page = getCurrentPage();
  if (protectedPages.includes(page) && !hasAuthToken()) {
    redirectToLogin();
  }
};

const redirectIfAuthenticated = () => {
  const page = getCurrentPage();
  const authPages = ["entre.html", "cadastro.html"];
  if (authPages.includes(page) && hasAuthToken()) {
    window.location.href = "usuario.html";
  }
};

const setupLogoutLink = () => {
  const nav = document.querySelector("header nav.direita");
  if (!nav || !hasAuthToken()) return;

  const existingLogout = document.getElementById("logout-link");
  if (existingLogout) return;

  const logoutLink = document.createElement("a");
  logoutLink.href = "#";
  logoutLink.id = "logout-link";
  logoutLink.textContent = "sair";
  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    redirectToLogin();
  });

  nav.appendChild(logoutLink);
};

const updateNavForAuth = () => {
  const nav = document.querySelector("header nav.direita");
  if (!nav) return;
  if (!hasAuthToken()) return;

  const loginLink = nav.querySelector('a[href="entre.html"]');
  const signupLink = nav.querySelector('a[href="cadastro.html"]');
  if (loginLink) loginLink.style.display = "none";
  if (signupLink) signupLink.style.display = "none";
};

const applyInputMasks = () => {
  const usernameInputs = document.querySelectorAll("input[name='username']");
  const emailInputs = document.querySelectorAll("input[type='email']");
  const passwordInputs = document.querySelectorAll("input[type='password']");

  usernameInputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\s+/g, "").toLowerCase();
    });
  });

  emailInputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.value = input.value.toLowerCase();
    });
  });

  passwordInputs.forEach((input) => {
    input.setAttribute("minlength", "6");
  });
};

const showMessage = (container, message, type = "success") => {
  if (!container) return;
  container.textContent = message;
  container.className = type === "error" ? "message error" : "message success";
};

const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${apiBase}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = data.error || data.message || "Ocorreu um erro";
    throw new Error(error);
  }

  return data;
};

const handleSignup = () => {
  const form = document.getElementById("signup-form");
  if (!form) return;

  const feedback = document.createElement("div");
  feedback.className = "message";
  form.appendChild(feedback);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!username || !email || !password) {
      return showMessage(feedback, "Preencha todos os campos", "error");
    }

    try {
      await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });

      const loginData = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      localStorage.setItem(tokenKey, loginData.token);
      window.location.href = "usuario.html";
    } catch (error) {
      showMessage(feedback, error.message, "error");
    }
  });
};

const handleLogin = () => {
  const form = document.getElementById("login-form");
  if (!form) return;

  const feedback = document.createElement("div");
  feedback.className = "message";
  form.appendChild(feedback);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = form.username.value.trim();
    const password = form.password.value;

    if (!username || !password) {
      return showMessage(feedback, "Preencha todos os campos", "error");
    }

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      localStorage.setItem(tokenKey, data.token);
      window.location.href = "usuario.html";
    } catch (error) {
      showMessage(feedback, error.message, "error");
    }
  });
};

const loadProfileName = async () => {
  const profileName = document.getElementById("profile-name");
  if (!profileName) return;

  try {
    const data = await apiRequest("/users/me");
    profileName.textContent = data.name || data.username || "Usuário";
    const usernameText = document.querySelector(".username-text");
    if (usernameText) {
      usernameText.textContent = data.username;
    }
  } catch (error) {
    localStorage.removeItem(tokenKey);
  }
};

const populateProfileForm = async () => {
  const form = document.getElementById("profile-form");
  if (!form) return;

  const feedback = document.createElement("div");
  feedback.className = "message";
  form.appendChild(feedback);

  try {
    const data = await apiRequest("/users/me");
    form.username.value = data.username || "";
    form.name.value = data.name || "";
    form.email.value = data.email || "";
    form.bio.value = data.bio || "";
  } catch (error) {
    showMessage(feedback, error.message, "error");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = form.username.value.trim();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const bio = form.bio.value.trim();

    if (!username || !name || !email) {
      return showMessage(feedback, "Preencha username, nome e e-mail", "error");
    }

    try {
      await apiRequest("/users/me", {
        method: "PUT",
        body: JSON.stringify({ username, name, email, bio }),
      });

      showMessage(feedback, "Perfil atualizado com sucesso");
      setTimeout(() => {
        window.location.href = "usuario.html";
      }, 700);
    } catch (error) {
      showMessage(feedback, error.message, "error");
    }
  });
};

const handlePasswordForm = () => {
  const form = document.getElementById("password-form");
  if (!form) return;

  const feedback = document.createElement("div");
  feedback.className = "message";
  form.appendChild(feedback);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const currentPassword = form.currentPassword.value;
    const password = form.password.value;
    const confirm = form.confirmPassword.value;

    if (!currentPassword || !password || !confirm) {
      return showMessage(feedback, "Preencha todos os campos", "error");
    }

    if (password !== confirm) {
      return showMessage(feedback, "As senhas não coincidem", "error");
    }

    try {
      await apiRequest("/users/me", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, password }),
      });

      showMessage(feedback, "Senha atualizada com sucesso");
      setTimeout(() => {
        window.location.href = "usuario.html";
      }, 700);
    } catch (error) {
      showMessage(feedback, error.message, "error");
    }
  });
};

const renderReviewCards = (reviews) => {
  const container = document.getElementById("reviews-cards");
  if (!container) return;

  if (!reviews.length) {
    container.innerHTML = "<p>Nenhuma avaliação encontrada ainda.</p>";
    return;
  }

  container.innerHTML = reviews
    .map(
      (review) => `
        <div class="avCT">
          <img src="img/beatles.jpg" class="img1" alt="Capa do Álbum">
          <div class="info">
            <h1>${review.album}</h1>
            <h2 class="subtitulo">${review.artist}</h2>
            <div class="user">
              <img src="img/user.jpg" class="img2">
              <h2 class="username">${review.user.username}</h2>
              <div class="stars">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</div>
            </div>
            <p>${review.comment || "Sem comentário"}</p>
            <span class="data">Avaliado em: ${new Date(review.createdAt).toLocaleDateString("pt-BR")}</span>
          </div>
        </div>`
    )
    .join("");
};

const loadReviews = async () => {
  const cards = document.getElementById("reviews-cards");
  if (!cards) return;

  try {
    const reviews = await apiRequest("/reviews");
    renderReviewCards(reviews);
  } catch (error) {
    cards.innerHTML = `<p>Não foi possível carregar as avaliações: ${error.message}</p>`;
  }
};

const handleReviewForm = () => {
  const form = document.getElementById("review-create-form") || document.getElementById("create-review-form");
  if (!form) return;

  const feedback = document.createElement("div");
  feedback.className = "message";
  form.appendChild(feedback);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const albumTitle = document.querySelector(".album-title")?.textContent?.trim() || "Sem título";
    const artist = document.querySelector(".artist-name")?.textContent?.trim() || "Desconhecido";
    const ratingField = form.querySelector("[name='rating']");
    const comment = form.querySelector("[name='comment']")?.value.trim() || "";
    const rating = ratingField ? Number(ratingField.value) : 5;

    if (!comment) {
      return showMessage(feedback, "Escreva um comentário antes de enviar", "error");
    }

    try {
      await apiRequest("/reviews", {
        method: "POST",
        body: JSON.stringify({ album: albumTitle, artist, rating, comment }),
      });

      showMessage(feedback, "Avaliação enviada com sucesso");
      if (form.id === "review-create-form") {
        form.reset();
      }
      setTimeout(() => {
        window.location.href = "avaliacao.html";
      }, 700);
    } catch (error) {
      showMessage(feedback, error.message, "error");
    }
  });
};

const init = () => {
  applyInputMasks();
  maybeRedirectIfProtected();
  redirectIfAuthenticated();
  setupLogoutLink();
  updateNavForAuth();
  handleSignup();
  handleLogin();
  populateProfileForm();
  handlePasswordForm();
  loadProfileName();
  loadReviews();
  handleReviewForm();
};

document.addEventListener("DOMContentLoaded", init);
