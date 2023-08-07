import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
	breakpoints: {
		thresholds: {
			xs: 640,
			sm: 768,
			md: 1024,
			lg: 1280,
			xl: 1536,
		},
	},
	theme: {
		dark: false,
		light: true,
		disable: false,
		options: {
			customProperties: true,
		},
		themes: {
			light: {
				tema: "#2b2726",
				coresTema: {
					lighten1: "#30A59D",
					lighten2: "#018790",
					lighten3: "#7dad93",
				},
				secundaria: "#0a516d",
				coresSecundarias: {
					base: "#0a516d",
					lighten1: "#BEBEBE",
					lighten2: "#636363",
					lighten3: "#262626",
				},
				highlights: "#53347A",
				coresHighlights: {
					lighten1: "#D3B3FB",
					lighten2: "#8260AD",
					lighten3: "#34204D",
				},
				escura: "#0a516d",
				coresEscuras: {
					lighten1: "#484747",
					lighten2: "#262626",
					lighten3: "#0A0A0A",
				},
				clara: "#FFFFFF",
				coresClaras: {
					lighten1: "#ECECEC",
					lighten2: "#E0E0E0",
					lighten3: "#D0D0D0",
				},
				warning: "#C92E2E",
				coresWarning: {
					lighten1: "#E83838",
					lighten2: "#BB2C2C",
					lighten3: "#901F1F",
				},
				helper: "#EEC800",
				coresHelper: {
					lighten1: "#FFDE31",
					lighten2: "#D0AF00",
					lighten3: "#A88D00",
				},
				success: "#207C1E",
				coresSuccess: {
					lighten1: "#6AD068",
					lighten2: "#185B16",
					lighten3: "#0F3A0E",
				},
				designs: {
					menu: {
						sidebar: {
							logo: {

							},
							tipos: {
								permanent: true,
								absolute: false,
								bottom: false,
								temporary: false,
								floating: false,
								right: false,
								expendOnHover: false,
								src: "",
								mini: {
									ativo: false,
									mini: false,
								},
							},
							design: {
								icone: false,
								posicaoIcone: {
									esquerda: true,
									direita: false,
								},
							},
						},
					},
					cartaoLink: {
						tile: true,
						outlined: false,
						shaped: false,
						disabled: false,
						loading: false,
						elevation: 0,
						icone: true,
						posicaoIcone: {
							esquerda: false,
							direita: true,
						},
						titulo: true,
						subtitulo: true,
					},
					filtros: {
						tipos: {
							elevation: "0",
							outlined: false,
							shaped: false,
							tile: false,
						},
						design: {

						},
					},
					tabelas: {
						tipos: {

						},
						design: {

						},
						paginacao: {
							circle: true,
						},
					},
					botoes: {
						tipos: {
							outlined: false,
							rounded: false,
							tile: false,
						},
						design: {
							primaria: "",
							secundaria: "",
							terciaria: "",
							icone: true,
							posicaoIcone: {
								esquerda: true,
								direita: false,
							},
						},
					},
					inputs: {
						tipos: {
							regular: false,
							solo: false,
							soloInverted: false,
							filled: false,
							outlined: true,
							dense: true,
							clearable: true,
							flat: false,
							fullWidth: false,
							persistentHint: false,
							persistentPlaceholder: false,
							readonly: false,
							reverse: false,
							rounded: false,
							shaped: false,
							singleLine: false,
						},
						design: {

						},
					},
				},
			},
		},
	},
});
