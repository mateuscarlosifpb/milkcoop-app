<template>
	<v-sheet
		:class="$vuetify.breakpoint.mdAndDown? 'pagina':'pagina mx-10'"
		:color="$vuetify.theme.dark == false? $vuetify.theme.themes.light.main : ''"
		>
		<CardDefaut>
			<v-container>
				<v-row>
					<v-col
						align="start"
						cols="12"
						>
						<div
							class="header-page"
							>
							<h4><slot name="titulo"/></h4>
							<v-row>
								<v-breadcrumbs :items="listaNavegacao"/>
							</v-row>
						</div>
					</v-col>
				</v-row>
			</v-container>
		</CardDefaut>
		<slot/>

	</v-sheet>
</template>

<script>
	import CardDefaut from "../atoms/CardDefaut.vue";

	export default {
		name: "ViewWrapper",

		components: {
			CardDefaut,
		},

		props: {
			listaNavegacao: {
				type: Array,
			},
		},

		data(){
			return {

			};
		},
		computed: {
		},
		watch: {
		},

		methods: {
		},
	};
</script>
