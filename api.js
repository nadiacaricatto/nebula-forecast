console.log("✅ JavaScript carregado!");

// Seletores principais
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const card = document.getElementById("card");
const cityNameEl = document.getElementById("city-name");
const temperatureEl = document.getElementById("temperature");
const windspeedEl = document.getElementById("windspeed");
const conditionEl = document.getElementById("condition");
const obsTimeEl = document.getElementById("obs-time");
const weatherIcon = document.getElementById("weather-icon");
const messageEl = document.getElementById("message");
const body = document.body;

console.log("📋 Elementos:", { form, cityInput, card, messageEl });

// Mapeamento de códigos climáticos
const weatherCodes = {
  0: "Céu limpo ☀️",
  1: "Céu aberto com poucas nuvens 🌤️",
  2: "Parcialmente nublado ⛅",
  3: "Nublado ☁️",
  45: "Névoa 🌫️",
  48: "Neblina densa 🌁",
  51: "Garoa leve 🌦️",
  61: "Chuva leve 🌧️",
  63: "Chuva moderada 🌧️",
  65: "Chuva intensa ⛈️",
  71: "Neve leve 🌨️",
  80: "Pancadas leves 🌦️",
  95: "Tempestade ⛈️",
};

// ===============================
// Verificação de elementos
// ===============================
if (!form) {
  console.error("❌ Formulário não encontrado!");
}

// ===============================
// Controle de requisição
// ===============================
let isRequesting = false;

// ===============================
// Função principal
// ===============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("🔍 Formulário enviado!");

  const city = cityInput.value.trim();
  console.log("🏙️ Cidade digitada:", city);

  if (!city) {
    showMessage("Digite o nome de uma cidade", "warn");
    return;
  }

  if (isRequesting) {
    console.warn("⚠️ Requisição já em andamento, ignorando novo envio...");
    return;
  }

  isRequesting = true;
  showMessage("Buscando dados...", "loading");
  card.classList.add("hidden");

  try {
    // 1. Busca coordenadas
    console.log("📍 Buscando coordenadas...");
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`
    );

    if (!geoRes.ok) throw new Error(`Erro HTTP: ${geoRes.status}`);

    const geoData = await geoRes.json();
    console.log("📍 Dados geográficos:", geoData);

    if (!geoData.length) {
      showMessage("Cidade não encontrada", "error");
      isRequesting = false;
      return;
    }

    const { lat, lon, display_name } = geoData[0];
    console.log("✅ Coordenadas encontradas:", { lat, lon, display_name });

    // 2. Busca clima
    console.log("🌤️ Buscando dados do clima...");
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );

    if (!weatherRes.ok) throw new Error(`Erro HTTP: ${weatherRes.status}`);

    const weatherData = await weatherRes.json();
    console.log("🌤️ Dados do clima:", weatherData);

    const weather = weatherData.current_weather;

    if (!weather) {
      showMessage("Erro: dados do clima ausentes", "error");
      isRequesting = false;
      return;
    }

    const weatherText = weatherCodes[weather.weathercode] || "Condição desconhecida";

    // 3. Atualiza UI
    console.log("🎨 Atualizando interface...");
    cityNameEl.textContent = display_name.split(",")[0];
    temperatureEl.textContent = weather.temperature.toFixed(1);
    windspeedEl.textContent = weather.windspeed;
    conditionEl.textContent = weatherText;
    obsTimeEl.textContent = formatTime(weather.time);
    weatherIcon.innerHTML = getWeatherIcon(weather.weathercode);

    // 4. Alterna tema dia/noite
    body.classList.remove("day", "night");
    if (weather.is_day === 1) {
      body.classList.add("day");
    } else {
      body.classList.add("night");
    }

    // 5. Exibe card
    card.classList.remove("hidden");
    setTimeout(() => card.classList.add("fade-in"), 50);

    // 6. Limpa mensagem
    showMessage("");
    console.log("✅ Interface atualizada com sucesso!");
  } catch (error) {
    console.error("❌ Erro capturado:", error);

    if (error.message.includes("429")) {
      showMessage("Erro: muitas requisições. Aguarde um momento.", "error");
    } else if (error.message.includes("500")) {
      showMessage("Erro no servidor. Tente novamente mais tarde.", "error");
    } else if (error.message.includes("CORS")) {
      showMessage("Erro de conexão (CORS).", "error");
    } else {
      showMessage("Erro ao buscar dados", "error");
    }
  } finally {
    isRequesting = false;
  }
});

// ===============================
// Funções auxiliares
// ===============================
function showMessage(text, type = "") {
  console.log(`💬 Mensagem: ${text} (tipo: ${type})`);
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
}

function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

function getWeatherIcon(code) {
  if ([0, 1].includes(code))
    return `<svg viewBox="0 0 64 64" width="60" height="60">
      <circle cx="32" cy="32" r="14" fill="#FFD93B"/>
      <animate attributeName="opacity" values="1;0.8;1" dur="3s" repeatCount="indefinite"/>
    </svg>`;

  if ([2, 3].includes(code))
    return `<svg viewBox="0 0 64 64" width="60" height="60">
      <ellipse cx="32" cy="40" rx="20" ry="10" fill="#9CA3AF"/>
      <animate attributeName="cx" values="30;34;30" dur="3s" repeatCount="indefinite"/>
    </svg>`;

  if ([61, 63, 65, 80, 95].includes(code))
    return `<svg viewBox="0 0 64 64" width="60" height="60">
      <ellipse cx="32" cy="32" rx="18" ry="10" fill="#9CA3AF"/>
      <line x1="24" y1="42" x2="24" y2="52" stroke="#60A5FA" stroke-width="3">
        <animate attributeName="y1" values="42;48;42" dur="1s" repeatCount="indefinite"/>
      </line>
    </svg>`;

  if ([71].includes(code))
    return `<svg viewBox="0 0 64 64" width="60" height="60">
      <circle cx="32" cy="32" r="10" fill="#9CA3AF"/>
      <text x="28" y="50" font-size="24">❄️</text>
    </svg>`;

  return `<svg viewBox="0 0 64 64" width="60" height="60">
    <circle cx="32" cy="32" r="14" fill="#E5E7EB"/>
  </svg>`;
}

console.log("🚀 Script finalizado, aguardando interação do usuário...");

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    formatTime,
    weatherCodes,
    getWeatherIcon,
  };
}
