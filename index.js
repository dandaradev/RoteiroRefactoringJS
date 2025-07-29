const { readFileSync } = require('fs');

// Classe Repositorio para acessar as peças
class Repositorio {
    constructor() {
        this.pecas = JSON.parse(readFileSync('./pecas.json'));
    }

    getPeca(apre) {
        return this.pecas[apre.id];
    }
}

// Classe de serviço para cálculos
class ServicoCalculoFatura {
    constructor(repo) {
        this.repo = repo;
    }

    calcularTotalApresentacao(apre) {
        const peca = this.repo.getPeca(apre);
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

    calcularCredito(apre) {
        const peca = this.repo.getPeca(apre);
        let creditos = Math.max(apre.audiencia - 30, 0);
        if (peca.tipo === "comedia") 
            creditos += Math.floor(apre.audiencia / 5);
        return creditos;
    }

    formatarMoeda(valor) {
        const formato = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format;
        return formato(valor / 100);
    }
}

// Função que gera a fatura
function gerarFaturaStr(fatura, servico) {
    let totalFatura = 0;
    let creditos = 0;
    let faturaStr = `Fatura ${fatura.cliente}\n`;

    for (let apre of fatura.apresentacoes) {
        // Agora obtemos a peça através do repositório do serviço
        const total = servico.calcularTotalApresentacao(apre);

        // Créditos para próximas contratações
        creditos += servico.calcularCredito(apre);

        // Mais uma linha da fatura
        const peca = servico.repo.getPeca(apre); // Aqui pegamos a peça de novo para exibir o nome
        faturaStr += `  ${peca.nome}: ${servico.formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
        totalFatura += total;
    }

    faturaStr += `Valor total: ${servico.formatarMoeda(totalFatura)}\n`;
    faturaStr += `Créditos acumulados: ${creditos} \n`;
    return faturaStr;
}

// Carregar as faturas e peças
const faturas = JSON.parse(readFileSync('./faturas.json'));
const repositorio = new Repositorio();
const servico = new ServicoCalculoFatura(repositorio);

const faturaStr = gerarFaturaStr(faturas, servico);
console.log(faturaStr);
