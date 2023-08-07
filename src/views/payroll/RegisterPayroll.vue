<template>
	<ViewWrapper
		:listaNavegacao="listaNavegacao"
		>
		<template #titulo>
			Cadastrar Folha de Pagamento
		</template>
		<CardDefaut>
			<v-form>
				<v-container>
                    <v-row>
						<v-col
							align="start"
							cols="12"
							lg="2"
							>
							<h6><b>Data</b></h6>
							<InputGroup
                                v-model="payrollVO.dataRegister"
                                type="date"
								/>
						</v-col>
					</v-row>
                    <v-row>
						<v-col
							align="end"
							cols="12"
							lg="12"
							>
							<h3><b>Total da Folha de Pagamento</b></h3>
							<h3>{{moeda(payrollVO.amount)}}</h3>
						</v-col>
					</v-row>
                    <v-row>
                        <v-col
							align="end"
							cols="12"
							lg="12"
							>
							<h3><b>Quantidade de leite</b></h3>
							<h3>{{payrollVO.quantity}} Litros</h3>
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
							v-if="(payrollVO.id==undefined || payrollVO.id ==null)"
							texto="Salvar"
							cor="secundaria"
							icone="mdi-plus"
							@click="createPayroll()"
							:block="$vuetify.breakpoint.mdAndDown"
							/>
						<ButtonDefaut
							v-else
							texto="Download Folha de Pagamento"
							cor="secundaria"
							icone="mdi-download"
							@click="generatePDF()"
							:block="$vuetify.breakpoint.mdAndDown"
							/>
                        </v-col>
                        <v-col
						cols="auto"
						>
						<ButtonDefaut
							v-if="!exibirTable()"
							texto="Detalhar"
							cor="tema"
							icone="mdi-magnify-plus"
							class="ml-lg-2"
							:loading="carregando"
							@click="transformPageable()"
							:block="$vuetify.breakpoint.mdAndDown"
							/>
						<ButtonDefaut
							v-else
							texto="Esconder"
							cor="gray"
							icone="mdi-magnify-minus "
							:loading="carregando"
							@click="esconderDetalhe()"
							class="ml-lg-2"
							:block="$vuetify.breakpoint.mdAndDown"
							/>
					</v-col>
					</v-row>
				</v-container>
			</v-form>
		</CardDefaut>
        <CardDefaut v-if="exibirTable()">
			<v-container>
				<v-row>
					<v-col>
						<TableAdm
							:loading="carregando"
							:page.sync="paginacao.paginaAtual"
							:items-per-page="pagina.pageable.pageSize"
							:headers="headers"
							:server-items-length="pagina.totalElements"
							:items.sync="pagina.content"
							@page-change="transformPageable"
							>
                            <template
								v-slot:[`item.amount`]="{ item }" >
								{{ moeda(item.amount)}}
							</template>
                            <template
								v-slot:[`item.quantity`]="{ item }" >
								{{ item.quantity + " Litros"}}
							</template>
						</TableAdm>
					</v-col>
				</v-row>
			</v-container>
		</CardDefaut>
	</ViewWrapper>
</template>

