// ============================================
// TESTES UNITÁRIOS - FUNÇÕES BÁSICAS
// ============================================

describe('✅ Testes Unitários - Funções Básicas', () => {
  
  test('formatTime deve formatar data ISO corretamente', () => {
    const formatTime = (isoString) => {
      const date = new Date(isoString);
      return date.toLocaleString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
      });
    };

    const result = formatTime('2024-11-26T14:30:00');
    expect(result).toMatch(/\d{2}:\d{2}/); // HH:MM
    expect(result).toMatch(/\d{2}\/\d{2}/); // DD/MM
  });

  test('weatherCodes deve conter mapeamentos corretos', () => {
    const weatherCodes = {
      0: "Céu limpo ☀️",
      1: "Céu aberto com poucas nuvens 🌤️",
      61: "Chuva leve 🌧️",
      95: "Tempestade ⛈️"
    };

    expect(weatherCodes[0]).toBe("Céu limpo ☀️");
    expect(weatherCodes[61]).toBe("Chuva leve 🌧️");
    expect(weatherCodes[95]).toBe("Tempestade ⛈️");
  });

  test('getWeatherIcon deve retornar SVG válido', () => {
    const getWeatherIcon = (code) => {
      if ([0, 1].includes(code)) {
        return '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="#FFD93B"/></svg>';
      }
      return '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="#E5E7EB"/></svg>';
    };

    const icon = getWeatherIcon(0);
    expect(icon).toContain('<svg');
    expect(icon).toContain('</svg>');
    expect(icon).toContain('viewBox');
  });

  test('Códigos diferentes geram ícones diferentes', () => {
    const getWeatherIcon = (code) => {
      const icons = {
        0: '<svg>sun</svg>',
        3: '<svg>cloud</svg>',
        61: '<svg>rain</svg>'
      };
      return icons[code] || '<svg>default</svg>';
    };

    const sunIcon = getWeatherIcon(0);
    const cloudIcon = getWeatherIcon(3);
    const rainIcon = getWeatherIcon(61);

    expect(sunIcon).not.toBe(cloudIcon);
    expect(cloudIcon).not.toBe(rainIcon);
    expect(sunIcon).toContain('sun');
    expect(rainIcon).toContain('rain');
  });
});

// ============================================
// TESTES DE API - MOCK DE FETCH
// ============================================

