# 📖 Manual Descomplicado: Testes de API com Playwright

> **Para quem é este manual?**  
> Este documento foi escrito para qualquer pessoa, mesmo que nunca tenha visto uma linha de código na vida. Se você é curioso, recrutador de RH, gestor ou iniciante na área de tecnologia, este guia vai te explicar exatamente o que este projeto faz usando exemplos do dia a dia!

---

## 🍽️ A Analogia do Restaurante: O que é uma API?

Imagine que você foi a um restaurante:

```text
  [ VOCÊ / CLIENTE ]                [ O GARÇOM ]              [ A COZINHA ]
(Celular ou Computador)  =======>     ( A API )    =======> (Banco de Dados / Servidor)
       "Quero um x-salada!"       Leva o pedido                 Prepara o lanche
                                Traz o prato pronto
```

1. **Você** senta na mesa e olha o cardápio.
2. **A Cozinha** é onde os ingredientes e cozinheiros ficam guardados. Você não entra lá dentro para fritar o hambúrguer.
3. **O Garçom** é a **API**: você diz para ele o que quer, ele leva a mensagem até a cozinha, e volta trazendo a comida para você.

👉 **O que este projeto faz?**  
Ele cria um **"crítico gastronômico robô"**. Esse robô chama o garçom centenas de vezes por minuto, faz pedidos de diferentes pratos e confere se a comida veio certa, quentinha, sem faltar nenhum ingrediente e no tempo combinado!

---

## 🗺️ Mapa do Projeto: O que faz cada pasta e arquivo?

Aqui está a organização do projeto explicada de forma simples:

```text
01-api-playwright/
├── src/
│   ├── config/env.ts             ➡️ "O Caderno de Endereços"
│   ├── controllers/              ➡️ "Os Garçons Especialistas"
│   ├── schemas/                  ➡️ "A Balança e a Fita Métrica (Regras)"
│   ├── fixtures/user.factory.ts  ➡️ "A Fábrica de Clientes Fictícios"
│   └── utils/                    ➡️ "A Caixa de Ferramentas"
├── tests/
│   ├── contract/                 ➡️ "O Teste do Papel e Caneta (Contrato)"
│   └── e2e/                      ➡️ "A Jornada Completa do Cliente"
├── playwright.config.ts          ➡️ "O Manual de Instruções do Robô"
└── package.json                  ➡️ "A Lista de Compras do Projeto"
```

---

## 🔍 Entendendo os Arquivos em Detalhes

### 1. `src/config/env.ts` — O Caderno de Endereços
Imagine que o garçom precisa saber em qual filial do restaurante ele vai trabalhar. Este arquivo guarda o endereço da internet (ex: `https://serverest.dev`). Se amanhã o restaurante mudar de endereço, a gente só altera uma linha aqui, e todo o resto continua funcionando!

---

### 2. `src/controllers/` — Os Garçons Especialistas
Em vez de ter um robô bagunçado que faz tudo de qualquer jeito, separamos garçons especializados para cada setor:

- **`auth.controller.ts` (O Porteiro / Segurança):**  
  É quem cuida da entrada. Ele confere se seu e-mail e senha estão certos. Se estiverem, ele te entrega uma **pulseirinha VIP** (chamada no mundo técnico de *Token de Autorização*).
- **`users.controller.ts` (O Atendente do Balcão de Cadastros):**  
  Sabe como cadastrar um cliente novo, como listar todos os clientes, alterar o nome de alguém ou cancelar um cadastro.
- **`products.controller.ts` (O Estoquista da Loja):**  
  Mostra quais produtos estão à venda e só deixa cadastrar produtos novos se a pessoa mostrar a pulseirinha VIP dada pelo segurança!

---

### 3. `src/schemas/` — A Balança e a Fita Métrica (Zod)
Imagine que você comprou uma caixa de leite no mercado. Na embalagem diz que tem líquido dentro. Se você abrir e tiver areia, tem algo muito errado!

No computador é a mesma coisa:
- Quando o robô pede a lista de clientes, **o Zod confere se os dados chegaram no formato certo**:
  - O nome é um texto? ✅
  - O e-mail tem o símbolo `@`? ✅
  - O preço é um número e não uma palavra? ✅

Se o servidor responder alguma coisa torta ou esquecer um campo obrigatório, o Zod imediatamente acende uma luz vermelha e avisa que o sistema quebrou a promessa!

---

### 4. `src/fixtures/user.factory.ts` — A Fábrica de Pessoas Fictícias
Para testar se um cadastro funciona, precisamos de um e-mail novo toda vez. Se usarmos sempre `joao@gmail.com`, na segunda tentativa o sistema vai dizer: *"Ops! Esse e-mail já existe"*.

A **UserFactory** é como um gerador de identidades de mentira: a cada segundo ela inventa um nome novo (ex: *Carlos Silva 9821*) e um e-mail único que nunca foi usado antes. Assim os testes nunca dão erro de repetição!

---

### 5. `tests/contract/` — O Teste do Contrato
Aqui o robô só quer saber de uma coisa: **o formato da resposta**.  
Ele não está preocupado se o cliente comprou muito ou pouco. Ele só confere se a resposta do servidor veio com todos os campos combinados, respeitando a receita do bolo.

---

### 6. `tests/e2e/` — A Jornada Completa (Ponta a Ponta)
Aqui o robô vive uma história da vida real:
1. **Cria um novo cliente.**
2. **Faz login com a senha que acabou de inventar.**
3. **Recebe o crachá VIP.**
4. **Cadastra um produto na loja usando o crachá.**
5. **Apaga a própria conta** para deixar o banco de dados limpo para os próximos testes.

---

## 🚦 O que significa quando o teste passa ou falha?

- 🟢 **VERDE (Passed):** O robô fez todas as ações, o garçom respondeu rápido, a comida veio certinha e tudo funcionou perfeitamente.
- 🔴 **VERMELHO (Failed):** Alguma coisa quebrou no caminho (o garçom demorou demais, a senha válida foi recusada ou o servidor caiu). O robô tira uma "foto" do erro e avisa no relatório!
