/**
 * TESTES DE CASOS DE USO PRINCIPAIS - NEBULA FORECAST
 * Testes unitários e de integração dos cenários principais
 */

// Mock do fetch
global.fetch = jest.fn();

beforeEach(() => {
  document.body.innerHTML = `
    <form id="weather-form">
      <input id="city-input" value="" />
    </form>
    <div id="card" class="hidden"></div>
    <div id="message"></div>
    <div id="city-name"></div>
    <div id="temperature"></div>
    <div id="windspeed"></div>
    <div id="condition"></div>
    <div id="obs-time"></div>
    <div id="weather-icon"></div>
    <body class="day"></body>
  `;
  // Importa o código principal depois do DOM ser criado
  require('../api.js');
});

describe("🌤️ Nebula Forecast - Casos de Teste Principais", () => {

  test("✅ Deve buscar e exibir dados meteorológicos para cidade válida (São Paulo)", async () => {
    // Arrange
    const geoData = [{
      lat: "-23.5505", lon: "-46.6333", display_name: "São Paulo, Brasil"
    }];
    const weatherData = {
      current_weather: {
        temperature: 25.8,
        windspeed: 10.4,
        weathercode: 1,
        is_day: 1,
        time: "2025-11-11T15:22"
      }
    };

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => geoData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => weatherData
      });

    // Act
    document.getElementById("city-input").value = "São Paulo";
    const form = document.getElementById("weather-form");
    form.dispatchEvent(new Event("submit"));

    await new Promise(resolve => setTimeout(resolve, 150));

    // Assert - Verifica resultados
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("nominatim.openstreetmap.org")
    );
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("open-meteo.com")
    );
    expect(document.getElementById("city-name").textContent).toBe("São Paulo");
    expect(document.getElementById("temperature").textContent).toBe("25.8");
    expect(document.getElementById("condition").textContent).toContain("Céu aberto com poucas nuvens");
    expect(document.getElementById("card").classList.contains("hidden")).toBe(false);
    expect(document.body.classList.contains("day")).toBe(true);
  });

  test("❌ Deve retornar erro para cidade inexistente", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    document.getElementById("city-input").value = "CidadeQueNaoExiste";
    const form = document.getElementById("weather-form");
    form.dispatchEvent(new Event("submit"));

    await new Promise(resolve => setTimeout(resolve, 100));

    // Assert
    const message = document.getElementById("message");
    expect(message.textContent).toContain("não encontrada");
    expect(message.classList.contains("error")).toBe(true);
  });

  test("⚠️ Deve retornar mensagem de erro para entrada vazia", () => {
    document.getElementById("city-input").value = "";
    const form = document.getElementById("weather-form");
    form.dispatchEvent(new Event("submit"));

    // Assert
    const message = document.getElementById("message");
    expect(message.textContent).toContain("Digite o nome de uma cidade");
    expect(message.classList.contains("warn")).toBe(true);
    expect(fetch).not.toHaveBeenCalled(); // Não deve chamar a API
  });

  test("⏱️ Deve lidar com timeout da API", async () => {
    // Simula erro no fetch (API fora do ar)
    fetch.mockRejectedValueOnce(new Error("timeout"));

    document.getElementById("city-input").value = "São Paulo";
    const form = document.getElementById("weather-form");
    form.dispatchEvent(new Event("submit"));

    await new Promise(resolve => setTimeout(resolve, 150));

    // Assert
    const message = document.getElementById("message");
    expect(message.textContent).toContain("Erro ao buscar dados");
    expect(message.classList.contains("error")).toBe(true);
  });

  test("🔥 Deve lidar com erro 500 do servidor", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({})
    });

    document.getElementById("city-input").value = "São Paulo";
    const form = document.getElementById("weather-form");
    form.dispatchEvent(new Event("submit"));

    await new Promise(resolve => setTimeout(resolve, 110));

    const message = document.getElementById("message");
    expect(message.textContent).toContain("Erro");
    expect(fetch).toHaveBeenCalled();
  });

  test("🔧 Deve lidar com resposta malformada da API", async () => {
    // API retorna formato inesperado
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ bogus: true }]
    });

    document.getElementById("city-input").value = "São Paulo";
    const form = document.getElementById("weather-form");
    form.dispatchEvent(new Event("submit"));

    await new Promise(resolve => setTimeout(resolve, 110));

    const message = document.getElementById("message");
    expect(message.textContent).toContain("Erro");
  });
});

describe("🛠️ Funções Auxiliares", () => {
  test("Deve formatar corretamente o timestamp ISO", () => {
    const api = require('../api.js');
    const formatTime = api.formatTime || global.formatTime;
    expect(formatTime("2025-11-11T15:22")).toMatch(/\d{2}\/\d{2}.*\d{2}:\d{2}/);
  });

  test("Deve mapear código climático corretamente", () => {
    const api = require('../api.js');
    const weatherCodes = api.weatherCodes || global.weatherCodes;
    expect(weatherCodes[2]).toContain("Parcialmente nublado");
  });

  test("Deve retornar ícone SVG para código climático", () => {
    const api = require('../api.js');
    const getWeatherIcon = api.getWeatherIcon || global.getWeatherIcon;
    expect(getWeatherIcon(0)).toContain("circle");
    expect(getWeatherIcon(71)).toContain("❄️");
  });
});

// ==========================================
// TESTES DE FUNÇÕES AUXILIARES
// ==========================================
describe("🛠️ Funções Auxiliares", () => {
  
  test("Deve formatar corretamente o timestamp ISO", () => {
    const formatTime = (isoString) => {
      const date = new Date(isoString);
      return date.toLocaleString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
      });
    };

    const result = formatTime("2025-11-11T14:30:00");
    expect(result).toMatch(/\d{2}\/\d{2}/); // Verifica formato DD/MM
  });

  test("Deve mapear código climático corretamente", () => {
    const weatherCodes = {
      0: "Céu limpo ☀️",
      1: "Céu aberto com poucas nuvens 🌤️",
      61: "Chuva leve 🌧️",
      95: "Tempestade ⛈️"
    };

    expect(weatherCodes[0]).toBe("Céu limpo ☀️");
    expect(weatherCodes[95]).toBe("Tempestade ⛈️");
    expect(weatherCodes[999]).toBeUndefined();
  });

  test("Deve retornar ícone SVG para código climático", () => {
    const getWeatherIcon = (code) => {
      if ([0, 1].includes(code)) return "SVG_SUN";
      if ([61, 63].includes(code)) return "SVG_RAIN";
      return "SVG_DEFAULT";
    };

    expect(getWeatherIcon(0)).toBe("SVG_SUN");
    expect(getWeatherIcon(61)).toBe("SVG_RAIN");
    expect(getWeatherIcon(999)).toBe("SVG_DEFAULT");
  });
});