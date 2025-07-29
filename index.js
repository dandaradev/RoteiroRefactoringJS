const { readFileSync } = require('fs');

function calcularTotalApresentacao(apre, peca) {
    let total = 0;
    switch (peca.tipo) {
        case "tragedia":
            total = 40000;
            if (apre.audiencia > 30) {
                total += 1000 * (apre.audiencia - 30);
            }
            break;
        case "comedia":
            total = 30000;
            if (apre.audiencia > 20) {
                total += 10000 + 500 * (apre.audiencia - 20);
            }
            total += 300 * apre.audiencia;
            break;
        default:
            throw new Error(`Peça desconhecida: ${peca.tipo}`);
    }
    return total;
}

function getPeca(apre, pecas) {
    return pecas[apre.id];
}

function calcularCredito(apre, peca) {
    let creditos = Math.max(apre.audiencia - 30, 0);
    if (peca.tipo === "comedia") 
        creditos += Math.floor(apre.audiencia / 5);
    return creditos;
}

function formatarMoeda(valor) {
    const formato = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format;
    return formato(valor / 100);
}

function gerarFaturaStr(fatura, pecas) {
    let totalFatura = 0;
    let creditos = 0;
    let faturaStr = `Fatura ${fatura.cliente}\n`;

    for (let apre of fatura.apresentacoes) {
        const peca = getPeca(apre, pecas);
        let total = calcularTotalApresentacao(apre, peca);

        // créditos para próximas contratações
        creditos += calcularCredito(apre, peca);

        // mais uma linha da fatura
        faturaStr += `  ${peca.nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
        totalFatura += total;
    }

    faturaStr += `Valor total: ${formatarMoeda(totalFatura)}\n`;
    faturaStr += `Créditos acumulados: ${creditos} \n`;
    return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
