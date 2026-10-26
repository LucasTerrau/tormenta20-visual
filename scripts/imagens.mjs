import { IMAGENS } from "./imagens-dados.mjs";

/**
 * Troca, em memória, a imagem dos documentos dos compêndios que ainda usam um ícone genérico do Foundry
 * (ou nenhum) pela arte do livro ou pelo ícone do sistema (scripts/imagens-dados.mjs, gerado por dev/).
 * Vale também para cópias no mundo (mesmo _id ou origem no compêndio). Imagem escolhida à mão fica.
 */
const ID = "tormenta20-visual";
const porId = new Map();
for (const [uuid, entrada] of Object.entries(IMAGENS)) porId.set(uuid.split(".").at(-1), entrada);

// Ícones do Foundry, sem imagem, ou a imagem padrão de ator do sistema (orc-head).
const generica = (img) => !img || img.startsWith("icons/") || img.includes("mystery-man") || img.endsWith("/svg/orc-head.svg");

function entradaDe(source) {
	const origem = source?._stats?.compendiumSource ?? source?.flags?.core?.sourceId;
	return (origem && IMAGENS[origem]) || (source?._id && porId.get(source._id)) || null;
}

function trocar(source) {
	const entrada = entradaDe(source);
	if (!entrada) return;
	if (generica(source.img)) source.img = entrada.img;
	const textura = source.prototypeToken?.texture;
	if (entrada.token && textura && generica(textura.src)) textura.src = entrada.token;
}

export function aplicarImagens() {
	if (!porId.size) return;
	for (const classe of ["Item", "Actor"]) {
		libWrapper.register(
			ID,
			`CONFIG.${classe}.documentClass.migrateData`,
			function (wrapped, source, ...args) {
				try {
					trocar(source);
				} catch (error) {
					console.warn(`${ID} | Falha ao trocar a imagem.`, error);
				}
				return wrapped(source, ...args);
			},
			"WRAPPER"
		);
	}
	// Miniaturas da janela do compêndio vêm do índice, não do documento.
	libWrapper.register(
		ID,
		"foundry.documents.collections.CompendiumCollection.prototype.getIndex",
		async function (wrapped, ...args) {
			const indice = await wrapped(...args);
			try {
				for (const entrada of indice) {
					const nova = IMAGENS[`Compendium.${this.collection}.${this.documentName}.${entrada._id}`];
					if (nova && generica(entrada.img)) entrada.img = nova.img;
				}
			} catch (error) {
				console.warn(`${ID} | Falha ao trocar as miniaturas do compêndio.`, error);
			}
			return indice;
		},
		"WRAPPER"
	);
}
