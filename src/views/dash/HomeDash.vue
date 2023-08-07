<template>
  <ViewWrapper
		:listaNavegacao="listaNavegacao"
		>
		<template #titulo>
			Início
		</template>
    <CardDefaut>
      <v-container>
        <ButtonDefaut
							texto="Download Folha de Pagamento"
							cor="secundaria"
							icone="mdi-download"
							@click="gerar()"
							:block="$vuetify.breakpoint.mdAndDown"
							/>
        <DashProducerDelivery
          :totalProduzido="totalProduzido"
          :totalNoAno="totalNoAno"
          :totalNoMes="totalNoMes"
          :totalParaReceber="totalParaReceber"
          :totalRecebidoNoAno="totalRecebidoNoAno"
          :totalEmProcessamento="totalEmProcessamento"
        />
      </v-container>
    </CardDefaut>
  </ViewWrapper>
</template>
  
  <script>
    import { dashBoard, relatorio } from "@/services/delivery/ProducerDelivery.js";
    import DashProducerDelivery from "../../components/forms/DashProducerDelivery.vue";
    import CardDefaut from "@/components/atoms/CardDefaut.vue";
    import ViewWrapper from "@/components/wrapper/ViewWrapper.vue";
    import jsPDF from 'jspdf';
    import 'jspdf-autotable';
    import ButtonDefaut from "@/components/atoms/ButtonDefaut.vue";
    import { formatCurrency } from "../../utils/moeda.js"

  export default {
    name: "HomeDash",
    components: {
        DashProducerDelivery,
        CardDefaut,
        ViewWrapper,
        ButtonDefaut,
    },
    data() {
      return {
        listaNavegacao: [
					{ text: "Início", to: "/homeDash" },
				],
        totalProduzido:null,
        totalNoAno:null,
        totalNoMes:null,
        totalParaReceber:null,
        totalRecebidoNoAno:null,
        totalEmProcessamento:null,
        producerWithHighestGrowth:null,
        producerWithHighestProduction: null,
        totalDaProducao: null,
        totalDeEntregas: null, 
        totalRelatorioPendente: null,
        totalRelatorioConcluido: null,
        totalRelatorioProcessamento:null,
        paymentByStatus: null,
      };
    },
    methods:{
      gerar(){
        relatorio().then((response) => {
            const res = response.data;
            console.log("22", res)
            this.producerWithHighestGrowth = res["producerWithHighestGrowth"];
            this.producerWithHighestProduction = res["producerWithHighestProduction"];
            this.totalDaProducao =  res["totalDaProducao"];
            this.totalDeEntregas =res["totalDeEntregas"];
            this.paymentByStatus = res["paymentByStatus"];
            this.totalRelatorioPendente=res["paymentByStatus.PAGAMENTO_CONCLUIDO"];
            this.totalRelatorioConcluido=res["paymentByStatus.PAGAMENTO_CONCLUIDO"];
            this.totalRelatorioProcessamento=res["paymentByStatus.PAGAMENTO_EM_PROCESSAMENTO"];
            this.generatePDF();
					})
					.catch((error) => {
						console.log(error);
					});
      },
      generatePDF() {
        // Crie um novo objeto jsPDF
        const doc = new jsPDF();

        // Defina as configurações de estilo
        const fontSize = 14;
        const lineHeight = 8;
        const marginLeft = 20;
        const marginTop = 30;
        const titleFontSize = 16;

        // Defina o conteúdo do relatório
        doc.setFontSize(titleFontSize);

        // Centralize o título principal
        const titleText = "Relatório Mensal de Produção da MilkCoop";
        const titleWidth = doc.getStringUnitWidth(titleText) * titleFontSize / doc.internal.scaleFactor;
        const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
        doc.text(titleText, titleX, marginTop);

        // Linha após o título principal
        const lineStartX = marginLeft;
        const lineEndX = 180;
        const lineWidth = 0.5;
        const lineY = marginTop + 1.5 * lineHeight;
        doc.setLineWidth(lineWidth);
        doc.line(lineStartX, lineY, lineEndX, lineY);

        // Título: Produtor com Maior Produção
        doc.setFontSize(fontSize);
        doc.text(`Total de Produção no Mês: ${this.totalDaProducao} Litros`, marginLeft, lineY + lineHeight);
        doc.text(`Total de Entregas no Mês: ${this.totalDeEntregas} Entregas`, marginLeft, lineY + 2 * lineHeight);

        // Linha após a seção Produtor com Maior Produção
        const lineY2 = lineY + 3 * lineHeight;
        doc.line(lineStartX, lineY2, lineEndX, lineY2);

        // Título: Total de Produção e Entregas

        doc.text("Produtor com Maior Produção:", marginLeft, lineY2 + 1 * lineHeight);
        doc.text(`Nome do Produtor(a): ${this.producerWithHighestProduction.nome}`, marginLeft, lineY2 + 2 * lineHeight);
        doc.text(`Quantidade Produzida: ${this.producerWithHighestProduction.valor} Litros`, marginLeft, lineY2 + 3 * lineHeight);
       

        // Linha após a seção Total de Produção e Entregas
        const lineY3 = lineY2 + 4 * lineHeight;
        doc.line(lineStartX, lineY3, lineEndX, lineY3);

        // Título: Produtor com Maior Crescimento/Redução
        const titleText2 = "Produtor com Maior Crescimento/Redução:";
        doc.text(titleText2, marginLeft, lineY3 + 1 * lineHeight);
        doc.text(`Nome do Produtor(a): ${this.producerWithHighestGrowth.producerName}`, marginLeft, lineY3 + 2 * lineHeight);
        doc.text(`Crescimento/Redução Percentual: ${this.producerWithHighestGrowth.growthPercentage.toFixed(2)}%`, marginLeft, lineY3 + 3 * lineHeight);

        // Linha após a seção Produtor com Maior Crescimento/Redução
        const lineY4 = lineY3 + 4 * lineHeight;
        doc.line(lineStartX, lineY4, lineEndX, lineY4);

        // Informações sobre os pagamentos
        doc.text(`Pagamentos:`, marginLeft, lineY4 + lineHeight);
        doc.text(`Concluído: ${formatCurrency(this.paymentByStatus.PAGAMENTO_CONCLUIDO)}`, marginLeft, lineY4 + 2 * lineHeight);
        doc.text(`Em Processamento: ${formatCurrency(this.paymentByStatus.PAGAMENTO_EM_PROCESSAMENTO)}`, marginLeft, lineY4 + 3 * lineHeight);
        doc.text(`Pendente: ${formatCurrency(this.paymentByStatus.PAGAMENTO_PENDENTE)}`, marginLeft, lineY4 + 4 * lineHeight);

        // Linha após a seção de pagamentos
        const lineY5 = lineY4 + 5 * lineHeight;
        doc.line(lineStartX, lineY5, lineEndX, lineY5);

        // Nome da MilkCoop
        const milkCoopNameFontSize = 18;
        doc.setFontSize(milkCoopNameFontSize);
        const milkCoopNameWidth = doc.getStringUnitWidth("MilkCoop") * milkCoopNameFontSize / doc.internal.scaleFactor;
        const milkCoopNameX = (doc.internal.pageSize.width - milkCoopNameWidth) / 2;
        doc.text("MilkCoop", milkCoopNameX, lineY5 + 6 * lineHeight);

        // Salve o PDF
        doc.save("relatorio_milkcoop.pdf");
      },
      carregarDash(){
        const producerDeliveryVO = {
          producer: {
            id: null,
          },
        }
				dashBoard(producerDeliveryVO)
					.then((response) => {
						console.log(response.data);
            const res = response.data;
            this.totalProduzido=res.totalProduzido;
            this.totalNoAno=res.totalNoAno;
            this.totalNoMes=res.totalNoMes;
            this.totalParaReceber=res.totalParaReceber;
            this.totalRecebidoNoAno=res.totalRecebidoNoAno;
            this.totalEmProcessamento = res.totalEmProcessamento;
					})
					.catch((error) => {
						console.log(error);
					});
			},
    },
    mounted(){
      this.carregarDash();
    },
  };
  </script>
  
  <style>
  /* Se necessário, você pode adicionar estilos personalizados aqui */
  </style>