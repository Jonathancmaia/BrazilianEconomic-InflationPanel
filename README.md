# 📊 Painel de Indicadores Macroeconômicos & Inflação (BACEN)

> **Projeto de Analytics / Business Intelligence**  
 **Acesse o Dashboard ao vivo:** [Link do seu GitHub Pages aqui](https://jonathancmaia.github.io/BrazilianEconomic-InflationPanel/)

---

## Visão Geral do Projeto
Este projeto consiste em um **Dashboard Interativo de Análise Econômica** construído para monitorar e analisar a evolução de indicadores essenciais da economia brasileira, como **Taxa Selic, IPCA (Inflação) e Cotação do Dólar**.

O objetivo principal é transformar dados brutos disponibilizados em tempo real por órgãos oficiais em visualizações executivas e *insights* estratégicos de fácil interpretação para tomada de decisão em negócios e finanças.

---

## Arquitetura & Tecnologias
* **Consumo de Dados:** API pública do **Banco Central do Brasil (SGS - Sistema Gerenciador de Séries Temporais)**
* **Linguagens & Front-End:** HTML5, CSS3 e JavaScript (ES6+)
* **Visualização de Dados:** Chart.js
* **Estilização & Grid:** Bootstrap 5 (Responsive Layout)
* **Hospedagem & Deploy:** GitHub Pages (Servidor Estático / Client-Side Rendering)

---

## Funcionalidades do Dashboard
- **Consumo em Tempo Real:** Conexão direta via REST/HTTP com as APIs oficiais do Banco Central (sem necessidade de banco de dados intermediário).
- **Tratamento & Limpeza de Dados:** Parseamento de datas, conversão de tipos de dados numéricos e tratamento de valores ausentes via JavaScript (`fetch` / Async-Await).
- **Cartões de Métricas (KPIs):** Exibição dos valores mais recentes calculados dinamicamente.
- **Gráficos Interativos:**
  - *Histórico da Taxa Selic:* Acompanhamento das decisões de política monetária.
  - *Evolução do IPCA:* Monitoramento de tendência de inflação.
  - *Comportamento do Câmbio:* Histórico da cotação do Dólar.
- **Filtros Dinâmicos:** Seletor de períodos para análise de tendências de curto, médio e longo prazo.

---

## Insights Executivos de Negócio

> *Exemplo de análise técnica fundamentada nos dados coletados pelo painel:*

1. **Impacto no Custo de Crédito:** As variações na **Taxa Selic** correlacionam-se diretamente com o custo de captação de recursos. Períodos de alta de juros exigem das empresas uma gestão mais rígida do capital de giro e renegociação de dívidas indexadas ao CDI.
2. **Pressão Custos e Margem de Lucro (IPCA):** A aceleração da inflação acumulada afeta diretamente a margem operacional. Acompanhar a trajetória do IPCA permite antecipar a necessidade de reajustes de preços e precificação de produtos/serviços.
3. **Exposição Cambial:** A volatilidade do Dólar exige atenção especial em empresas com insumos importados ou receitas dolarizadas, destacando a importância de estratégias de *hedge* financeiro.

---

## Como Executar o Projeto Localmente

Como a aplicação é executada 100% no lado do cliente (Client-side), não é necessário instalar dependências ou servidores de back-end.

1. Clone este repositório:
   ```bash
   git clone [https://github.com/jonathancmaia/nome-do-seu-repositorio.git](https://github.com/jonathancmaia/nome-do-seu-repositorio.git)
