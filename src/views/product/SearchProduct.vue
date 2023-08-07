<template>
	<ViewWrapper
		:listaNavegacao="listaNavegacao"
		>
		<template #titulo>
			Pesquisar Produto
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
					<v-col
						cols="12"
						lg="6"
						>
						<h6><b>Preço</b></h6>
						<CampoValor
                                v-model="filtros.price"
								label="Digíte o preço do produto"
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
						<ButtonDefaut
							texto="Adicionar Produto"
							cor="secundaria"
							icone="mdi-plus"
							@click="irPaginaSalvarProduto"
							:block="$vuetify.breakpoint.mdAndDown"
							/>
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

		<CardDefaut v-if="exibirTabelaProdutores()">
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
                            @page-change="pesquisarProdutoPaginado"
                            >
							<template
								v-slot:[`item.productName`]="{ item }" >
								<div
									@click="irParaEditarProduto(item.id)"
									>
									{{item.productName}}
								</div>
							</template>
							<template
								v-slot:[`item.dataRegister`]="{ item }">
								{{data(item.dataRegister)}}
							</template>
							<template
								v-slot:[`item.price`]="{ item }" >
								{{moeda(item.price)}}
							</template>
							<template
								v-slot:[`item.quantity`]="{ item }" >
								{{item.quantity+" Litros"}}
							</template>
							<template v-slot:[`item.actions`]="{ item }">
								<v-icon large @click="exibirModalConfirmacao(item)">mdi-printer-pos-check</v-icon>
									<v-dialog v-model="exibirModal" max-width="500px">
									<v-card>
										<v-card-title>Confirmação da Venda</v-card-title>
										<v-card-text>
											<p>Quantidade disponível: {{ item.quantity }}</p>
											<CampoValor
												v-model="quantidade"
												label="Digíte a quantidade da venda"
												/>
											<p>Data da Venda</p>
											<InputGroup
												v-model="dataVenda"
												type="date"
												/>
										</v-card-text>
										<v-card-actions class="justify-end">
											<v-btn color="secondary" text @click="exibirModal = false">
												Cancelar
											</v-btn>
											<v-btn v-if="quantidade>0 && quantidade<item.quantity" color="primary" @click="confirmarVenda(item)">
												Confirmar
											</v-btn>
										</v-card-actions>
									</v-card>
								</v-dialog>
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
	/* eslint-disable no-unused-expressions */
	/* eslint-disable func-names */
	import InputGroup from "@/components/inputs/InputGroup.vue";
	import CampoValor from "../../components/forms/CampoValor.vue"
	import ButtonDefaut from "@/components/atoms/ButtonDefaut.vue";
	import ViewWrapper from "@/components/wrapper/ViewWrapper.vue";
	import TableAdm from "../../components/table/TableAdm.vue";
	import CardDefaut from "../../components/atoms/CardDefaut.vue";
	import { buscarTodos } from "../../services/product/ProductService.js";
	import moment from 'moment';
	import { createInventorySale } from "../../services/inventorySale/InventorySaleServices.js"
	import { formatCurrency, formatData } from "@/utils/moeda";

	export default {
		name: "SearchProduct",
		components: {
			InputGroup,
			CampoValor,
			TableAdm,
			ButtonDefaut,
			CardDefaut,
			ViewWrapper,
		},

		data(){
			return {
				exibirModal: false,
				dataVenda: '',
				quantidade: null,
				itemParaVenda: null,
				listaNavegacao: [
					{ text: "Início", to: "/homeDash" },
					{ text: "Pesquisar Produto", to: "/searchProduct" },
				],
                page: 1,
				filtros: {
					dataRegister: "",
					price: null,
				},
				paginacao: {
					paginaAtual: 1,
				},
				carregando: false,
                filtroPesquisa: {},
				resultadoPesquisa: {},
				headers: [
					{
						text: "Nome",
						align: "start",
						sortable: false,
						value: "productName",
					},
                    { text: "Data", value: "dataRegister", sortable: false },
					{ text: "Preço", value: "price", sortable: false },
					{ text: "Estoque/Litro(s)", value: "quantity", sortable: false },
					{ text: "Ações", value: "actions", sortable: false },],
			};
		},
		methods: {
			data(dataRegister){
				return formatData(dataRegister);
			},
			moeda(valor){
                return formatCurrency(valor);
            },
			exibirModalConfirmacao(item){
				if(item.quantity>0){
					this.itemParaVenda = item;
					this.exibirModal = true;
					this.dataVenda = '';
				}
			},
			confirmarVenda(item){
				if(this.itemParaVenda.quantity >= item.quantity){
					// Executar a lógica de venda
					const data = moment(this.dataVenda, 'YYYY-MM-DD').toDate();
					const inventorySaleVO = {
						price:item.price,
						quantity:this.quantidade,
						product: {
							id: item.id
						},
						dataRegister:data,
					}
					createInventorySale(inventorySaleVO)
						.then(() => {
							console.log("Venda registrada com sucesso!");
							this.$router.push("/searchInventorySale");
						})
						.catch((error) => {
							console.log(error);
						})
						.finally(() => {
							this.exibirModal = false;
							this.carregando = false;
						});
				}else{
					alert('Quantidade de venda excede a quantidade disponível.');
				}
			},
			irPaginaSalvarProduto(){
				this.$router.push("/registerProduct");
			},
			irParaEditarProduto(id){
				let nome = "RegisterProduct";
				this.$router
					.push({ name: nome, query: { id: id } })
					.catch(() => {});
			},
			pesquisar(){
				if(this.carregando){
					return;
				}
				if(this.filtros.price == "" || this.filtros.price == null || this.filtros.price == undefined ){
					this.filtros.price = null;
				}
				if(this.filtros.dataRegister == "" || this.filtros.dataRegister == null || this.filtros.dataRegister == undefined ){
					this.filtros.dataRegister = null;
				}
				else{
					this.filtros.dataRegister = moment(this.filtros.dataRegister, 'YYYY-MM-DD').toDate();
				}
				this.filtros.pagina = 0;
				this.paginacao.paginaAtual = 1;
				this.resultadoPesquisa = {};
				this.filtroPesquisa = JSON.parse(JSON.stringify(this.filtros));
				this.pesquisarProdutoPaginado();
			},
			pesquisarProdutoPaginado(){
				if(this.carregando){
					return;
				}
				this.filtros.pagina = 0;
				this.resultadoPesquisa = {};
				this.carregando = true;

				buscarTodos(this.filtroPesquisa, this.paginacao.paginaAtual - 1)
					.then((response) => {
						this.resultadoPesquisa = response.data;
						this.carregando = false;
					})
					.catch((error) => {
						console.log(error);
						this.carregando = false;
					});
			},
			

			exibirTabelaProdutores(){
				return this.resultadoPesquisa != null && this.resultadoPesquisa.totalPages != null && this.resultadoPesquisa.totalElements > 0;
			},

			limparFiltros(){
				if(this.carregando){
					return;
				}
				this.filtros.dataRegister = "";
				this.filtros.price = "";
				this.resultadoPesquisa = {};
			},
		},
	};
</script>
