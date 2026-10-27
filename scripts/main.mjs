/**
 * Tormenta20 — Visual: repaginada leve, com cada parte numa chave das configurações.
 * - Tema (por jogador): original do sistema, pergaminho e vermelho, ou escuro e vermelho.
 * - Fichas: barras de PV e PM, condições à vista, perícias treinadas em destaque; NPC com o bloco do livro.
 * - Chat: descrição recolhida nos cartões com rolagem; acertou/errou contra a Defesa dos alvos marcados.
 * - Interface: botões extras das janelas num menu "⋮", abas da barra lateral escondidas, ferramentas de
 *   cena que os jogadores não usam, barra de macros e lista de jogadores recolhidas.
 * - Imagens: ícones do sistema no lugar dos ícones genéricos dos compêndios.
 */
import { aplicarImagens } from "./imagens.mjs";

export const ID = "tormenta20-visual";

const ABAS = {
	chat: "Chat",
	combat: "Combate",
	scenes: "Cenas",
	placeables: "Objetos da cena",
	actors: "Atores",
	items: "Itens",
	journal: "Diário",
	tables: "Tabelas",
	cards: "Cartas",
	macros: "Macros",
	playlists: "Playlists",
	compendium: "Compêndios",
	settings: "Configurações",
	tokens: "Tokens",
	tiles: "Tiles",
	drawings: "Desenhos",
	walls: "Paredes",
	lighting: "Luzes",
	sounds: "Sons",
	regions: "Regiões",
	notes: "Notas"
};
const ABAS_PADRAO = ["placeables", "tokens", "tiles", "drawings", "walls", "lighting", "sounds", "regions", "notes", "cards", "playlists"];
// Grupos de ferramentas de cena que o jogador nunca usa (o Foundry já tranca a maioria por permissão).
const FERRAMENTAS_DO_MESTRE = ["drawings", "notes", "tiles", "sounds", "lighting", "walls", "regions"];

const opcao = (chave) => game.settings.get(ID, chave);

/* -------------------------------------------- tema e classes */

function aplicarClasses() {
	const corpo = document.body;
	for (const c of [...corpo.classList]) if (c.startsWith("t20v-")) corpo.classList.remove(c);
	const tema = opcao("tema");
	if (tema !== "original") corpo.classList.add("t20v-ativo", `t20v-tema-${tema}`);
	if (opcao("recolherBarras")) corpo.classList.add("t20v-barras");
	// Abas escondidas: para jogadores; para o mestre, só se ele pedir.
	let estilo = document.getElementById("t20v-abas");
	if (!estilo) {
		estilo = document.createElement("style");
		estilo.id = "t20v-abas";
		document.head.appendChild(estilo);
	}
	const valeParaMim = !game.user.isGM || opcao("abasParaMestre");
	const lista = valeParaMim ? (opcao("abasEscondidas")?.lista ?? []) : [];
	estilo.textContent = lista.map((aba) => `#sidebar [data-tab="${aba}"][data-action="tab"]{display:none !important}`).join("\n");
}

class AbasMenu extends foundry.applications.api.ApplicationV2 {
	static DEFAULT_OPTIONS = {
		id: "t20v-abas-menu",
		tag: "form",
		window: { title: "Abas escondidas da barra lateral", icon: "fa-solid fa-eye-slash" },
		position: { width: 420 },
		form: { handler: AbasMenu.#salvar, closeOnSubmit: true }
	};

	async _renderHTML() {
		const marcadas = new Set(opcao("abasEscondidas")?.lista ?? []);
		const div = document.createElement("div");
		div.className = "t20v-abas-menu";
		div.innerHTML = `<p class="hint">Marque as abas que os jogadores não veem. O mestre continua vendo todas, a não ser que ligue "Esconder as abas também para o mestre".</p>
			<div class="t20v-abas-grade">${Object.entries(ABAS)
				.map(([k, nome]) => `<label><input type="checkbox" name="${k}" ${marcadas.has(k) ? "checked" : ""}> ${nome}</label>`)
				.join("")}</div>
			<footer class="form-footer"><button type="submit"><i class="fa-solid fa-floppy-disk"></i> Salvar</button></footer>`;
		return div;
	}

	_replaceHTML(resultado, conteudo) {
		conteudo.replaceChildren(resultado);
	}

	static async #salvar(event, form, formData) {
		const lista = Object.entries(formData.object)
			.filter(([, v]) => v)
			.map(([k]) => k);
		await game.settings.set(ID, "abasEscondidas", { lista });
	}
}

