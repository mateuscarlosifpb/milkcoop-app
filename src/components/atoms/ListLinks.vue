<template>
	<v-list
		color="tema"
		flat
		:class="$vuetify.theme.themes.light.designs.menu.sidebar.tipos.mini.ativo || $vuetify.breakpoint.mdAndDown? 'ml-0':'ml-7'"
		>
		<template v-for="(item, i) in links">
			<v-list-item
				:key="i"
				:to="item.precisaRota? item.rota:null"
				:v-model="item"
				@click="item.precisaRota? navegar(item.rota):item.click()"
				class="lista-de-links white--text"
				active-class="lista-de-links-ativo"
				>
				<v-list-item-icon v-if="$vuetify.theme.themes.light.designs.menu.sidebar.design.icone &&  $vuetify.theme.themes.light.designs.menu.sidebar.design.posicaoIcone.esquerda">
					<v-icon class="lista-de-links-icone">
						{{ item.icone }}
					</v-icon>
				</v-list-item-icon>
				<v-list-item-content align="start">
					<v-list-item-title>
						{{  item.texto  }}
					</v-list-item-title>
				</v-list-item-content>

				<v-list-item-icon v-if="$vuetify.theme.themes.light.designs.menu.sidebar.design.icone &&  $vuetify.theme.themes.light.designs.menu.sidebar.design.posicaoIcone.direita">
					<v-icon class="lista-de-links-icone">
						{{ item.icone }}
					</v-icon>
				</v-list-item-icon>
			</v-list-item>
		</template>
	</v-list>
</template>

<script>
	export default {
		name: "ListLinks",
		props: {
			links: Array,
		},
		data: () => ({
		}),
		methods: {
			navegar(url){
				this.$router.push({ path: url }).catch(() => {});
			},
		},
	};
</script>

<style scoped>
	.lista-de-links {
		color: white;
		text-decoration: none;
	}
	.lista-de-links-ativo {
		color: #414147 !important;
		background-color: #414147;
	}
	.lista-de-links-icone {
		color: var(--v-clara) !important;
	}
</style>
