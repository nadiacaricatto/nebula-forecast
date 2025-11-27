# ☁️ Nebula Forecast

> App de previsão do tempo em tempo real com interface moderna, glassmorphism e previsão de 5 dias

<div align="center">

![Status](https://img.shields.io/badge/status-ativo-success.svg)
![Versão](https://img.shields.io/badge/versão-2.0.0-blue.svg)
![Testes](https://img.shields.io/badge/testes-19%20passando-success.svg)
![Licença](https://img.shields.io/badge/licença-MIT-green.svg)

</div>

---

## 📖 Sobre o Projeto

O **Nebula Forecast** é uma aplicação web moderna de previsão do tempo que combina design elegante com funcionalidade robusta. Desenvolvido com foco em UX/UI, o app oferece informações climáticas em tempo real com uma interface intuitiva e responsiva.

### ✨ Características Principais

- 🌤️ **Clima em tempo real** - Dados atualizados via Open-Meteo API
- 📅 **Previsão de 5 dias** - Temperaturas máximas e mínimas diárias
- 🕐 **Relógio em tempo real** - Data e hora atualizadas a cada segundo
- 🌓 **Tema dinâmico** - Alterna automaticamente entre dia/noite
- 🎨 **Glassmorphism** - Design moderno com efeitos de vidro
- 📱 **Totalmente responsivo** - Funciona em todos os dispositivos
- ⚡ **Animações suaves** - Transições e efeitos visuais elegantes
- 🧪 **Testado** - 19 testes automatizados com Jest

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização avançada com glassmorphism
- **JavaScript ES6+** - Lógica moderna e assíncrona

### APIs
- **Open-Meteo API** - Dados meteorológicos gratuitos
- **Nominatim (OpenStreetMap)** - Geocodificação de cidades

### Testes
- **Jest** - Framework de testes JavaScript
- **19 testes unitários** - Cobertura de funções principais

---

## 🆕 Atualização v2.0.0 - Previsão de 5 Dias

### O que há de novo?

A versão 2.0 traz a funcionalidade mais solicitada: **previsão estendida para os próximos 5 dias**!

#### 📊 Novos Recursos

✅ **Cards de Previsão Diária**
- Exibição clara de cada dia da semana
- Data formatada (dia/mês)
- Ícone representativo da condição climática
- Temperaturas máximas e mínimas destacadas
- Descrição da condição do tempo

✅ **Design Aprimorado**
- Grid responsivo que se adapta ao tamanho da tela
- Efeito glassmorphism consistente
- Animação shimmer no hover
- Cores diferenciadas para temp. máxima (vermelho) e mínima (azul)

✅ **Performance Otimizada**
- Requisição única para buscar todos os 5 dias
- Renderização eficiente dos cards
- Tratamento de erros robusto

#### 🔧 Implementação Técnica

**Endpoint da API:**
```
https://api.open-meteo.com/v1/forecast?
  latitude={lat}&
  longitude={lon}&
  daily=temperature_2m_max,temperature_2m_min,weathercode&
  timezone=auto&
  forecast_days=5
```

**Estrutura de Dados:**
```javascript
{
  daily: {
    time: ["2024-11-26", "2024-11-27", ...],
    temperature_2m_max: [28.5, 29.2, ...],
    temperature_2m_min: [18.3, 19.1, ...],
    weathercode: [0, 1, 2, ...]
  }
}
```

**Funções Adicionadas:**
- `fetchForecast(lat, lon)` - Busca dados de previsão
- `displayForecast(dailyData)` - Renderiza os cards
- `getWeatherIconSmall(code)` - Gera ícones para previsão

---

## 🧪 Sistema de Testes

### Cobertura Completa

O projeto conta com **19 testes automatizados** distribuídos em 6 categorias:

#### ✅ Testes Unitários (4 testes)
- Formatação de tempo ISO
- Mapeamento de códigos climáticos
- Geração de ícones SVG
- Diferenciação de condições climáticas

#### 🌐 Testes de API (3 testes)
- Fetch de dados da API Open-Meteo
- Tratamento de erro 500 (servidor)
- Tratamento de erro 429 (rate limit)

#### 📊 Testes de Validação (3 testes)
- Estrutura correta dos dados de previsão
- Validação de tipos numéricos
- Formatação de temperaturas

#### ⌨️ Testes de Entrada (3 testes)
- Validação de input vazio
- Suporte a caracteres especiais
- Limpeza de espaços extras

#### 🎨 Testes de Renderização (2 testes)
- Criação correta de elementos
- Formatação de datas

#### 🚨 Testes de Casos Extremos (4 testes)
- Temperaturas extremas (-89°C a +56°C)
- Cidades não encontradas
- Erros de rede
- Códigos climáticos desconhecidos

### Como Rodar os Testes

```bash
# Instalar dependências
npm install

# Rodar todos os testes
npm test

# Rodar com coverage
npm run test:coverage

# Modo watch (auto-reload)
npm run test:watch
```

### Resultado Esperado

```
PASS  api.test.js
  ✅ Testes Unitários - Funções Básicas
    ✓ formatTime deve formatar data ISO corretamente
    ✓ weatherCodes deve conter mapeamentos corretos
    ✓ getWeatherIcon deve retornar SVG válido
    ✓ Códigos diferentes geram ícones diferentes
  🌐 Testes de API - Fetch
    ✓ fetchForecast deve buscar dados da API corretamente
    ✓ Deve lançar erro quando API retorna 500
    ✓ Deve lançar erro quando API retorna 429
  📊 Testes de Validação de Dados
    ✓ Dados de previsão devem ter estrutura correta
    ✓ Temperaturas devem ser números válidos
    ✓ Formatação de temperaturas deve ter 1 casa decimal
  ⌨️ Testes de Entrada do Usuário
    ✓ Input vazio deve ser rejeitado
    ✓ Deve aceitar cidades com caracteres especiais
    ✓ Deve limpar espaços extras do input
  🎨 Testes de Renderização
    ✓ displayForecast deve criar elementos corretos
    ✓ Formatação de data deve estar correta
  🚨 Testes de Casos Extremos
    ✓ Deve lidar com temperaturas extremas
    ✓ Deve lidar com cidade não encontrada
    ✓ Deve lidar com erro de rede
    ✓ Deve validar códigos climáticos desconhecidos

Test Suites: 1 passed, 1 total
Tests:       19 passed, 19 total
Time:        1.234 s
```

---

## 📁 Estrutura do Projeto

```
nebula-forecast/
├── index.html              # Estrutura HTML
├── api.js                  # Lógica JavaScript principal
├── assets/
│   └── css/
│       └── style.css       # Estilos CSS
├── api.test.js             # Testes automatizados
├── package.json            # Configurações npm
├── .gitignore              # Arquivos ignorados pelo git
├── README.md               # Este arquivo
└── COMO-RODAR-TESTES.md    # Guia de testes
```

---

## 🎯 Funcionalidades Detalhadas

### 1. Busca de Clima

Digite o nome de qualquer cidade do mundo e receba:
- ✅ Temperatura atual em °C
- ✅ Velocidade do vento em km/h
- ✅ Condição climática detalhada
- ✅ Horário da última observação

### 2. Previsão de 5 Dias

Visualize a previsão estendida com:
- 📅 Dia da semana e data
- 🌡️ Temperatura máxima (destaque vermelho)
- 🌡️ Temperatura mínima (destaque azul)
- 🌤️ Ícone climático animado
- 📝 Descrição da condição

### 3. Relógio em Tempo Real

- 📅 Data completa por extenso
- 🕐 Hora atualizada a cada segundo
- 🎨 Design integrado ao tema

### 4. Temas Dinâmicos

O app alterna automaticamente entre:
- ☀️ **Tema Dia** - Gradiente vibrante e energético
- 🌙 **Tema Noite** - Gradiente escuro e tranquilo

---

## 🎨 Design

### Glassmorphism

O projeto utiliza o efeito glassmorphism moderno:
- `backdrop-filter: blur(20px)` - Desfoque de fundo
- `background: rgba(255, 255, 255, 0.15)` - Transparência
- `border: 1px solid rgba(255, 255, 255, 0.3)` - Borda sutil
- `box-shadow` - Sombras suaves

### Cores

**Tema Dia:**
- Gradiente: `#667eea → #764ba2 → #f093fb`

**Tema Noite:**
- Gradiente: `#0f0c29 → #302b63 → #24243e`

### Animações

- ✨ Shimmer effect nos cards
- 💫 Float animation no logo
- 🌊 Hover transitions suaves
- 📍 Fade in ao carregar dados

---

## 📱 Responsividade

### Desktop (> 600px)
- Container: 600px de largura
- Cards de previsão: Grid flexível
- Todos os elementos visíveis

### Tablet (600px)
- Cards de previsão: 2 colunas
- Fontes ajustadas
- Espaçamentos otimizados

### Mobile (< 400px)
- Cards de previsão: 1 coluna
- Layout vertical
- Touch-friendly

---

## 🚀 Como Usar

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/nebula-forecast.git
cd nebula-forecast
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Abra o Projeto

Simplesmente abra o `index.html` no navegador ou use um servidor local:

```bash
# Usando Python
python -m http.server 8000

# Usando Node.js (http-server)
npx http-server

# Usando VS Code
# Clique direito no index.html > "Open with Live Server"
```

### 4. Rode os Testes (Opcional)

```bash
npm test
```

---

## 🔮 Roadmap Futuro

Melhorias planejadas para próximas versões:

- [ ] 📈 Gráfico de temperaturas
- [ ] 🕐 Previsão hora a hora
- [ ] 💾 Histórico de buscas
- [ ] ⭐ Cidades favoritas
- [ ] 📲 PWA (Progressive Web App)
- [ ] 🔔 Notificações de alertas climáticos
- [ ] 🌍 Suporte a mais idiomas
- [ ] 🗺️ Mapa interativo

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

### Diretrizes

- ✅ Adicione testes para novas funcionalidades
- ✅ Mantenha o código limpo e comentado
- ✅ Siga o estilo de código existente
- ✅ Atualize a documentação quando necessário

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👩‍💻 Autora

Desenvolvido com 💜 por **Ná**

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [Seu Nome](https://linkedin.com/in/seu-perfil)

---

## 🙏 Agradecimentos

- **Open-Meteo** - API de dados meteorológicos gratuita
- **OpenStreetMap** - Geocodificação via Nominatim
- **Generation Brasil** - Bootcamp de formação
- **Comunidade Dev** - Suporte e inspiração

---

## 📞 Suporte

Encontrou um bug? Tem alguma sugestão?

- 🐛 [Abra uma issue](https://github.com/seu-usuario/nebula-forecast/issues)
- 💬 [Discussões](https://github.com/seu-usuario/nebula-forecast/discussions)

---

<div align="center">

**⭐ Se você gostou do projeto, deixe uma estrela!**

Feito com ☁️ e ☕

</div>