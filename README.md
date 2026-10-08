# 🚀 01-api-playwright | Automação de Testes de API com Playwright, TypeScript & Zod

Projeto de automação de testes de API RESTful de nível profissional (SDET / QA Automation Lead), com arquitetura desacoplada, validação estrita de contratos de dados com **Zod**, geração dinâmica de massa de dados via **Faker**, encapsulamento de requisições através do **Controller Pattern (API Client)** e separação clara entre testes de contrato e testes de integração de ponta a ponta (E2E).

---

## 🎯 API Alvo
- **Nome:** ServeRest API
- **Base URL:** `https://serverest.dev`
- **Documentação:** [Swagger / Documentação ServeRest](https://serverest.dev)

---

## 🏗️ Arquitetura e Padrões de Projeto

```text
01-api-playwright/
├── src/
│   ├── config/
│   │   └── env.ts               # Gerenciamento centralizado de variáveis de ambiente
│   ├── controllers/             # Camada de API Client (Controller Pattern)
│   │   ├── auth.controller.ts   # Requisições de autenticação e obtenção de token
│   │   ├── users.controller.ts  # Requisições de usuários (CRUD completo)
│   │   └── products.controller.ts # Requisições de produtos (com injeção de bearer token)
│   ├── schemas/                 # Definição e inferência de tipos com Zod
│   │   ├── user.schema.ts       # Schemas de request, response e contratos de usuários
│   │   └── product.schema.ts    # Schemas de request, response e contratos de produtos
│   ├── fixtures/                # Massas dinâmicas de teste (Data Factory Pattern)
│   │   └── user.factory.ts      # Geração de usuários válidos, admins e cenários negativos
│   └── utils/
│       └── schema-validator.ts  # Validador genérico de schemas Zod integrado às asserções do Playwright
├── tests/
│   ├── contract/                # Testes puros de validação de schema/contrato
│   │   └── users-contract.spec.ts
│   └── e2e/                     # Fluxos de regras de negócio e jornada de usuário
│       ├── auth.spec.ts         # Autenticação, tokens e proteção de rotas
│       └── users-crud.spec.ts   # Ciclo de vida completo do usuário e regras de validação
├── playwright.config.ts         # Configurações do Playwright Test Runner para execução de API
├── tsconfig.json                # Configurações do TypeScript com path aliases e strict mode
├── package.json                 # Dependências e scripts de execução
└── README.md                    # Documentação técnica do projeto
```

### 💡 Principais Decisões de Design
1. **Controller / API Client Pattern:** As chamadas HTTP (`get`, `post`, `put`, `delete`) estão centralizadas em classes controladoras, mantendo os testes limpos, legíveis e focados nas asserções de negócio.
2. **Validação de Contrato com Zod:** Validação estrita de contratos de resposta em tempo de execução, com inferência estática de tipos TypeScript e mensagens de erro legíveis em caso de discrepância de schema.
3. **Data Factory com Faker:** Geração dinâmica de emails e dados únicos por teste, eliminando conflitos de concorrência ou dados duplicados em execuções paralelas.
4. **Idempotência e Teardown Automático:** Os testes criam seus próprios recursos e executam limpeza (`cleanup`) após a execução, garantindo testes independentes e sem efeitos colaterais.

---

## 📋 Cenários de Teste Cobertos

### 📑 Testes de Contrato (`tests/contract/`)
| ID | Cenário | Objetivo |
|---|---|---|
| **TC-C01** | `GET /usuarios` | Valida conformidade do payload de listagem com `UserListSchema` |
| **TC-C02** | `POST /usuarios` | Valida schema da resposta de criação com `CreateUserResponseSchema` |
| **TC-C03** | `GET /usuarios/{id}` | Valida schema do usuário único com `UserSchema` |
| **TC-C04** | `PUT /usuarios/{id}` | Valida schema da resposta de atualização com `UpdateUserResponseSchema` |
| **TC-C05** | `DELETE /usuarios/{id}` | Valida schema da resposta de exclusão com `DeleteUserResponseSchema` |
| **TC-C06** | `POST /usuarios` (duplicado) | Valida conformidade do schema de erro com `ApiErrorResponseSchema` |

### 🔄 Testes E2E & Regras de Negócio (`tests/e2e/`)
| ID | Cenário | Objetivo |
|---|---|---|
| **TC-AUTH01** | Autenticação Válida | Login com credenciais válidas e recebimento de token Bearer |
| **TC-AUTH02** | Senha Inválida | Tentativa de login com senha incorreta e validação de status 401 |
| **TC-AUTH03** | Usuário Não Cadastrado | Validação de retorno 401 para credenciais inexistentes |
| **TC-AUTH04** | Proteção de Recursos | Acesso a endpoint protegido (`/produtos`) com e sem token de autenticação |
| **TC-USER01** | Ciclo de Vida CRUD | Create ➡️ Read (ID e filtro) ➡️ Update ➡️ Delete ➡️ Confirmação 400 |
| **TC-USER02** | Email Duplicado | Impede criação de usuário com e-mail já existente |
| **TC-USER03** | Upsert no PUT | Validação de criação automática quando ID não existe no PUT |
| **TC-USER04** | Delete Inexistente | Validação do status 200 e mensagem informativa ao deletar ID inexistente |
| **TC-USER05** | Campos Obrigatórios | Validação de erro 400 ao omitir campo obrigatório (e-mail) |

---

## 🛠️ Tecnologias Utilizadas

- **Runtime:** Node.js (>= 18)
- **Linguagem:** TypeScript
- **Test Runner & HTTP Client:** `@playwright/test`
- **Validação de Schema:** `zod`
- **Massa de Dados Dinâmica:** `@faker-js/faker`
- **Configuração de Ambiente:** `dotenv`

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos
- Node.js instalado (v18 ou superior)
- Gerenciador de pacotes `npm`

### 2. Instalação das Dependências
Navegue até a pasta do projeto e execute:
```bash
cd 01-api-playwright
npm install
```

### 3. Execução dos Testes

- **Executar todos os testes:**
  ```bash
  npm test
  ```

- **Executar apenas testes de contrato:**
  ```bash
  npm run test:contract
  ```

- **Executar apenas testes E2E:**
  ```bash
  npm run test:e2e
  ```

- **Visualizar relatório HTML gerado pelo Playwright:**
  ```bash
  npm run test:report
  ```

---

## 📊 Relatórios de Execução
O Playwright gera relatórios detalhados com rastreamento completo de requisições, status codes, cabeçalhos e payloads. O relatório pode ser gerado e visualizado em modo interativo através do comando `npm run test:report`.
