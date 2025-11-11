/**
 * CONFIGURAÇÃO DO JEST
 * Arquivo: jest.config.js
 */

module.exports = {
  // Ambiente de teste (jsdom simula o navegador)
  testEnvironment: "jsdom",

  // Padrão de arquivos de teste
  testMatch: [
    "**/__tests__/**/*.js",
    "**/?(*.)+(spec|test).js"
  ],

  // Cobertura de código
  collectCoverageFrom: [
    "api.js",
    "!node_modules/**",
    "!coverage/**"
  ],

  // Thresholds de cobertura
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Configurações de timeout
  testTimeout: 10000,

  // Setup antes dos testes
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Transformação de arquivos
  transform: {
    "^.+\\.js$": "babel-jest"
  },

  // Mock de arquivos estáticos
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },

  // Verbosidade
  verbose: true,

  // Limpar mocks automaticamente
  clearMocks: true,

  // Relatório de cobertura
  coverageReporters: [
    "text",
    "lcov",
    "html"
  ]
};