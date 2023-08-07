<template>
	<v-card
		:outlined="$vuetify.theme.themes.light.designs.filtros.tipos.outlined"
		:shaped="$vuetify.theme.themes.light.designs.filtros.tipos.shaped"
		:tile="$vuetify.theme.themes.light.designs.filtros.tipos.tile"
		:elevation="$vuetify.theme.themes.light.designs.filtros.tipos.elevation"
		class="box-menu"
		>
		<slot/>
	</v-card>
</template>
<script>
	export default {
		name: "CardDefaut",
	};
</script>
