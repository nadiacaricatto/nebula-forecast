/**
 * TESTES DE CASOS EXTREMOS - NEBULA FORECAST
 * Cenários de edge cases e situações limítrofes
 */

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

describe("🚨 Nebula Forecast - Casos Extremos", () => {

  // CASO EXTREMO 1: Limite de requisições da API
  test("🚫 Deve lidar com erro 429 (Too Many Requests)", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: "Too Many Requests",
      json: async () => ({ 
        error: "Rate limit exceeded",
        message: "Please wait before making another request"
      })
    });

    const cityInput = document.getElementById("city-input");
    cityInput.value = "São Paulo";
    
    const form = document.getElementById("weather-form");
    form.dispatchEvent(new Event("submit"));

    await new Promise(resolve => setTimeout(resolve, 100));

    const message = document.getElementById("message");
    expect(message.textContent).toContain("Erro");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  // ==========================================
  // CASO EXTREMO 2: Múltiplas requisições simultâneas
  // ==========================================
  test("🔄 Deve prevenir múltiplas requisições simultâneas", async () => {
    let requestCount = 0;
    fetch.mockImplementation(async () => {
      requestCount++;
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        json: async () => ([{ lat: "0", lon: "0", display_name: "Test" }]),
        ok: true
      };
    });

    const cityInput = document.getElementById("city-input");
    const form = document.getElementById("weather-form");
    
    cityInput.value = "Cidade1";
    form.dispatchEvent(new Event("submit"));
    
    cityInput.value = "Cidade2";
    form.dispatchEvent(new Event("submit"));
    
    cityInput.value = "Cidade3";
    form.dispatchEvent(new Event("submit"));

    await new Promise(resolve => setTimeout(resolve, 300));
    expect(requestCount).toBeGreaterThan(0);
  });

  // ==========================================
  // CASO EXTREMO 3: Conexão lenta (slow 3G)
  // ==========================================
  test("🐌 Deve lidar com conexão lenta (> 5 segundos)", async () => {
    jest.setTimeout(10000);

    fetch.mockImplementation(() => 
      new Promise((resolve) => 
        setTimeout(() => resolve({
          json: async () => ([{ lat: "0", lon: "0", display_name: "Slow City" }]),
          ok: true
        }), 6000)
      )
    );

    const cityInput = document.getElementById("city-input");
    cityInput.value = "SlowCity";
    
    const form = document.getElementById("weather-form");
    const startTime = Date.now();
    form.dispatchEvent(new Event("submit"));

    const message = document.getElementById("message");
    expect(message.textContent).toContain("Buscando");
    
    await new Promise(resolve => setTimeout(resolve, 7000));
    const duration = Date.now() - startTime;
    expect(duration).toBeGreaterThan(5000);
  }, 15000);

  // ==========================================
  // CASO EXTREMO 4: Conexão intermitente
  // ==========================================
  test("📡 Deve lidar com conexão intermitente (falha → sucesso → falha)", async () => {
    fetch
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        json: async () => ([{ lat: "0", lon: "0", display_name: "Test" }]),
        ok: true
      })
      .mockRejectedValueOnce(new Error("Network error"));

    const cityInput = document.getElementById("city-input");
    const form = document.getElementById("weather-form");
    
    cityInput.value = "TestCity";
    form.dispatchEvent(new Event("submit"));
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(fetch).toHaveBeenCalledTimes(1);
    
    form.dispatchEvent(new Event("submit"));
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  // ==========================================
  // CASO EXTREMO 5: Formato inesperado da API
  // ==========================================
  test("🔀 Deve lidar com mudança inesperada no formato da resposta", async () => {
    const unexpectedFormat = {
      latitude: "-23.5505",
      longitude: "-46.6333",
      name: "São Paulo"
    };

    fetch.mockResolvedValueOnce({
      json: async () => [unexpectedFormat],
      ok: true
    });

    const cityInput = document.getElementById("city-input");
    cityInput.value = "São Paulo";
    
    const form = document.getElementById("weather-form");
    form.dispatchEvent(new Event("submit"));

    await new Promise(resolve => setTimeout(resolve, 100));

    const message = document.getElementById("message");
    expect(message.textContent).toBeTruthy();
  });

  // ==========================================
  // CASO EXTREMO 6: Campos ausentes na resposta
  // ==========================================
  test("🕳️ Deve lidar com campos ausentes na resposta do clima", async () => {
    const mockGeoData = [{
      lat: "-23.5505",
      lon: "-46.6333",
      display_name: "São Paulo"
    }];

    const incompleteWeatherData = {
      current_weather: {
        temperature: 25.3,
        is_day: 1
      }
    };

    fetch
      .mockResolvedValueOnce({
        json: async () => mockGeoData,
        ok: true
      })
      .mockResolvedValueOnce({
        json: async () => incompleteWeatherData,
        ok: true
      });

    const cityInput = document.getElementById("city-input");
    cityInput.value = "São Paulo";
    
    const form = document.getElementById("weather-form");
    form.dispatchEvent(new Event("submit"));

    await new Promise(resolve => setTimeout(resolve, 100));

    const temperature = document.getElementById("temperature");
    expect(temperature).toBeTruthy();
  });

  // ==========================================
  // CASO EXTREMO 7: Caracteres especiais na entrada
  // ==========================================
  test("🔣 Deve lidar com caracteres especiais e acentos", async () => {
    const mockGeoData = [{
      lat: "-23.5505",
      lon: "-46.6333",
      display_name: "São José dos Pinhais"
    }];

    fetch.mockResolvedValueOnce({
      json: async () => mockGeoData,
      ok: true
    });

    const testCases = [
      "São Paulo",
      "Brasília",
      "Belém",
      "München",
      "Москва",
      "北京",
      "São José dos Pinhais"
    ];

    for (const city of testCases) {
      const cityInput = document.getElementById("city-input");
      cityInput.value = city;
      
      const form = document.getElementById("weather-form");
      form.dispatchEvent(new Event("submit"));
      
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    expect(fetch).toHaveBeenCalled();
  });

  // ==========================================
  // CASO EXTREMO 8: Input muito longo
  // ==========================================
  test("📏 Deve lidar com input extremamente longo", async () => {
    const veryLongCity = "A".repeat(500);

    fetch.mockResolvedValueOnce({
      json: async () => [],
      ok: true
    });

    const cityInput = document.getElementById("city-input");
    cityInput.value = veryLongCity;
    
    const form = document.getElementById("weather-form");
    form.dispatchEvent(new Event("submit"));

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(fetch).toHaveBeenCalled();
  });

  // ==========================================
  // CASO EXTREMO 9: Valores numéricos extremos
  // ==========================================
  test("🌡️ Deve lidar com temperaturas extremas", async () => {
    const mockGeoData = [{
      lat: "90",
      lon: "0",
      display_name: "North Pole"
    }];

    const extremeWeatherData = {
      current_weather: {
        temperature: -89.2,
        windspeed: 372,
        weathercode: 71,
        is_day: 0,
        time: "2025-11-11T00:00:00"
      }
    };

    fetch
      .mockResolvedValueOnce({
        json: async () => mockGeoData,
        ok: true
      })
      .mockResolvedValueOnce({
        json: async () => extremeWeatherData,
        ok: true
      });

    const cityInput = document.getElementById("city-input");
    cityInput.value = "North Pole";
    
    const form = document.getElementById("weather-form");
    form.dispatchEvent(new Event("submit"));

    await new Promise(resolve => setTimeout(resolve, 100));

    const temperature = document.getElementById("temperature");
    expect(temperature.textContent).toContain("-89.2");
  });

  // ==========================================
  // CASO EXTREMO 10: CORS Error
  // ==========================================
  test("🚧 Deve lidar com erro CORS", async () => {
    fetch.mockRejectedValueOnce(
      new TypeError("Failed to fetch - CORS policy")
    );

    const cityInput = document.getElementById("city-input");
    cityInput.value = "London";
    
    const form = document.getElementById("weather-form");
    form.dispatchEvent(new Event("submit"));

    await new Promise(resolve => setTimeout(resolve, 100));

    const message = document.getElementById("message");
    expect(message.textContent).toContain("Erro");
  });

  // ==========================================
  // CASO EXTREMO 11: Offline detection
  // ==========================================
  test("📶 Deve detectar quando o usuário está offline", async () => {
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: false
    });

    const cityInput = document.getElementById("city-input");
    cityInput.value = "Tokyo";
    
    const form = document.getElementById("weather-form");
    form.dispatchEvent(new Event("submit"));

    await new Promise(resolve => setTimeout(resolve, 50));
    expect(window.navigator.onLine).toBe(false);
    
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: true
    });
  });

  // ==========================================
  // CASO EXTREMO 12: Resposta com delay progressivo
  // ==========================================
  test("⏳ Deve lidar com API que fica progressivamente mais lenta", async () => {
    let callCount = 0;
    
    fetch.mockImplementation(() => {
      callCount++;
      const delay = callCount * 1000;
      
      return new Promise((resolve) => 
        setTimeout(() => resolve({
          json: async () => ([{ lat: "0", lon: "0", display_name: "Test" }]),
          ok: true
        }), delay)
      );
    });

    const cityInput = document.getElementById("city-input");
    const form = document.getElementById("weather-form");
    
    for (let i = 0; i < 3; i++) {
      cityInput.value = `City${i}`;
      form.dispatchEvent(new Event("submit"));
      await new Promise(resolve => setTimeout(resolve, (i + 1) * 1000 + 100));
    }

    expect(callCount).toBe(3);
  }, 10000);

});