function registrarOpcoes() {
	const reaplicar = () => aplicarClasses();
	game.settings.register(ID, "tema", {
		name: "Visual",
		hint: "Cada jogador escolhe o seu. Original deixa o sistema como era.",
		scope: "client",
		config: true,
		type: String,
		choices: { pergaminho: "Pergaminho e vermelho", escuro: "Escuro e vermelho", original: "Original do sistema" },
		default: "pergaminho",
		onChange: reaplicar
	});
	game.settings.register(ID, "recolherDescricao", {
		name: "Recolher a descrição nos cartões com rolagem",
		hint: "Ataques e magias mostram primeiro o resultado; a descrição abre num clique.",
		scope: "client",
		config: true,
		type: Boolean,
		default: true
	});
	game.settings.register(ID, "resultadoAtaque", {
		name: "Mostrar acertou ou errou no cartão de ataque",
		hint: "Compara o ataque com a Defesa dos alvos marcados na hora da rolagem (20 natural sempre acerta, 1 natural sempre erra). Só em ataques; a Defesa do alvo aparece só para o mestre.",
		scope: "world",
		config: true,
		type: Boolean,
		default: true
	});
	game.settings.register(ID, "menuBotoes", {
		name: "Botões das janelas num menu",
		hint: "Nas fichas, ficam à vista só fechar e configurar; o resto vai para o menu ⋮.",
		scope: "client",
		config: true,
		type: Boolean,
		default: true,
		requiresReload: true
	});
	game.settings.register(ID, "ferramentasJogadores", {
		name: "Esconder dos jogadores as ferramentas de cena do mestre",
		hint: "Desenhos, notas, tiles, sons, luzes, paredes e regiões somem da barra de ferramentas dos jogadores.",
		scope: "world",
		config: true,
		type: Boolean,
		default: true,
		requiresReload: true
	});
	game.settings.register(ID, "abasEscondidas", { scope: "world", config: false, type: Object, default: { lista: ABAS_PADRAO }, onChange: reaplicar });
	game.settings.registerMenu(ID, "abasMenu", {
		name: "Abas escondidas da barra lateral",
		label: "Escolher abas",
		hint: "Abas que a mesa não usa (cartas, playlists, objetos da cena…) somem para os jogadores.",
		icon: "fa-solid fa-eye-slash",
		type: AbasMenu,
		restricted: true
	});
	game.settings.register(ID, "abasParaMestre", {
		name: "Esconder as abas também para o mestre",
		scope: "client",
		config: true,
		type: Boolean,
		default: false,
		onChange: reaplicar
	});
	game.settings.register(ID, "recolherBarras", {
		name: "Recolher a barra de macros e a lista de jogadores",
		hint: "As duas aparecem ao passar o mouse.",
		scope: "client",
		config: true,
		type: Boolean,
		default: true,
		onChange: reaplicar
	});
	game.settings.register(ID, "imagens", {
		name: "Ícones do sistema nos compêndios",
		hint: "Troca os ícones genéricos do Foundry (e as entradas sem imagem) pelos ícones do sistema. Imagens escolhidas à mão ficam.",
		scope: "world",
		config: true,
		type: Boolean,
		default: true,
		requiresReload: true
	});
}

/* -------------------------------------------- botões das janelas */

function menuDeBotoes(app) {
	const raiz = app.element?.[0] ?? app.element;
	const cabecalho = raiz?.querySelector?.(":scope > .window-header");
	if (!cabecalho || cabecalho.querySelector(".t20v-mais")) return;
	const ficam = (b) => ["close", "t20-configure-sheet", "t20c-fabricar", "t20c-criar", "t20c-subir"].some((c) => b.classList.contains(c));
	const extras = [...cabecalho.querySelectorAll(":scope > a.header-button")].filter((b) => !ficam(b));
	if (extras.length < 2) return;
	const botao = document.createElement("a");
	botao.className = "header-button control t20v-mais";
	botao.dataset.tooltip = "Mais opções";
	botao.innerHTML = `<i class="fa-solid fa-ellipsis-vertical"></i>`;
	const menu = document.createElement("div");
	menu.className = "t20v-menu";
	for (const b of extras) {
		const rotulo = (b.dataset.tooltip && game.i18n.localize(b.dataset.tooltip)) || b.title || b.textContent.trim() || "Opção";
		if (!b.querySelector(".t20v-rotulo")) b.insertAdjacentHTML("beforeend", `<span class="t20v-rotulo"></span>`);
		b.querySelector(".t20v-rotulo").textContent = rotulo;
		b.addEventListener("click", () => menu.classList.remove("aberto"));
		menu.appendChild(b);
	}
	botao.addEventListener("click", (event) => {
		event.preventDefault();
		event.stopPropagation();
		menu.classList.toggle("aberto");
	});
	document.addEventListener("pointerdown", (event) => {
		if (!menu.contains(event.target) && event.target !== botao && !botao.contains(event.target)) menu.classList.remove("aberto");
	});
	const fechar = cabecalho.querySelector(":scope > a.header-button.close");
	cabecalho.insertBefore(botao, fechar);
	cabecalho.appendChild(menu);
}

