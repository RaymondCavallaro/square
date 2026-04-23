# Língua

- Versão em Portugues (esta)
- English version: [README.en.md](README.en.md)

# The Square

Prototipo inicial de coordenacao por claims em um pequeno sistema web orientado a eventos, inspirado pelas ideias sociais e economicas por tras do pano de fundo da webnovel [Taking Ground](https://www.wattpad.com/story/410067124-taking-ground).

Esta fase ainda usa a linguagem de declaracoes, intencoes e plano de aquisicao, mas o repositorio agora trata esses elementos como a primeira forma reduzida de um sistema orientado a claims, peso exposto, resolucao estruturada e memoria progressiva.

O mini sistema mantem regras e interface separadas. A camada de sistema gerencia o estado das claims iniciais, das propostas de resolucao, do peso comprometido e do rastro inicial de memoria. A interface apenas emite eventos e renderiza estado.

Feito em grande parte com IA.

## O que é

Este repositorio e um prototipo aberto para explorar um ciclo simples de coordenacao:

- pessoas formulam claims iniciais na forma atual de declaracoes
- elas expõem prioridade ao comprometer peso
- outras pessoas apresentam propostas de resolucao
- o trabalho concluido transfere peso de volta para o sistema
- o peso ganho pode ajudar a limpar as proprias claims iniciais de quem resolveu

Ele e intencionalmente pequeno e browser-first.

## Vocabulário de migracao

Durante a Fase 1, o projeto usa o seguinte mapeamento para aproximar o prototipo atual da orientacao futura:

- declaracao -> claim inicial
- intencao de resolucao -> proposta de resolucao
- peso comprometido -> compromisso exposto
- log de atividade -> rastro inicial de memoria

Isso nao significa renomear tudo de uma vez.
Significa explicar que a implementacao atual e uma forma reduzida, ainda simplificada, do modelo maior.

## Prototipo atual

A versao atual e um app de navegador simples com:

- separacao entre interface e logica de sistema
- comunicacao orientada a eventos por meio de um pequeno event bus
- claims iniciais representadas como declaracoes
- comprometimento visivel de peso
- propostas de resolucao ainda tratadas no codigo como intencoes
- ordenacao de plano de aquisicao
- rastro local de memoria inicial
- persistencia em `localStorage`

## Orientacao desta fase

O objetivo desta fase nao e copiar `tg` literalmente.

O objetivo e deixar claro que o Square atual ja aponta para:

- claims como unidade principal
- compromisso visivel por meio de peso
- resolucao mais estruturada do que uma lista solta de tarefas
- memoria progressiva em vez de mero historico plano

O codigo ainda esta num estagio anterior a isso, mas o repositorio agora documenta essa direcao explicitamente.

## Estrutura do Projeto

- `index.html` e a entrada da aplicacao no navegador
- `styles/` contem os arquivos CSS
- `lib/core/` contem infraestrutura compartilhada, como o event bus
- `lib/system/` contem estado, seletores, acoes e regras
- `lib/ui/` contem renderizacao e controladores de DOM
- `app/` contem a inicializacao da aplicacao

## Estado atual

Isto e um teste conceitual, nao um produto finalizado.

O objetivo agora e manter a arquitetura facil de mudar enquanto o conceito claim-based fica mais claro.

## Notas

- Este repositorio e publico e voltado para experimentacao.
- O link da webnovel acima e o pano de fundo narrativo que motivou o trabalho conceitual.
- A implementacao atual usa apenas usuarios simulados e dados locais no navegador.
