<template>
	<v-btn
		:outlined="$vuetify.theme.themes.light.designs.botoes.tipos.outlined"
		:rounded="$vuetify.theme.themes.light.designs.botoes.tipos.rounded"
		:tile="$vuetify.theme.themes.light.designs.botoes.tipos.tile"
		:color="cor"
		:style="estiloBotao"
		:loading="loading"
		v-on="$listeners"
		v-bind="$attrs"
		>
		<v-icon v-if="$vuetify.theme.themes.light.designs.botoes.design.icone && $vuetify.theme.themes.light.designs.botoes.design.posicaoIcone.esquerda">
			{{ icone }}
		</v-icon>

		<slot v-if="$vuetify.theme.themes.light.designs.botoes.design.icone && $vuetify.theme.themes.light.designs.botoes.design.posicaoIcone.esquerda"/>

		{{ texto }}

		<slot v-if="$vuetify.theme.themes.light.designs.botoes.design.icone && $vuetify.theme.themes.light.designs.botoes.design.posicaoIcone.direita"/>

		<v-icon v-if="$vuetify.theme.themes.light.designs.botoes.design.icone && $vuetify.theme.themes.light.designs.botoes.design.posicaoIcone.direita">
			{{ icone }}
		</v-icon>
	</v-btn>
</template>

<script>
	export default {
		name: "ButtonDefaut",
		props: {
			cor: String,
			texto: String,
			icone: String,
			loading: Boolean,
		},
		computed: {
			estiloBotao(){
				const style = {};
				if(this.$props.cor == "tema" || this.$props.cor == "secundaria"){
					style.color = "#FFFFFF";
				}
				else{
					style.color = "#0a516d";
					style.border = "1px solid #0a516d";
				}
				return style;
			},
		},
	};
</script>
