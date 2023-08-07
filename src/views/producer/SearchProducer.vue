<template>
	<ViewWrapper
		:listaNavegacao="listaNavegacao"
		>
		<template #titulo>
			Pesquisar Produtor
		</template>
		<CardDefaut>
			<v-container>
				<v-row>
					<v-col
						cols="12"
						lg="6"
						>
						<h6><b>Nome</b></h6>
						<InputGroup
							label="Digíte o nome do Produtor"
							type="text"
							v-model="filtros.fullName"
							/>
					</v-col>
					<v-col
						cols="12"
						lg="6"
						>
						<h6><b>Telefone</b></h6>
						<InputGroup
							label="Digíte o telefone do produtor"
							type="text"
							v-model="filtros.telephone"
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
							texto="Adicionar Produtor"
							cor="secundaria"
							icone="mdi-plus"
							@click="irPaginaSalvarProdutor"
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
                            @page-change="pesquisarProdutorPaginado"
                            >
							<template
								v-slot:[`item.cpf`]="{ item }" >
								<span
									@click="irParaEditarProdutor(item.id)"
									>
									{{formatarCpf(item.cpf)}}
								</span>
							</template>
							<template
								v-slot:[`item.telephone`]="{ item }" >
								{{ formatarTelefone(item.telephone) }}
							</template>
							<template
								v-slot:[`item.actions`]="{ item }" >
								<v-icon
									@click="irParaLancamentosProdutor(item.id)"
									>
									mdi-lead-pencil
								</v-icon>
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
	import ButtonDefaut from "@/components/atoms/ButtonDefaut.vue";
	import ViewWrapper from "@/components/wrapper/ViewWrapper.vue";
	import TableAdm from "../../components/table/TableAdm.vue";
	import CardDefaut from "../../components/atoms/CardDefaut.vue";
	import { buscarTodos } from "@/services/ProducerService";
	import { generatePayroll } from "../../services/payroll/PayrollServices.js";
	import { formatCPF,formatTelefone } from "../../utils/moeda.js"

	export default {
		name: "searchProducer",
		components: {
			InputGroup,
			TableAdm,
			ButtonDefaut,
			CardDefaut,
			ViewWrapper,
		},

		data(){
			return {
				listaNavegacao: [
					{ text: "Início", to: "/homeDash" },
					{ text: "Pesquisar Produtor", to: "/searchProducer" },
				],
                page: 1,
				filtros: {
					fullName: "",
					telephone: "",
				},
				payroll: {},
				paginacao: {
					paginaAtual: 1,
				},
				carregando: false,
                filtroPesquisa: {},
				resultadoPesquisa: {},
				headers: [
					{
						text: "CPF",
						align: "start",
						sortable: false,
						value: "cpf",
					},
					{ text: "Nome", value: "fullName", sortable: false },
					{ text: "Telefone", value: "telephone", sortable: false },
					{ text: "Lançamento", value: "actions", sortable: false }],
			};
		},
		methods: {
			formatarCpf(cpf){
				return formatCPF(cpf);
			},
			formatarTelefone(telefone){
				return formatTelefone(telefone);
			},
			irPaginaSalvarProdutor(){
				this.$router.push("/registerProducer");
			},
			irParaEditarProdutor(id){
				let nome = "RegisterProducer";
				this.$router
					.push({ name: nome, query: { id: id } })
					.catch(() => {});
			},
			irParaLancamentosProdutor(id){
				let nome = "SearchProducerDelivery";
				this.$router
					.push({ name: nome, query: { idProducer: id } })
					.catch(() => {});
			},
			pesquisar(){
				if(this.carregando){
					return;
				}
				if(this.filtros.fullName == "" || this.filtros.fullName == null || this.filtros.fullName == undefined ){
					this.filtros.fullName = null;
				}
				if(this.filtros.telephone == "" || this.filtros.telephone == null || this.filtros.telephone == undefined ){
					this.filtros.telephone = null;
				}
				this.filtros.pagina = 0;
				this.paginacao.paginaAtual = 1;
				this.resultadoPesquisa = {};
				this.filtroPesquisa = JSON.parse(JSON.stringify(this.filtros));
				this.pesquisarProdutorPaginado();
			},
			pesquisarProdutorPaginado(){
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
				const persist = false;
				generatePayroll(persist)
					.then((response) => {
						this.payroll = response.data;
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
				this.filtros.fullName = "";
				this.filtros.telephone = "";
				this.resultadoPesquisa = {};
			},
		},
	};
</script>