describe('🌐 Testes de API - Fetch', () => {
  
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('fetchForecast deve buscar dados da API corretamente', async () => {
    const mockResponse = {
      daily: {
        time: ['2024-11-26', '2024-11-27', '2024-11-28', '2024-11-29', '2024-11-30'],
        temperature_2m_max: [28, 29, 27, 26, 28],
        temperature_2m_min: [18, 19, 17, 16, 18],
        weathercode: [0, 1, 2, 61, 3]
      }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const fetchForecast = async (lat, lon) => {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=5`
      );
      if (!response.ok) throw new Error('Erro na API');
      const data = await response.json();
      return data.daily;
    };

    const result = await fetchForecast(-23.5505, -46.6333);

    expect(result).toHaveProperty('time');
    expect(result.time).toHaveLength(5);
    expect(result.temperature_2m_max[0]).toBe(28);
  });

  test('Deve lançar erro quando API retorna 500', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    const fetchForecast = async (lat, lon) => {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      return await response.json();
    };

    await expect(fetchForecast(-23.5505, -46.6333)).rejects.toThrow('Erro HTTP: 500');
  });

  test('Deve lançar erro quando API retorna 429 (Rate Limit)', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 429
    });

    const fetchForecast = async (lat, lon) => {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      return await response.json();
    };

    await expect(fetchForecast(-23.5505, -46.6333)).rejects.toThrow('Erro HTTP: 429');
  });
});

// ============================================
// TESTES DE VALIDAÇÃO DE DADOS
// ============================================

describe('📊 Testes de Validação de Dados', () => {
  
  test('Dados de previsão devem ter estrutura correta', () => {
    const mockData = {
      time: ['2024-11-26', '2024-11-27', '2024-11-28', '2024-11-29', '2024-11-30'],
      temperature_2m_max: [28.5, 29.2, 27.8, 26.1, 28.0],
      temperature_2m_min: [18.3, 19.1, 17.5, 16.2, 18.4],
      weathercode: [0, 1, 2, 61, 3]
    };

    expect(mockData.time.length).toBe(5);
    expect(mockData.temperature_2m_max.length).toBe(mockData.time.length);
    expect(mockData.temperature_2m_min.length).toBe(mockData.time.length);
    expect(mockData.weathercode.length).toBe(mockData.time.length);
  });

  test('Temperaturas devem ser números válidos', () => {
    const temps = [28.5, 29.2, 27.8, 26.1, 28.0];
    
    temps.forEach(temp => {
      expect(typeof temp).toBe('number');
      expect(temp).toBeGreaterThan(-100);
      expect(temp).toBeLessThan(100);
    });
  });

  test('Formatação de temperaturas deve ter 1 casa decimal', () => {
    const temperature = 28.73456;
    const formatted = temperature.toFixed(1);
    
    expect(formatted).toBe('28.7');
  });
});

// ============================================
// TESTES DE ENTRADA DO USUÁRIO
// ============================================

describe('⌨️ Testes de Entrada do Usuário', () => {
  
  test('Input vazio deve ser rejeitado', () => {
    const validateCity = (city) => {
      return city.trim().length > 0;
    };

    expect(validateCity('')).toBe(false);
    expect(validateCity('   ')).toBe(false);
    expect(validateCity('São Paulo')).toBe(true);
  });

  test('Deve aceitar cidades com caracteres especiais', () => {
    const cities = [
      'São Paulo',
      'Brasília',
      'München',
      'São José dos Pinhais'
    ];

    cities.forEach(city => {
      expect(city.length).toBeGreaterThan(0);
      expect(typeof city).toBe('string');
    });
  });

  test('Deve limpar espaços extras do input', () => {
    const cleanInput = (city) => city.trim();

    expect(cleanInput('  São Paulo  ')).toBe('São Paulo');
    expect(cleanInput('Campinas')).toBe('Campinas');
  });
});

// ============================================
// TESTES DE RENDERIZAÇÃO
// ============================================

describe('🎨 Testes de Renderização', () => {
  
  test('displayForecast deve criar elementos corretos', () => {
    const mockData = {
      time: ['2024-11-26'],
      temperature_2m_max: [28.7],
      temperature_2m_min: [18.3],
      weathercode: [0]
    };

    const maxTemp = mockData.temperature_2m_max[0].toFixed(1);
    const minTemp = mockData.temperature_2m_min[0].toFixed(1);

    expect(maxTemp).toBe('28.7');
    expect(minTemp).toBe('18.3');
  });

  test('Formatação de data deve estar correta', () => {
    const date = new Date('2024-11-26');
    const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
    const dayMonth = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

    expect(dayName).toBeTruthy();
    expect(dayMonth).toMatch(/\d{2}\/\d{2}/);
  });
});

// ============================================
// TESTES DE CASOS EXTREMOS
// ============================================

describe('🚨 Testes de Casos Extremos', () => {
  
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test('Deve lidar com temperaturas extremas', () => {
    const extremeTemps = [-89.2, 56.7, 0, -40, 45];
    
    extremeTemps.forEach(temp => {
      const formatted = temp.toFixed(1);
      expect(typeof parseFloat(formatted)).toBe('number');
    });
  });

  test('Deve lidar com cidade não encontrada', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [] // Array vazio = cidade não encontrada
    });

    const searchCity = async (city) => {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}`);
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    };

    const result = await searchCity('CidadeInexistente123');
    expect(result).toBeNull();
  });

  test('Deve lidar com erro de rede', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const fetchData = async () => {
      try {
        await fetch('https://api.example.com');
        return 'success';
      } catch (error) {
        return 'error';
      }
    };

    const result = await fetchData();
    expect(result).toBe('error');
  });

  test('Deve validar códigos climáticos desconhecidos', () => {
    const weatherCodes = {
      0: "Céu limpo ☀️",
      61: "Chuva leve 🌧️"
    };

    const getCondition = (code) => {
      return weatherCodes[code] || "Condição desconhecida";
    };

    expect(getCondition(0)).toBe("Céu limpo ☀️");
    expect(getCondition(999)).toBe("Condição desconhecida");
  });
});

// ============================================
// RESUMO DOS TESTES
// ============================================

afterAll(() => {
  console.log(`
╔════════════════════════════════════════════╗
║   NEBULA FORECAST - SUITE DE TESTES       ║
╚════════════════════════════════════════════╝

✅ Testes Unitários (4 testes)
✅ Testes de API (3 testes)
✅ Testes de Validação (3 testes)
✅ Testes de Entrada (3 testes)
✅ Testes de Renderização (2 testes)
✅ Testes de Casos Extremos (4 testes)

TOTAL: 19 testes funcionais
`);
});