let valorAtual = "";
let valorAnterior = "";
let operacao = null;
let resetarVisor = false;

let historico = [];

const CASAS_DECIMAIS_MAX = 10;
const CHAVE_HISTORICO = "historico-calculos";
const LIMITE_HISTORICO = 50;

// VISOR E DESTAQUE
function atualizarVisor(valor) {
    const visor = document.getElementById("visor");
    if (visor) {
        visor.value = valor === "" || valor === undefined ? "0" : valor;
    }
}

function atualizarDestaqueOperador() {
    document.querySelectorAll(".btn-operador").forEach(function (botao) {
        botao.classList.toggle(
            "ativo",
            operacao !== null && botao.dataset.op === operacao
        );
    });
}

function arredondar(numero) {
    const fator = Math.pow(10, CASAS_DECIMAIS_MAX);
    return Math.round(numero * fator) / fator;
}

function simboloExibicao(op) {
    switch (op) {
        case "*":
            return "×";
        case "/":
            return "/";
        default:
            return op;
    }
}

// HISTÓRICO (localStorage)
function carregarHistorico() {
    try {
        const dadosArmazenados = localStorage.getItem(CHAVE_HISTORICO);
        historico = dadosArmazenados ? JSON.parse(dadosArmazenados) : [];
    } catch (erro) {
        historico = [];
    }
    renderizarHistorico();
}

function salvarHistorico() {
    try {
        localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
    } catch (erro) {
        console.error("Não foi possível salvar o histórico:", erro);
    }
}

function adicionarAoHistorico(expressao, resultado) {
    historico.unshift({ expressao: expressao, resultado: resultado });

    if (historico.length > LIMITE_HISTORICO) {
        historico = historico.slice(0, LIMITE_HISTORICO);
    }

    renderizarHistorico();
    salvarHistorico();
}

function renderizarHistorico() {
    const lista = document.getElementById("listaHistorico");
    if (!lista) return;

    lista.innerHTML = "";

    if (historico.length === 0) {
        const vazio = document.createElement("li");
        vazio.className = "historico-vazio";
        vazio.textContent = "Nenhum cálculo ainda";
        lista.appendChild(vazio);
        return;
    }

    historico.forEach(function (item, indice) {
        const li = document.createElement("li");
        li.setAttribute("tabindex", "0");
        li.setAttribute(
            "aria-label",
            "Reutilizar resultado " + item.resultado
        );

        li.onclick = function () {
            reutilizarResultado(indice);
        };

        const expressaoSpan = document.createElement("span");
        expressaoSpan.className = "expressao";
        expressaoSpan.textContent = item.expressao + " =";

        const resultadoSpan = document.createElement("span");
        resultadoSpan.className = "resultado";
        resultadoSpan.textContent = item.resultado;

        li.appendChild(expressaoSpan);
        li.appendChild(resultadoSpan);
        lista.appendChild(li);
    });
}

function reutilizarResultado(indice) {
    valorAtual = historico[indice].resultado;
    valorAnterior = "";
    operacao = null;
    resetarVisor = false;

    atualizarVisor(valorAtual);
    atualizarDestaqueOperador();
}

function limparHistorico() {
    historico = [];
    renderizarHistorico();
    salvarHistorico();
}

function alternarHistorico() {
    const painel = document.getElementById("painelHistorico");
    const botao = document.getElementById("botaoHistorico");
    if (!painel || !botao) return;

    const abrindo = !painel.classList.contains("aberto");

    painel.classList.toggle("aberto");
    botao.classList.toggle("ativo", abrindo);
    botao.setAttribute("aria-expanded", abrindo.toString());
}

// LÓGICA DA CALCULADORA
function executarOperacaoPendente() {
    const resultado = calcular(
        parseFloat(valorAnterior),
        parseFloat(valorAtual),
        operacao
    );

    if (resultado === "Erro") {
        atualizarVisor("Erro");
        valorAtual = "";
        valorAnterior = "";
        operacao = null;
        resetarVisor = true;
        atualizarDestaqueOperador();
        return true;
    }

    valorAtual = resultado.toString();
    valorAnterior = "";
    return false;
}

function processarClique(caractere) {
    if (!isNaN(caractere) || caractere === ".") {
        if (resetarVisor) {
            valorAtual = "";
            resetarVisor = false;
        }

        if (caractere === "." && valorAtual.includes(".")) return;
        if (caractere === "0" && valorAtual === "0") return;

        valorAtual += caractere;
        atualizarVisor(valorAtual);
    } else if (caractere === "C") {
        valorAtual = "";
        valorAnterior = "";
        operacao = null;
        resetarVisor = false;
        atualizarVisor("");
        atualizarDestaqueOperador();
    } else if (caractere === "DEL") {
        if (resetarVisor) return;
        valorAtual = valorAtual.slice(0, -1);
        atualizarVisor(valorAtual);
    } else if (caractere === "±") {
        if (valorAtual === "") return;
        valorAtual = valorAtual.startsWith("-")
            ? valorAtual.slice(1)
            : "-" + valorAtual;
        atualizarVisor(valorAtual);
    } else if (caractere === "%") {
        if (valorAtual === "") return;
        valorAtual = arredondar(parseFloat(valorAtual) / 100).toString();
        atualizarVisor(valorAtual);
    } else if (caractere === "=") {
        if (operacao && valorAnterior !== "" && valorAtual !== "") {
            const expressao =
                valorAnterior +
                " " +
                simboloExibicao(operacao) +
                " " +
                valorAtual;

            const houveErro = executarOperacaoPendente();
            if (houveErro) return;

            atualizarVisor(valorAtual);
            adicionarAoHistorico(expressao, valorAtual);
            operacao = null;
            resetarVisor = true;
            atualizarDestaqueOperador();
        }
    } else {
        if (valorAtual === "") return;

        if (valorAnterior !== "") {
            const houveErro = executarOperacaoPendente();
            if (houveErro) return;
        } else {
            valorAnterior = valorAtual;
        }

        operacao = caractere;
        resetarVisor = true;
        atualizarDestaqueOperador();
    }
}

function calcular(a, b, op) {
    switch (op) {
        case "+":
            return arredondar(a + b);
        case "-":
            return arredondar(a - b);
        case "*":
            return arredondar(a * b);
        case "/":
            return b === 0 ? "Erro" : arredondar(a / b);
        default:
            return b;
    }
}

// SUPORTE AO TECLADO
document.addEventListener("keydown", function (evento) {
    const tecla = evento.key;

    if (tecla >= "0" && tecla <= "9") {
        processarClique(tecla);
    } else if (tecla === ".") {
        processarClique(".");
    } else if (tecla === "+") {
        processarClique("+");
    } else if (tecla === "-") {
        processarClique("-");
    } else if (tecla === "*") {
        processarClique("*");
    } else if (tecla === "/") {
        evento.preventDefault();
        processarClique("/");
    } else if (tecla === "%") {
        processarClique("%");
    } else if (tecla === "Enter" || tecla === "=") {
        processarClique("=");
    } else if (tecla === "Backspace") {
        processarClique("DEL");
    } else if (tecla === "Escape") {
        processarClique("C");
    }
});

// INICIALIZAÇÃO IMEDIATA
carregarHistorico();