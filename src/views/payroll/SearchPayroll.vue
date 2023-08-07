<template>
	<ViewWrapper
		:listaNavegacao="listaNavegacao"
		>
		<template #titulo>
			Pesquisar Folha de Pagamento
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
						<h6><b>Valor Folha de Pagamento</b></h6>
						<CampoValor
                                v-model="filtros.amount"
								label="Digíte o valor total"
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
							texto="Criar Folha de Pagamento"
							cor="secundaria"
							icone="mdi-plus"
							@click="createPayroll"
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

		<CardDefaut v-if="exibirTabelaPayroll()">
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
                            @page-change="pesquisarPayrollPaginado"
                            >
							<template
								v-slot:[`item.dataRegister`]="{ item }" >
								<div
									@click="editPayroll(item)"
									>
									{{data(item.dataRegister)}}
								</div>
							</template>
							<template
								v-slot:[`item.amount`]="{ item }" >
								{{ moeda(item.amount)}}
							</template>
							<template
								v-slot:[`item.quantity`]="{ item }" >
								{{ item.quantity + " Litros"}}
							</template>
							<template
								v-slot:[`item.status`]="{ item }" >
								<span v-if="item.status=='PAGAMENTO_EM_PROCESSAMENTO'">{{ "Pagamento em Processamento"}}</span>
								<span v-else>{{ "Pagamento Concluído"}}</span>
							</template>
							<template
								v-slot:[`item.actions`]="{ item }" >
								<v-icon
									v-if="item.status=='PAGAMENTO_EM_PROCESSAMENTO'"
									@click="confirmarPagamentoModal=true"
									>
									mdi-check-circle
								</v-icon>
								<v-dialog v-model="confirmarPagamentoModal" max-width="400">
									<v-card>
										<v-card-title>Confirmar Pagamento</v-card-title>
										<v-card-text>
											<!-- Conteúdo do modal, como mensagem ou detalhes do pagamento -->
											Tem certeza de que deseja confirmar o pagamento?
										</v-card-text>
										<v-card-actions class="justify-end">
											<v-btn color="secondary" @click="cancelarPagamento">Cancelar</v-btn>
											<v-btn color="primary" @click="confirmarPagamento(item.id)">Confirmar</v-btn>
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
	import { findPayroll, generatePayroll, confirmPayment } from "../../services/payroll/PayrollServices.js";
	import moment from 'moment';
	import { formatCurrency, formatData } from "@/utils/moeda";

	export default {
		name: "SearchPayroll",
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
				confirmarPagamentoModal: false,
				exibirModal: false,
				dataVenda: '',
				quantidade: null,
				itemParaVenda: null,
				listaNavegacao: [
					{ text: "Início", to: "/homeDash" },
					{ text: "Pesquisar Folha de Pagamento", to: "/searchPayroll" },
				],
                page: 1,
				filtros: {
					dataRegister: "",
					amount: null,
				},
				paginacao: {
					paginaAtual: 1,
				},
				carregando: false,
                filtroPesquisa: {},
				resultadoPesquisa: {},
				headers: [
                    { text: "Data", value: "dataRegister", sortable: false },
					{ text: "Quantidade", value: "quantity", sortable: false },
					{ text: "Total", value: "amount", sortable: false },
					{ text: "Status", value: "status", sortable: false },
					{ text: "Ações", value: "actions", sortable: false}],
			};
		},
		methods: {
			confirmarPagamento(id){
				this.carregando = true;
				confirmPayment(id)
					.then(() => {
						this.pesquisar();
					}).catch((error) => {
						console.log(error);
						this.carregando = false;
						this.confirmarPagamentoModal = false;
					}).finally(() => {
						this.carregando = false;
						this.confirmarPagamentoModal = false;
					});
			
			},
			cancelarPagamento(){
				this.confirmarPagamentoModal = false;
			},
			moeda(valor){
                return formatCurrency(valor);
            },
			data(dataRegister){
				return formatData(dataRegister);
			},
			createPayroll(){
                this.carregando = true;
				const persist = false;
				generatePayroll(persist)
					.then((response) => {
						this.payroll = response.data;
						this.$router
                            .push({ name: "RegisterPayroll", params: { payroll: response.data } })
                            .catch(() => {});
					})
					.catch((error) => {
						console.log(error);
						this.carregando = false;
				});
			},
			editPayroll(payroll){
				console.log("item", payroll);
				let nome = "RegisterPayroll";
				this.$router
					.push({ name: nome, params: { payroll: payroll } })
					.catch(() => {});
			},
			pesquisar(){
				if(this.carregando){
					return;
				}
				if(this.filtros.amount == "" || this.filtros.amount == null || this.filtros.amount == undefined ){
					this.filtros.amount = null;
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
				this.pesquisarPayrollPaginado();
			},
			pesquisarPayrollPaginado(){
				if(this.carregando){
					return;
				}
				this.filtros.pagina = 0;
				this.resultadoPesquisa = {};
				this.carregando = true;

				findPayroll(this.filtroPesquisa, this.paginacao.paginaAtual - 1)
					.then((response) => {
						this.resultadoPesquisa = response.data;
						this.carregando = false;
					})
					.catch((error) => {
						console.log(error);
						this.carregando = false;
					});
			},
			

			exibirTabelaPayroll(){
				return this.resultadoPesquisa != null && this.resultadoPesquisa.totalPages != null && this.resultadoPesquisa.totalElements > 0;
			},

			limparFiltros(){
				if(this.carregando){
					return;
				}
				this.filtros.dataRegister = "";
				this.filtros.amount = "";
				this.resultadoPesquisa = {};
			},
		},
	};
</script>
