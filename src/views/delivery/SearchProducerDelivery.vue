<template>
	<ViewWrapper
		:listaNavegacao="listaNavegacao"
		>
		<template #titulo>
			Lançamentos Produtor
		</template>
		<CardDefaut>
			<v-container>
				<v-row>
					<v-col
						align="start"
						cols="12"
						lg="6"
						>
						<h3>{{producer.fullName}}</h3>
						<h3>{{cpf(producer.cpf)}}</h3>
						<h3>{{telefone(producer.telephone)}}</h3>
					</v-col>
				</v-row>
				<v-row
					justify="center"
					justify-lg="space-between"
					>
					<v-col
						cols="12"
						lg="auto"
						>
						<ButtonDefaut
							texto="Adicionar Lançamento"
							cor="secundaria"
							icone="mdi-plus"
							@click="irPaginaSalvarLancamento"
							:block="$vuetify.breakpoint.mdAndDown"
							/>
					</v-col>
				</v-row>
			</v-container>
		</CardDefaut>
		<CardDefaut>
			<DashProducerDelivery
				:totalProduzido="totalProduzido"
				:totalNoAno="totalNoAno"
				:totalNoMes="totalNoMes"
				:totalParaReceber="totalParaReceber"
				:totalRecebidoNoAno="totalRecebidoNoAno"
				:totalEmProcessamento="totalEmProcessamento"
				/>
		</CardDefaut>
		<CardDefaut v-if="exibirTabelaLancamentoProdutores()">
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
                            @page-change="pesquisarLancamentosProdutorPaginado"
                            >
							<template
								v-slot:[`item.product.price`]="{ item }" >
								{{ moeda(item.product.price)}}
							</template>
							<template
								v-slot:[`item.dataRegister`]="{ item }" >
								{{ data(item.dataRegister)}}
							</template>
							<template
								v-slot:[`item.quantity`]="{ item }" >
								{{ item.quantity + " Litros" }}
							</template>
							<template
								v-slot:[`item.total`]="{ item }" >
								{{ moeda(item.quantity * item.product.price)}}
							</template>
							<template
								v-slot:[`item.status`]="{ item }" >
								<span v-if="item.status=='PAGAMENTO_EM_PROCESSAMENTO'">{{ "Pagamento em Processamento"}}</span>
								<span v-else-if="item.status=='PAGAMENTO_CONCLUIDO'">{{ "Pagamento Concluído"}}</span>
								<span v-else>{{ "Pagamento Pendente"}}</span>
							</template>
							<template v-slot:[`item.acoes`]="{ item }">
								<v-icon @click="exibirModalConfirmacao = true">mdi-delete</v-icon>
								<v-dialog v-model="exibirModalConfirmacao" max-width="500px">
									<v-card>
										<v-card-title>Confirmação de exclusão</v-card-title>
										<v-card-text>
											Deseja realmente excluir o lançamento?
										</v-card-text>
										<v-card-actions>
											<v-btn color="primary" @click="excluirLancamento(item.id); exibirModalConfirmacao = false">
												Confirmar
											</v-btn>
											<v-btn color="red" text @click="exibirModalConfirmacao = false">
												Cancelar
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
	import ViewWrapper from "@/components/wrapper/ViewWrapper.vue";
	import TableAdm from "../../components/table/TableAdm.vue";
	import CardDefaut from "../../components/atoms/CardDefaut.vue";
	import ButtonDefaut from "../../components/atoms/ButtonDefaut.vue";
	import { buscarTodos, dashBoard, excluir } from "@/services/delivery/ProducerDelivery";
	import DashProducerDelivery from "@/components/forms/DashProducerDelivery.vue";
	import { formatCurrency, formatData, formatCPF, formatTelefone } from "@/utils/moeda";
	import { buscarPorId } from "@/services/ProducerService";

	export default {
		name: "SearchProducerDelivery",

		components: {
			TableAdm,
			CardDefaut,
			ViewWrapper,
			ButtonDefaut,
			DashProducerDelivery,
		},

		data(){
			return {
				totalProduzido:null,
				totalNoAno:null,
				totalNoMes:null,
				totalParaReceber:null,
				totalRecebidoNoAno:null,
				totalEmProcessamento:null,
				exibirModalConfirmacao: false,
				listaNavegacao: [
					{ text: "Início", to: "/homeDash" },
					{ text: "Pesquisar Produtor", to: "/searchProducer" },
					{ text: "Lançamentos Produtor", to: "/searchProducerDelivery" },
				],
                page: 1,
				paginacao: {
					paginaAtual: 1,
				},
				filtros: {
					producer:{
						id: this.$route.query.idProducer || undefined,
					},
				},
				producer: {},
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
                    { text: "Quantidade", value: "quantity", sortable: false },
                    { text: "Valor", value: "product.price", sortable: false },
					{ text: "Valor Total", value: "total", sortable: false },
					{ text: "Status Pagamento", value: "status", sortable: false },
					{ text: "Ações", value: "acoes", sortable: false }],
			};
		},
		methods: {
			telefone(tele){
				return formatTelefone(tele);
			},
			cpf(cpf){
				return formatCPF(cpf);
			},
			data(dataRegister){
				return formatData(dataRegister);
			},
			moeda(valor){
                return formatCurrency(valor);
            },
			carregarDash(){
				const producerDeliveryVO = {
					producer: {
						id: this.filtros.producer.id,
					},
				};
				dashBoard(producerDeliveryVO)
					.then((response) => {
						const res = response.data;
						this.totalProduzido=res.totalProduzido;
						this.totalNoAno=res.totalNoAno;
						this.totalNoMes=res.totalNoMes;
						this.totalParaReceber=res.totalParaReceber;
						this.totalRecebidoNoAno=res.totalRecebidoNoAno;
						this.totalEmProcessamento=res.totalEmProcessamento;
					})
					.catch((error) => {
						console.log(error);
					});
			},
			excluirLancamento(idLancamento){
				excluir(idLancamento).then(() => {
						this.pesquisar()
					})
					.catch((error) => {
						console.log(error);
						this.carregando = false;
					});
			},
			irPaginaSalvarLancamento(){
				let nome = "RegisterProducerDelivery";
				this.$router
					.push({ name: nome, query: { idProducer: this.filtros.producer.id } })
					.catch(() => {});
			},
			irParaEditarLancamento(data){
				let nome = "RegisterProducerDelivery";
				this.$router
					.push({ name: nome, query: { id: data.id } })
					.catch(() => {});
			},
			pesquisar(){
				if(this.carregando){
					return;
				}
				this.filtros.pagina = 0;
				this.paginacao.paginaAtual = 1;
				this.resultadoPesquisa = {};
				this.filtroPesquisa = JSON.parse(JSON.stringify(this.filtros));
				this.pesquisarLancamentosProdutorPaginado();
			},
			pesquisarLancamentosProdutorPaginado(){
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
			

			exibirTabelaLancamentoProdutores(){
				return this.resultadoPesquisa != null && this.resultadoPesquisa.totalPages != null && this.resultadoPesquisa.totalElements > 0;
			},

			limparFiltros(){
				if(this.carregando){
					return;
				}
				this.resultadoPesquisa = {};
			},
			carregarProdutor(){
				this.carregando = true;
				buscarPorId(this.$route.query.idProducer)
					.then((response) => {
						const res = response.data;
						this.producer = res;
					})
					.catch((error) => {
						console.log(error);
					})
					.finally(() => {
						this.carregando = false;
					});
			},
		},
		mounted(){
			if(this.filtros.producer!==undefined){
				this.pesquisar();
				this.carregarDash();
				this.carregarProdutor();
			}
			else if(this.$route.query.idProducer == undefined){
				this.$router.push("/searchProducer");
			}
			console.log(this.$route.query.idProducer);
		},
	};
</script>
