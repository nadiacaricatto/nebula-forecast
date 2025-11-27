# NOTICE - Atribuições e Créditos de Terceiros

**Nebula Forecast v2.0.0**  
Copyright (c) 2024 Nadia Caricatto

Este documento registra as atribuições e créditos de APIs, bibliotecas, componentes e recursos de terceiros utilizados nesta aplicação, em conformidade com as obrigações legais e éticas de reconhecimento de autoria e licenciamento.

---

## 📡 APIs de Terceiros

### 1. Open-Meteo Weather API

**Descrição:** API de dados meteorológicos gratuita e de código aberto  
**Website:** https://open-meteo.com  
**Licença:** CC BY 4.0 (Creative Commons Attribution 4.0 International)  
**Uso:** Fornecimento de dados climáticos em tempo real e previsão de 5 dias  
**Atribuição Requerida:** ✅ Sim

**Dados Utilizados:**
- Temperatura atual (°C)
- Velocidade do vento (km/h)
- Código de condição climática
- Temperaturas máximas e mínimas diárias
- Status dia/noite

**Endpoints:**
```
https://api.open-meteo.com/v1/forecast
```

**Termos de Uso:** https://open-meteo.com/en/terms  
**Política de Privacidade:** https://open-meteo.com/en/terms#privacy

**Citação Requerida:**
```
Weather data provided by Open-Meteo.com (CC BY 4.0)
Dados meteorológicos fornecidos por Open-Meteo.com (CC BY 4.0)
```

---

### 2. Nominatim Geocoding API (OpenStreetMap)

**Descrição:** Serviço de geocodificação baseado em dados OpenStreetMap  
**Website:** https://nominatim.openstreetmap.org  
**Licença:** ODbL (Open Database License)  
**Uso:** Conversão de nomes de cidades em coordenadas geográficas  
**Atribuição Requerida:** ✅ Sim

**Dados Utilizados:**
- Coordenadas geográficas (latitude, longitude)
- Nome completo da localização (display_name)

**Endpoints:**
```
https://nominatim.openstreetmap.org/search
```

**Termos de Uso:** https://operations.osmfoundation.org/policies/nominatim/  
**Usage Policy:** https://operations.osmfoundation.org/policies/nominatim/

**Citação Requerida:**
```
Geocoding powered by Nominatim and OpenStreetMap contributors
Geocodificação fornecida por Nominatim e colaboradores do OpenStreetMap
```

**Dados OpenStreetMap:**
- Copyright © OpenStreetMap contributors
- Licença: Open Database License (ODbL)
- Website: https://www.openstreetmap.org/copyright

---

## 🎨 Recursos Visuais

### 3. Google Fonts - Poppins

**Descrição:** Família de fontes tipográficas  
**Designer:** Indian Type Foundry, Jonny Pinhorn  
**Website:** https://fonts.google.com/specimen/Poppins  
**Licença:** Open Font License (OFL)  
**Uso:** Tipografia principal da aplicação

**Licença OFL:**
- ✅ Uso comercial permitido
- ✅ Modificação permitida
- ✅ Distribuição permitida
- ❌ Venda da fonte standalone não permitida

**Atribuição:**
```
Font: Poppins
Designed by: Indian Type Foundry, Jonny Pinhorn
License: SIL Open Font License 1.1
```

---

## 📦 Dependências de Desenvolvimento

### 4. Jest Testing Framework

**Descrição:** Framework de testes JavaScript  
**Mantido por:** Meta (Facebook) Open Source  
**Website:** https://jestjs.io  
**Licença:** MIT License  
**Versão:** ^30.2.0  
**Uso:** Testes automatizados da aplicação

**Copyright:**
```
Copyright (c) Meta Platforms, Inc. and affiliates.
```

**Licença:** MIT (compatível com uso comercial)

---

### 5. Babel

**Descrição:** Transpilador JavaScript  
**Mantido por:** Babel Team  
**Website:** https://babeljs.io  
**Licença:** MIT License  
**Versão:** ^7.28.5  
**Uso:** Transpilação de código para testes

**Pacotes utilizados:**
- @babel/core
- @babel/preset-env
- babel-jest

**Copyright:**
```
Copyright (c) 2014-present Sebastian McKenzie and other contributors
```

**Licença:** MIT (compatível com uso comercial)

---

## 📋 Conformidade de Licenciamento

### Resumo de Licenças Utilizadas

| Componente | Licença | Uso Comercial | Atribuição Requerida | Modificação Permitida |
|------------|---------|---------------|----------------------|----------------------|
| Open-Meteo API | CC BY 4.0 | ✅ Sim | ✅ Sim | ✅ Sim |
| Nominatim/OSM | ODbL | ✅ Sim | ✅ Sim | ✅ Sim |
| Google Fonts (Poppins) | OFL 1.1 | ✅ Sim | ✅ Sim | ✅ Sim |
| Jest | MIT | ✅ Sim | ❌ Não | ✅ Sim |
| Babel | MIT | ✅ Sim | ❌ Não | ✅ Sim |
| Nebula Forecast | MIT | ✅ Sim | ❌ Não | ✅ Sim |

### Análise de Compatibilidade

✅ **Todas as licenças são compatíveis entre si**  
✅ **Uso comercial permitido em todos os componentes**  
✅ **Atribuições obrigatórias devidamente implementadas**  
✅ **Sem conflitos de licenciamento identificados**

---

## ⚖️ Obrigações Legais Cumpridas

### Atribuições Implementadas

1. **No código-fonte (HTML):**
```html
<footer class="footer">
  <small>
    Dados via <strong>Open-Meteo</strong> • 
    Geocodificação via <strong>OpenStreetMap</strong>
  </small>
</footer>
```

2. **No README.md:**
- Seção "Agradecimentos" com créditos completos
- Links para APIs e suas documentações

3. **Neste arquivo NOTICE.md:**
- Atribuições detalhadas de todos os componentes
- Informações de licenciamento completas
- Links para termos de uso e políticas

---

## 🔗 Links de Referência

### Licenças

- **MIT License:** https://opensource.org/licenses/MIT
- **CC BY 4.0:** https://creativecommons.org/licenses/by/4.0/
- **ODbL:** https://opendatacommons.org/licenses/odbl/
- **OFL 1.1:** https://scripts.sil.org/OFL

### Documentação de APIs

- **Open-Meteo Docs:** https://open-meteo.com/en/docs
- **Nominatim Docs:** https://nominatim.org/release-docs/latest/
- **OpenStreetMap:** https://www.openstreetmap.org/about

### Políticas

- **Open-Meteo Terms:** https://open-meteo.com/en/terms
- **Nominatim Usage Policy:** https://operations.osmfoundation.org/policies/nominatim/
- **OSM Copyright:** https://www.openstreetmap.org/copyright

---

## 📞 Contato para Questões de Licenciamento

Para questões relacionadas ao licenciamento deste projeto:

**Projeto:** Nebula Forecast  
**Mantenedora:** Nadia Caricatto  
**GitHub:** https://github.com/nadiacaricatto/projeto_clima  
**Licença do Projeto:** MIT License

---

## 📝 Histórico de Revisões

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | 26/11/2024 | Criação inicial do NOTICE.md |
| 1.0 | 26/11/2024 | Documentação completa de todas as dependências |

---

**Última Atualização:** 26 de Novembro de 2024  
**Versão do Documento:** 1.0