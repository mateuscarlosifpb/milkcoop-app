<template>
  <v-container class="dashboard-container">
    <v-row justify="center">
      <v-col cols="12" md="4" v-for="item in items" :key="item.label">
        <v-card class="dashboard-item">
          <div class="dashboard-content">
            <div class="label">{{ item.label }}</div>
            <div class="value">{{ item.value }}</div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    totalProduzido: Number,
    totalNoAno: Number,
    totalNoMes: Number,
    totalParaReceber: Number,
    totalRecebidoNoAno: Number,
    totalEmProcessamento: Number,
  },
  computed: {
    items() {
      return [
        { label: "Total Produzido", value: this.totalProduzido+" Litros" },
        { label: "Total Produzido no Ano", value: this.totalNoAno+" Litros" },
        { label: "Total Produzido no Mês", value: this.totalNoMes+" Litros" },
        { label: "Pagamento Pendente", value: this.formatarMoeda(this.totalParaReceber)},
        { label: "Pagamento Concluído", value: this.formatarMoeda(this.totalRecebidoNoAno) },
        { label: "Pagamento Em Progresso", value: this.formatarMoeda(this.totalEmProcessamento) },
      ];
    },
  },
  methods: {
    formatarMoeda(value){
				return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(value);
    },
  },
};
</script>

<style>
/* Estilos CSS para o componente do dashboard */
.dashboard-container {
  padding: 20px;
  background-color: #2b2726;
}

.dashboard-item {
  background-color: #2b2726;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 20px;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  font-weight: bold;
}

.value {
  font-size: 24px;
}
</style>