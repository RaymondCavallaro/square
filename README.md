# Língua

- Versão em Portugues (esta)
- English version: [README.en.md](README.en.md)

# The Square

Teste conceitual de um pequeno sistema web orientado a eventos, inspirado pelas ideias sociais e economicas por tras do pano de fundo da webnovel [Taking Ground](https://www.wattpad.com/story/410067124-taking-ground).

Este mini sistema mantem regras e interface separadas. A camada de sistema gerencia declaracoes, intencoes, peso e planejamento. A interface apenas emite eventos e renderiza estado.

Feito em grande parte com IA.

## O que é

Este repositorio e um prototipo aberto para explorar um ciclo simples:

- pessoas declaram o que querem
- elas comprometem peso para mostrar prioridade
- outras pessoas escolhem declaracoes para resolver
- o trabalho concluido transfere peso de volta para o sistema
- o peso ganho pode ajudar a limpar as proprias prioridades de quem resolveu

Ele e intencionalmente pequeno e browser-first.

## Prototipo atual

A versao atual e um app de navegador simples com:

- separacao entre interface e logica de sistema
- comunicacao orientada a eventos por meio de um pequeno event bus
- declaracoes
- comprometimento de peso
- intencoes de resolucao
- ordenacao de plano de aquisicao
- log local de atividade
- persistencia em `localStorage`

## Estrutura do Projeto

- `index.html` e a entrada da aplicacao no navegador
- `styles/` contem os arquivos CSS
- `lib/core/` contem infraestrutura compartilhada, como o event bus
- `lib/system/` contem estado, seletores, acoes e regras
- `lib/ui/` contem renderizacao e controladores de DOM
- `app/` contem a inicializacao da aplicacao

## Estado atual

Isto e um teste conceitual, nao um produto finalizado.

O objetivo agora e manter a arquitetura facil de mudar enquanto o conceito fica mais claro.

## Notas

- Este repositorio e publico e voltado para experimentacao.
- O link da webnovel acima e o pano de fundo narrativo que motivou o trabalho conceitual.
- A implementacao atual usa apenas usuarios simulados e dados locais no navegador.
