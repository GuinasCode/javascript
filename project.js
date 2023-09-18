// 1. Depositar dinheiro
// 2. Determinar número de linhas a ser apostada
// 3. Obter a quantia apostada
// 4. Rodar o caça níquel
// 5. Verificar se ganhou
// 6. Promover o pagamento dos ganhos // erdas
// 7. Jogar denovo ou pedir + depósito

const prompt = require("prompt-sync") ();

const LINHAS = 3;
const COLUNAS = 3;

const CONTAGEM_SIMBOLOS = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
}

const VALOR_SIMBOLOS = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}

const deposito = () => {
    while(true) { 
        const valorDeposito = prompt("Insira o valor do depósito: ");
        const valorDepositoToNumber = parseFloat(valorDeposito);

        if(isNaN(valorDepositoToNumber) || valorDepositoToNumber <= 0) {
            console.log("Valor inválido, tente novamente.");
        } else {
            return valorDepositoToNumber;
        }
    }
};

const linhasAposta = () => {
    while(true) { 
        const linhas = prompt("Insira o numero de linhas da sua aposta (1-3): ");
        const numeroLinhas = parseFloat(linhas);

        if(isNaN(numeroLinhas) || numeroLinhas <= 0 || numeroLinhas > 3) {
            console.log("Valor inválido de aposta, tente novamente.");
        } else {
            return numeroLinhas;
        }
    }
}

const getAposta = (saldo, linhas) => {
    while(true) { 
        const bet = prompt("Insira o valor da sua aposta, baseado nas linhas escolhidas: ");
        const numeroBet = parseFloat(bet);

        if(isNaN(numeroBet) || numeroBet <= 0 || numeroBet > saldo / linhas) {
            console.log("Valor de aposta inválido.");
        } else {
            return numeroBet;
        }
    }    
}

const rolada = () => {
    const simbolos = [];
    for (const [simbolo, contagem] of Object.entries(CONTAGEM_SIMBOLOS)) {
        for(let i = 0; i < contagem; i++) {
            simbolos.push(simbolo);
        }
    }
    
    const rodas = [];
    for (let i = 0;  i < COLUNAS; i++) {
        rodas.push([]);
        const simbolosRoda = [...simbolos];
        for (let j = 0; j < LINHAS; j++) {
            const indiceRandomico = Math.floor(Math.random() * simbolosRoda.length);
            const simbolosSelecionados = simbolosRoda[indiceRandomico];
            rodas[i].push(simbolosSelecionados)
            simbolosRoda.splice(indiceRandomico, 1);
        }
    }
    return rodas;
};

const transposicao = (rodas) => {
    const linhas = [];
    for (let i = 0; i < LINHAS; i++) {
        linhas.push([]);
        for (let j = 0; j < COLUNAS; j++){
            linhas[i].push(rodas[j][i])
        }
    }
    return linhas;
}

const printLinhas = (linhas) => {
    for (const linha of linhas) {
        let linhaString = "";
        for (const [i, simbolo] of linha.entries()){
            linhaString += simbolo
            if (i != linha.length - 1) {
                linhaString += " | "
            }
        }
        console.log(linhaString);
    }
};

const verificarVitoria = (linhas, bet, numeroLinhas) => {
    let ganhos = 0;

    for (let linha = 0; linha < numeroLinhas; linha++) {
        const simbolos = linhas[linha];
        let todosIguais = true;

        for (const simbolo of simbolos) {
            if (simbolo != simbolos[0]) {
                todosIguais = false;
                break;
            }
        }

        if (todosIguais) {
            ganhos += bet * VALOR_SIMBOLOS[simbolos[0]];
        }
    }

    return ganhos;
};

const solicitarDeposito = () => {
    let novoDeposito = 0;
    while (true) {
        console.log("Seu saldo acabou ou é insuficiente. Você precisa fazer um novo depósito.");
        const valorDeposito = deposito();

        if (valorDeposito > 0) {
            novoDeposito = valorDeposito;
            break;
        } else {
            console.log("O valor do depósito precisa ser maior que zero.");
        }
    }
    return novoDeposito;
};

const jogo = () => {
    let saldo = deposito();

    while (true) {
        console.log("Você possui o saldo de R$ " + saldo);

        const numeroLinhas = linhasAposta();
        const bet = getAposta(saldo, numeroLinhas);
        
        if (bet * numeroLinhas > saldo) {
            saldo = solicitarDeposito();
            continue; 
        }

        saldo -= bet * numeroLinhas;

        const rodas = rolada();
        const linhas = transposicao(rodas);
        printLinhas(linhas);

        const ganhos = verificarVitoria(linhas, bet, numeroLinhas);
        saldo += ganhos;

        console.log("Você ganhou, R$" + ganhos.toString());

        if (saldo <= 0) {
            console.log("Você não tem saldo suficiente!");
            saldo = solicitarDeposito(); 
        }

        const jogarNovamente = prompt("Você quer jogar novamente (y/n)? ");
        if (jogarNovamente.toLowerCase() !== "y") break;
    }
};

jogo()