/* -------------------------------------------- fichas */

function decorarFicha(app) {
	const raiz = app.element?.[0] ?? app.element;
	const actor = app.actor;
	if (!raiz || !actor) return;
	// Barras de PV e PM.
	for (const [classe, chave] of [["health", "pv"], ["mana", "pm"]]) {
		const caixa = raiz.querySelector(`.attribute.${classe}`);
		const dados = actor.system?.attributes?.[chave];
		if (!caixa || !dados) continue;
		caixa.querySelector(".t20v-barra")?.remove();
		const max = Number(dados.max) || 0;
		const pct = max > 0 ? Math.max(0, Math.min(100, Math.round((100 * (Number(dados.value) || 0)) / max))) : 0;
		const temp = max > 0 ? Math.min(100, Math.round((100 * (Number(dados.temp) || 0)) / max)) : 0;
		caixa.insertAdjacentHTML("beforeend", `<div class="t20v-barra ${chave}"><span style="width:${pct}%"></span>${temp ? `<i style="width:${temp}%"></i>` : ""}</div>`);
	}
	// Condições ativas logo abaixo do cabeçalho.
	raiz.querySelector(".t20v-condicoes")?.remove();
	const condicoes = (actor.appliedEffects ?? []).filter((e) => e.statuses?.size && !e.disabled);
	const cabecalho = raiz.querySelector(".sheet-header");
	if (condicoes.length && cabecalho) {
		const faixa = document.createElement("div");
		faixa.className = "t20v-condicoes";
		for (const e of condicoes) {
			const chip = document.createElement("span");
			chip.className = "t20v-condicao";
			chip.dataset.tooltip = e.duration?.label && e.duration.label !== "None" ? `${e.name} (${e.duration.label})` : e.name;
			chip.innerHTML = `<img src="${e.img}" alt="">`;
			chip.append(document.createTextNode(e.name.replace(/\s*\(.*\)$/, "")));
			faixa.appendChild(chip);
		}
		cabecalho.after(faixa);
	}
	// Perícias treinadas em destaque.
	for (const li of raiz.querySelectorAll(".skills-list li.skill[data-item-id]")) {
		li.classList.toggle("t20v-treinada", Boolean(actor.system?.pericias?.[li.dataset.itemId]?.treinado));
	}
}

/* -------------------------------------------- chat */

/**
 * O sistema marca toda rolagem de d20 como "attack", inclusive testes de perícia e atributo. Ataque de verdade vem de um
 * item com rolagem de ataque (arma, magia, poder): só esse cartão guarda o item com uma rolagem do tipo "ataque".
 */
function rolagemDeAtaque(message) {
	const rolagensDoItem = foundry.utils.getProperty(message, "flags.tormenta20.itemData.rolls") ?? [];
	if (!rolagensDoItem.some((r) => r.type === "ataque")) return null;
	return (message.rolls ?? []).find((r) => r.dice?.[0]?.faces === 20 && r.options?.type === "attack");
}

