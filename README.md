# 🧮 Calculadora Web | Histórico Persistente em JSON

Aplicação desktop para web com foco em usabilidade, precisão matemática e **persistência de dados**. O diferencial técnico do projeto é o gerenciamento de histórico de operações passadas utilizando **JSON** e `localStorage`.

---

## Diferenciais Técnicos

| Recurso | Implementação Técnica | Impacto na UX |
| :--- | :--- | :--- |
| **Persistência em JSON** | Estruturação de dados via `JSON.stringify` e `JSON.parse` integrados ao `localStorage`. | Mantém até 50 cálculos salvos mesmo após fechar o navegador. |
| **Reutilização de Dados** | Mapeamento de eventos na lista DOM do histórico para resgate de valores. | Permite clicar em qualquer cálculo passado e enviar o resultado direto ao visor. |
| **Aritmética Segura** | Substituição do `eval()` por máquina de estados e correção de ponto flutuante via `Math.pow`. | Impede execuções maliciosas e corrige dízimas incorretas da IEEE 754. |
| **Acessibilidade (ARIA)** | Atributos `aria-expanded`, `aria-label` e navegação por foco ativo. | Permite uso fluido via leitores de tela e suporte total ao teclado físico. |

---

## Funcionalidades

- **Operações Padrão:** Soma, subtração, multiplicação, divisão, porcentagem (`%`) e inversão de sinal (`±`).
- **Painel Lateral Retrátil:** Interface animada via CSS3 (`0.2s ease`) para exibição do histórico.
- **Atalhos do Teclado:** Suporte global (`keydown`) para números, operadores, `Enter`, `Backspace` e `Escape`.
- **Tratamento de Exceções:** Mensagem visual para erros como divisão por zero sem quebrar a aplicação.

---

## Tecnologias Utilizadas

* **HTML5:** Estruturação semântica e acessibilidade.
* **CSS3:** Flexbox, temas escuros contrastantes e transições visuais.
* **JavaScript (ES6+):** Lógica funcional, manipulação de DOM e eventos.
* **JSON:** Formatação leve para persistência do histórico.

---

## 📦 Como Executar

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/joao-lucas-c/calculadora-Web.git](https://github.com/joao-lucas-c/calculadora-Web.git)
