module.exports = function gerarFaturaStr(fatura, servico) {
    let totalFatura = 0;
    let creditos = 0;
    let faturaStr = `Fatura ${fatura.cliente}\n`;

    for (let apre of fatura.apresentacoes) {
        const total = servico.calcularTotalApresentacao(apre);

        creditos += servico.calcularCredito(apre);

        const peca = servico.repo.getPeca(apre);
        faturaStr += `  ${peca.nome}: ${servico.formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
        totalFatura += total;
    }

    faturaStr += `Valor total: ${servico.formatarMoeda(totalFatura)}\n`;
    faturaStr += `Créditos acumulados: ${creditos} \n`;
    return faturaStr;
};
