<template>
	<ViewWrapper
		:listaNavegacao="listaNavegacao"
		>
		<template #titulo>
			Registro de vendas
		</template>
		<CardDefaut>
			<v-container>
				<v-row>
					<v-col
						cols="12"
						lg="6"
						>
						<h6><b>Data</b></h6>
						<InputGroup
							label="Digíte data do registro"
							type="date"
							v-model="filtros.dataRegister"
							/>
					</v-col>
				</v-row>
			</v-container>

			<v-container>
				<v-row
					justify="center"
					justify-lg="space-between"
					>
					<v-col
						cols="12"
						lg="auto"
						>
					</v-col>
					<v-col
						cols="auto"
						>
						<ButtonDefaut
							texto="Limpar"
							icone="mdi-broom"
							:block="$vuetify.breakpoint.mdAndDown"
							@click="limparFiltros()"
							/>
						<ButtonDefaut
							texto="Pesquisar"
							cor="tema"
							icone="mdi-magnify"
							@click="pesquisar()"
							class="ml-lg-2"
							:block="$vuetify.breakpoint.mdAndDown"
							:loading="carregando"
							/>
					</v-col>
				</v-row>
			</v-container>
		</CardDefaut>
		<CardDefaut v-if="exibirTabelaRegistroDeVendas()">
			<v-container>
				<v-row>
					<v-col>
						<TableAdm
                            :loading="carregando"
                            :page.sync="paginacao.paginaAtual"
                            :items-per-page="resultadoPesquisa.pageable.pageSize"
                            :headers="headers"
                            :server-items-length="resultadoPesquisa.totalElements"
                            :items.sync="resultadoPesquisa.content"
                            @page-change="pesquisarRegistroDeVendasPaginado"
                            >
							<template
								v-slot:[`item.price`]="{ item }" 
								>
								{{moeda(item.price)}}
							</template>
							<template
								v-slot:[`item.total`]="{ item }" >
								{{ moeda(item.quantity * item.price)}}
							</template>
							<template
								v-slot:[`item.dataRegister`]="{ item }" >
								{{ data(item.dataRegister)}}
							</template>
							<template
								v-slot:[`item.quantity`]="{ item }" >
								{{item.quantity+" Litros"}}
							</template>
						</TableAdm>
					</v-col>
				</v-row>
			</v-container>
		</CardDefaut>
		<CardDefaut v-if="resultadoPesquisa.totalElements == 0">
			<v-container>
				<v-row>
					<v-col>
						<v-alert
							outlined
							color="tema"
							type="info"> A pesquisa não retornou nenhum resultado!
						</v-alert>
					</v-col>
				</v-row>
			</v-container>
		</CardDefaut>
	</ViewWrapper>
</template>

<script>
	import InputGroup from "@/components/inputs/InputGroup.vue";
	import ViewWrapper from "../../components/wrapper/ViewWrapper.vue";
	import TableAdm from "../../components/table/TableAdm.vue";
	import CardDefaut from "../../components/atoms/CardDefaut.vue";
	import ButtonDefaut from "../../components/atoms/ButtonDefaut.vue";
	import {findInventorySale} from "../../services/inventorySale/InventorySaleServices.js"
	import { formatCurrency, formatData } from "@/utils/moeda";

	export default {
		name: "SearchInventorySale",

		components: {
			InputGroup,
			TableAdm,
			CardDefaut,
			ViewWrapper,
			ButtonDefaut
		},

		data(){
			return {
				exibirModalConfirmacao: false,
				listaNavegacao: [
					{ text: "Início", to: "/homeDash" },
					{ text: "Registro de Vendas", to: "/searchInventorySale" },
				],
                page: 1,
				paginacao: {
					paginaAtual: 1,
				},
				filtros: {
					dataRegister:"",
				},
				producerVO: {},
				carregando: false,
                filtroPesquisa: {},
				resultadoPesquisa: {},
				headers: [
					{
						text: "Data",
						align: "start",
						sortable: false,
						value: "dataRegister",
					},
                    { text: "Quantidade/Litro(s)", value: "quantity", sortable: false },
                    { text: "Valor do Litro", value: "price", sortable: false },
					{ text: "Valor Total", value: "total", sortable: false }],
			};
		},
		methods: {
			data(dataRegister){
				return formatData(dataRegister);
			},
			moeda(valor){
                return formatCurrency(valor);
            },
			pesquisar(){
				if(this.carregando){
					return;
				}
				this.filtros.pagina = 0;
				this.paginacao.paginaAtual = 1;
				this.resultadoPesquisa = {};
				this.filtroPesquisa = JSON.parse(JSON.stringify(this.filtros));
				this.pesquisarRegistroDeVendasPaginado();
			},
			pesquisarRegistroDeVendasPaginado(){
				if(this.carregando){
					return;
				}
				if(this.filtros.dataRegister==""||this.filtros.dataRegister==undefined){
					this.filtros.dataRegister = null;
				}
				this.filtros.pagina = 0;
				this.resultadoPesquisa = {};
				this.carregando = true;
				findInventorySale(this.filtroPesquisa, this.paginacao.paginaAtual - 1)
					.then((response) => {
						this.resultadoPesquisa = response.data;
						this.carregando = false;
					})
					.catch((error) => {
						console.log(error);
						this.carregando = false;
					});
			},
			

			exibirTabelaRegistroDeVendas(){
				return this.resultadoPesquisa != null && this.resultadoPesquisa.totalPages != null && this.resultadoPesquisa.totalElements > 0;
			},

			limparFiltros(){
				if(this.carregando){
					return;
				}
				this.resultadoPesquisa = {};
			},
		},
	};
</script>
