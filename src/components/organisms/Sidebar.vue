<template>
	<v-card tile>
		<v-toolbar
			class="py-0"
			style="width: 100%;"
			fixed
			color="#0a516d"
			:permanent="isPermanent"
			:absolute="isAbsolute"
			:bottom="isBottom"
			:temporary="isTemporary"
			:floating="isFloating"
			:right="isRight"
			:expand-on-hover="isExpandOnHover"
			:src="isSrc"
			:mini-variant.sync="miniVariant"
			:app="isApp"
			>
			<v-container fluid>
				<v-row class="justify-center"> <!-- Centralizando os links e o logo na barra -->
					<h2 v-if="$vuetify.breakpoint.mdAndUp">MilkCoop</h2><v-icon large>mdi-cow</v-icon>  <!-- Substitua "mdi-milk" pelo ícone correto do MDI para o nome "milkcoop" -->
					<v-toolbar-items>
						<v-btn
							v-for="link in listaDeLinksInicio"
							:key="link.texto"
							:to="link.rota"
							text
							>
							<v-icon left>{{ link.icone }}</v-icon>
							<span v-if="$vuetify.breakpoint.mdAndUp">{{ link.texto }}</span>
						</v-btn>
					</v-toolbar-items>
				</v-row>
			</v-container>
		</v-toolbar>
	</v-card>

</template>

<script>

	export default {
		name: "SideBar",
		components: {
		},
		data(){
			return {
				isPermanent: false,
				isAbsolute: false,
				isBottom: false,
				isTemporary: false,
				isFloating: false,
				isRight: false,
				isExpandOnHover: false,
				isSrc: '',
				miniVariant: false,
				isApp: false,
				drawer: false,
				drawerMobile: false,
				listaDeLinks: [],
				listaDeLinksInicio: [
					{
						texto: "Início", rota: "/homeDash", precisaRota: true, icone: "mdi-view-dashboard",
					},
					{
						texto: "Produtor", rota: "/searchProducer", precisaRota: true, icone: "mdi-account",
					},
					{
						texto: "Registro de vendas", rota: "/searchInventorySale", precisaRota: true, icone: "mdi-printer-pos-plus",
					},
					{
						texto: "Produto", rota: "/searchProduct", precisaRota: true, icone: "mdi-bottle-tonic",
					},
					{
						texto: "Folha de Pagamento", rota: "/searchPayroll", precisaRota: true, icone: "mdi-cash-sync",
					},
				],
				
			};
		
		},
		computed: {
			shouldShowLinks() {
				// Return true if the screen size is md and up, false otherwise
				return this.$vuetify.breakpoint.mdAndUp;
			},
		},
	};
</script>