<script>

	import InputGroup from "@/components/inputs/InputGroup.vue";
	import ButtonDefaut from "@/components/atoms/ButtonDefaut.vue";
	import ViewWrapper from "@/components/wrapper/ViewWrapper.vue";
	import CardDefaut from "../../components/atoms/CardDefaut.vue";
	import { findPayrollById, generatePayrollPageable, generatePayroll } from "../../services/payroll/PayrollServices.js";
    import { formatCurrency, formatData } from "../../utils/moeda.js"
    import TableAdm from "@/components/table/TableAdm.vue";
    import jsPDF from 'jspdf';
	import 'jspdf-autotable';


	export default {
		name: "RegisterPayroll",
		components: {
            InputGroup,
            ButtonDefaut,
            CardDefaut,
            ViewWrapper,
            TableAdm,
        },
		data(){
			return {
                headers: [{ text: "Nome do Produtor", value: "producer.fullName", sortable: false },
                    { text: "Quantidade", value: "quantity", sortable: false },
					{ text: "Total", value: "amount", sortable: false }],
                page: 1,
				paginacao: {
					paginaAtual: 1,
				},
                pagina: {},
                carregando: false,
				listaNavegacao: [
					{ text: "Início", to: "/homeDash" },
					{ text: "Pesquisar Folha de Pagamento", to: "/searchPayroll" },
					{ text: "Cadastrar Folha de Pagamento", to: "/registerPayroll" },
				],
                payrollVO: this.$route.params.payroll,
			};
		},
		methods: {
            esconderDetalhe(){
				this.pagina = {};
			},
            exibirTable(){
				return this.pagina != null && this.pagina.totalPages != null && this.pagina.totalElements > 0;
			},
            transformPageable(){
				this.carregando = true;
				generatePayrollPageable(this.payrollVO.payrollProducerList, this.paginacao.paginaAtual - 1)
					.then((response) => {
						this.pagina = response.data;
					}).catch((error) => {
						console.log(error);
					}).finally(() => {
						this.carregando = false;
					});
			},
            moeda(valor){
                return formatCurrency(valor);
            },
            createPayroll(){
                this.carregando = true;
				const persist = true;
				generatePayroll(persist)
					.then((response) => {
						this.payrollVO = response.data;
                        this.carregando = false;
                        this.generatePDF();
					})
					.catch((error) => {
						console.log(error);
						this.carregando = false;
				});
			},
			data(dataRegister){
				return formatData(dataRegister);
			},
            generatePDF() {
                this.carregando = true;
                const { amount, dataRegister, payrollProducerList } = this.payrollVO; // Estrutura de dados fornecida

                // Crie um novo objeto jsPDF
                const doc = new jsPDF();

                // Defina as configurações de estilo
                const borderColor = "#000"; // Cor das bordas
                const borderWidth = 0.5; // Largura das bordas em milímetros
				
                // Defina o conteúdo do relatório
                doc.setFontSize(18);
				const titleText = 'MilkCoop - Folha de Pagamento';
				const titleWidth = doc.getStringUnitWidth(titleText) * 18 / doc.internal.scaleFactor;
				const pageWidth = doc.internal.pageSize.getWidth();

				// Calcule a posição X para centralizar o texto
				const centerX = (pageWidth - titleWidth) / 2;

				// Defina a posição Y para a primeira linha do título
				const startY = 10;

				// Escreva o texto centralizado
				doc.setFontSize(18);
				doc.text(titleText, centerX, startY);
				doc.setDrawColor(borderColor);
                doc.setLineWidth(borderWidth);
				doc.line(10, 20, 200, 20);
				doc.setFontSize(14);
                doc.text(`Total Folha de Pagamento: ${(formatCurrency(amount))}`, 10, 30);
                doc.text(`Data da Folha de Pagamento: ${this.data(dataRegister)}`, 10, 40);
				doc.line(10, 50, 200, 50);
				doc.setFontSize(12);
				const pageHeight = doc.internal.pageSize.getHeight();
				const addNewPage = () => {
					doc.addPage();
					doc.setFontSize(18);
					doc.text(titleText, centerX, startY);
					currentYPosition = 20; // Reiniciar a posição Y na nova página
					doc.setFontSize(12);
				};
				const hasEnoughSpace = (additionalHeight) => {
					return currentYPosition + additionalHeight < pageHeight - 20; // Leave some space at the bottom for safety
				};

                // Variáveis para controle de quebra de página
                let currentYPosition = 50;

                // Adicione os dados da lista de produtores
                payrollProducerList.forEach((payrollProducer) => {
					const producerHeight = 50 + payrollProducer.payrollProducerDeliveries.length * 10;
					if (!hasEnoughSpace(producerHeight)) {
						addNewPage(); // Criar nova página se não houver espaço suficiente
					}
                    const formatCPF = (cpf) => {
                        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                    }
                    const { amount, producer, payrollProducerDeliveries } = payrollProducer;
					doc.line(10, currentYPosition, 200, currentYPosition);
                    // Verifique se há espaço suficiente para as informações do produtor
                    doc.text(`Nome Produtor(a): ${producer.fullName}`, 10, currentYPosition + 10);
                    doc.text(`CPF: ${formatCPF(producer.cpf)}`, 10, currentYPosition + 20);
					doc.text(`Total do Produtor(a): ${(formatCurrency(amount))}`, 10, currentYPosition + 30);
					doc.text("Resumo:", 10, currentYPosition + 40);
                    let subYPosition = currentYPosition + 40;
					let entregas = 0, valoresLeite = 0, valoresEntrega= 0 ;
                    payrollProducerDeliveries.forEach((payrollProducerDelivery) => {
                        const { producerDelivery } = payrollProducerDelivery;
						entregas ++;
						valoresLeite += producerDelivery.product.price;
						valoresEntrega += producerDelivery.product.price * producerDelivery.quantity;
                    });
					doc.text("Quantidade de Entregas: " + entregas + " | " + "Preço Médio Leite: " + formatCurrency(valoresLeite/entregas) + " | " +"Preço Médio Entrega: "+ formatCurrency(valoresEntrega/entregas), 15, subYPosition+10);
                    // Desenhe uma linha inferior
                    const lineHeight = 40 + 10;

                    currentYPosition += lineHeight + 10; // Adicione um espaço entre os blocos de produtores
                });
				doc.line(10, currentYPosition, 200, currentYPosition);
                // Salve o PDF
                doc.save("folha_de_pagamento.pdf");
                this.carregando = false;
            },
			carregarPayroll(){
				this.carregando = true;
				findPayrollById(this.payrollVO.id)
					.then((response) => {
						this.payrollVO = response.data
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
            console.log("mounted", this.$route.params.payroll)
			if(this.payrollVO.id !== undefined){
				this.carregarPayroll();
			}
		},
	};
</script>
