<template>
	<v-card elevation="0">
		<v-data-table
			no-results-text="Nenhum dado encontrado!"
			loading-text="Carregando..."
			:footer-props="{
				itemsPerPageText:'Itens por Página: ',
				disableItemsPerPage:true,
				disablePagination:true,
			}"
			hide-default-footer
			class="tabelaAdm"
			v-bind:class="{'row-pointer':rowPointer && isNotLoading}"
			@click:row="handleClick"
			@page-count="pageCount= $event"
			v-bind="$attrs"
			v-on="$listeners"
			>
			<template v-for="(_, name) in $scopedSlots" v-slot:[name]="slotData">
				<slot :name="name" v-bind="slotData" />
			</template>
			<template v-for="(_, someOtherName) in $slots" v-slot:[someOtherName]>
				<slot :name="someOtherName"/>
			</template>
			<template v-slot:no-data>
				Não há itens disponíveis.
			</template>
		</v-data-table>
		<hr/>
		<v-spacer/>
		<v-pagination
			:disabled="$attrs && $attrs.loading"
			:value="page"
			color="#0a516d"
			@input="input"
			:length="pageCount"
			:total-visible="7"
			:circle="$vuetify.theme.themes.light.designs.tabelas.paginacao.circle"
			/>
	</v-card>
</template>

<script>
	export default {
		name: "TableAdm",
		props: {
			page: {
				required: false,
			},
			rowPointer: {
				required: false,
				default: false,
				type: Boolean,
			},
		},
		data(){
			return {
				pageCount: 0,
			};
		},
		computed: {
			isNotLoading(){
				return !(this.loading);
			},
		},
		methods: {
			input(valor){
				this.$emit("update:page", (valor));
				this.$emit("page-change", (valor));
			},
			handleClick(valor){
				this.$emit("click-row", valor);
			},
		},
	};
</script>

<style>

.tabelaAdm{
	cursor: pointer;
}

</style>
