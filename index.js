const { readFileSync } = require('fs');
const Repositorio = require('./repositorio');
const ServicoCalculoFatura = require('./servico');
const gerarFaturaStr = require('./apresentacao');

// Carregar as faturas e peças
const faturas = JSON.parse(readFileSync('./faturas.json'));
const repositorio = new Repositorio();
const servico = new ServicoCalculoFatura(repositorio);

// Gerar a fatura
const faturaStr = gerarFaturaStr(faturas, servico);
console.log(faturaStr);