function decorarCartao(message, html) {
	const cartao = html.querySelector?.(".tormenta20.chat-card.item-card");
	if (!cartao) return;
	// Descrição recolhida quando o cartão tem rolagem.
	const conteudo = cartao.querySelector(":scope > .card-content");
	if (opcao("recolherDescricao") && conteudo && cartao.querySelector(":scope > .roll") && conteudo.textContent.trim()) {
		cartao.classList.add("t20v-recolhido");
		const alternar = document.createElement("a");
		alternar.className = "t20v-alternar";
		alternar.innerHTML = `<i class="fa-solid fa-book-open"></i> <span>Descrição</span>`;
		alternar.addEventListener("click", (event) => {
			event.preventDefault();
			cartao.classList.toggle("t20v-recolhido");
		});
		conteudo.before(alternar);
	}
	// Acertou ou errou contra a Defesa dos alvos.
	const alvos = message.getFlag(ID, "alvos");
	const ataque = rolagemDeAtaque(message);
	if (!opcao("resultadoAtaque") || !alvos?.length || !ataque) return;
	const natural = ataque.dice[0].total;
	const margem = Number(message.getFlag("tormenta20", "itemData")?.criticoM) || 20;
	const linhas = alvos.map((a) => {
		const acertou = natural === 20 || (natural !== 1 && ataque.total >= a.defesa);
		const critico = acertou && natural >= margem;
		const nome = foundry.utils.escapeHTML(a.nome);
		const extremo = natural === 20 ? "20 natural" : natural === 1 ? "1 natural" : "";
		// A Defesa do alvo só aparece para o mestre; os jogadores veem o resultado e o 20/1 natural.
		const detalhe = game.user.isGM ? `${ataque.total} contra Defesa ${a.defesa}${extremo ? `, ${extremo}` : ""}` : extremo;
		return `<li class="${acertou ? "acerto" : "erro"}"><i class="fa-solid ${acertou ? "fa-check" : "fa-xmark"}"></i> ${acertou ? (critico ? "Crítico" : "Acertou") : "Errou"} ${nome}${detalhe ? ` <span>(${detalhe})</span>` : ""}</li>`;
	});
	const caixa = document.createElement("ul");
	caixa.className = "t20v-resultado";
	caixa.innerHTML = linhas.join("");
	const rolagens = [...cartao.querySelectorAll(":scope > .roll")];
	const alvo = rolagens.find((r) => !r.classList.contains("roll--dano")) ?? rolagens[0];
	alvo?.after(caixa);
}

/* -------------------------------------------- início */

Hooks.once("init", () => {
	registrarOpcoes();
	if (game.settings.get(ID, "imagens")) aplicarImagens();
	// No v14 o gancho renderApplication não dispara para janelas antigas (fichas do sistema): embrulha o desenho.
	if (game.settings.get(ID, "menuBotoes")) {
		libWrapper.register(
			ID,
			"foundry.appv1.api.Application.prototype._render",
			async function (wrapped, ...args) {
				const resultado = await wrapped(...args);
				try {
					menuDeBotoes(this);
				} catch (error) {
					console.warn(`${ID} | Falha no menu de botões.`, error);
				}
				return resultado;
			},
			"WRAPPER"
		);
	}
});

Hooks.once("ready", () => {
	aplicarClasses();
});

// Ferramentas de cena do mestre somem para os jogadores.
Hooks.on("getSceneControlButtons", (controles) => {
	if (game.user?.isGM || !opcao("ferramentasJogadores")) return;
	for (const grupo of FERRAMENTAS_DO_MESTRE) delete controles[grupo];
	delete controles.tokens?.tools?.unconstrainedMovement;
});

Hooks.on("renderActorSheet", (app) => {
	try {
		if (opcao("tema") !== "original") decorarFicha(app);
	} catch (error) {
		console.warn(`${ID} | Falha ao decorar a ficha.`, error);
	}
});

// Alvos marcados na hora do ataque: guardados na mensagem para o "acertou ou errou".
Hooks.on("preCreateChatMessage", (message) => {
	try {
		if (!opcao("resultadoAtaque") || !rolagemDeAtaque(message)) return;
		const alvos = [...(game.user?.targets ?? [])]
			.filter((t) => t.actor)
			.map((t) => ({ nome: t.name, uuid: t.document.uuid, defesa: Number(t.actor.system?.attributes?.defesa?.value) || 0 }));
		if (alvos.length) message.updateSource({ [`flags.${ID}.alvos`]: alvos });
	} catch (error) {
		console.warn(`${ID} | Falha ao guardar os alvos.`, error);
	}
});

Hooks.on("renderChatMessageHTML", (message, html) => {
	try {
		decorarCartao(message, html instanceof HTMLElement ? html : html?.[0]);
	} catch (error) {
		console.warn(`${ID} | Falha ao decorar o cartão.`, error);
	}
});
