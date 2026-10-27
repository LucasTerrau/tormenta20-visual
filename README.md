# Tormenta20 — Visual

Repaginada leve do sistema **Tormenta20** para o Foundry VTT v14: mesmas fichas e dados, mais fáceis de ler, com a interface do Foundry mais enxuta. Funciona sozinho ou junto com o **Tormenta20 — Correções de Regras**.

**Requer:** libWrapper.


## Instalação

Requer **Foundry VTT v14** e o sistema **Tormenta20 1.6.5**. No Foundry: *Módulos de Complemento → Instalar Módulo*, cole o link abaixo em **URL do Manifesto** e clique em Instalar.

```
https://github.com/LucasTerrau/tormenta20-visual/releases/latest/download/module.json
```

## Configurações

Em *Configurações → Configurar Módulos → Tormenta20 — Visual*:

| Opção | Quem escolhe | O que faz |
|---|---|---|
| Visual | cada jogador | Pergaminho e vermelho (padrão), escuro e vermelho, ou o original do sistema. Troca na hora. |
| Recolher a descrição nos cartões com rolagem | cada jogador | Ataques e magias mostram primeiro o resultado; a descrição abre no botão "Descrição". |
| Mostrar acertou ou errou no cartão de ataque | mestre | Guarda os alvos marcados na hora do ataque e mostra "Acertou/Errou/Crítico" contra a Defesa de cada um (20 natural sempre acerta, 1 natural sempre erra; crítico pela margem da arma). Só em ataques (teste de perícia não conta); o número da Defesa só o mestre vê. |
| Botões das janelas num menu | cada jogador | Nas fichas ficam à vista fechar, configurar a ficha do T20 e Fabricar; os outros botões vão para o menu ⋮ (quando sobram dois ou mais). |
| Esconder dos jogadores as ferramentas de cena do mestre | mestre | Desenhos, notas, tiles, sons, luzes, paredes e regiões somem para os jogadores. |
| Abas escondidas da barra lateral | mestre | Escolhe as abas que os jogadores não veem. Padrão: objetos da cena, tokens, tiles, desenhos, paredes, luzes, sons, regiões, notas, cartas e playlists. |
| Esconder as abas também para o mestre | mestre (para si) | Aplica a mesma lista ao mestre. |
| Recolher a barra de macros e a lista de jogadores | cada jogador | As duas ficam apagadas e aparecem ao passar o mouse. |
| Ícones do sistema nos compêndios | mestre | Troca os ícones genéricos do Foundry (e as entradas sem imagem) pelos ícones do sistema. Imagens escolhidas à mão ficam. |

## O que muda

- **Ficha do personagem:** cabeçalho em vermelho, nome em destaque, atributos, PV, PM e Defesa grandes, barras de PV e PM (com os temporários), condições ativas logo abaixo do cabeçalho, perícias treinadas em destaque e as não treinadas esmaecidas, listas sem as listras cinzas.
- **NPC:** a aba de estatísticas do sistema no formato do livro (nome e ND em vermelho, rótulos em negrito).
- **Chat:** cartões em pergaminho, título em vermelho, total de ataque e de dano grandes, faixa de acertou ou errou.
- **Fontes:** Eczar (títulos e números) e Gelasio (texto), de licença aberta (veja `fonts/LEIA-ME.txt`).

## Imagens

`scripts/imagens-dados.mjs` troca, em memória, a imagem de **622 entradas** dos compêndios que estavam sem imagem, com ícone genérico do Foundry (`icons/…`) ou com a imagem padrão de ator do sistema (`orc-head.svg`) por um ícone do próprio sistema Tormenta20: variantes de classe com o ícone da classe base, origens e poderes com os ícones de categoria, habilidades de criatura com o ícone de mesmo nome, armas e objetos por palavra-chave. Vale no compêndio, nas miniaturas e nas cópias importadas para o mundo. Imagens escolhidas à mão e imagens externas ficam como estão.

## Aviso

Projeto de fã, sem vínculo com a Jambô Editora nem com os autores do sistema Tormenta20 para Foundry. Tormenta20 é marca e propriedade da Jambô Editora. Este pacote não traz ilustrações nem texto dos livros.

Código sob licença MIT (arquivo `LICENSE`).
