<template>
	<ViewWrapper
		:listaNavegacao="listaNavegacao"
		>
		<template #titulo>
			Cadastrar Lançamento Produtor
		</template>
		<CardDefaut>
			<v-form>
				<v-container>
					<v-row>
						<v-col
							align="start"
							cols="12"
							lg="12"
							>
							<h6><b>Data da Entrega</b></h6>
							<InputGroup
                                v-model="producerDelivery.dataRegister"
                                type="date"
								label="Digíte a data da entrega"
								/>
						</v-col>
					</v-row>
                    <v-row>
						<v-col
							align="start"
							cols="12"
							lg="12"
							>
							<h6><b>Quantidade</b></h6>
							<CampoValor
                                v-model="producerDelivery.quantity"
								label="Digíte a quantidade de produto"
								/>
						</v-col>
					</v-row>

					<v-row>
						<v-col
							cols="12"
							lg="4">
							<ButtonDefaut
								@click="adicionarProducerDelivery()"
								texto="Salvar"
								icone="mdi-content-save"
								cor="tema"
								:loading="carregando"
								/>
						</v-col>
					</v-row>
				</v-container>
			</v-form>
		</CardDefaut>
	</ViewWrapper>
</template>

<script>

	import InputGroup from "@/components/inputs/InputGroup.vue";
	import CampoValor from "../../components/forms/CampoValor.vue"
	import ButtonDefaut from "@/components/atoms/ButtonDefaut.vue";
	import ViewWrapper from "@/components/wrapper/ViewWrapper.vue";
	import CardDefaut from "../../components/atoms/CardDefaut.vue";
	import moment from 'moment';
	import {salvar} from "../../services/delivery/ProducerDelivery.js"

	export default {
		name: "RegisterProducerDelivery",
		components: {
			InputGroup,
			ButtonDefaut,
			CardDefaut,
			ViewWrapper,
			CampoValor,
		},
		data(){
			return {
				carregando: false,
				listaNavegacao: [
					{ text: "Início", to: "/homeDash" },
					{ text: "Lançamentos Produtor", to: "/searchProducerDelivery" },
					{ text: "Cadastrar Lançamento", to: "/registerProducerDelivery" },
				],
                producerDelivery: {
                    id: this.$route.query.id || undefined,
                    dataRegister: "",
                    producer: {
                        id: this.$route.query.idProducer || undefined,
                    },
                    product: {
                        id: undefined,
                    },
                    quantity: null,
                }
		
			};
		},
		methods: {
			irParaLancamentosProdutor(id){
				let nome = "SearchProducerDelivery";
				this.$router
					.push({ name: nome, query: { idProducer: id } })
					.catch(() => {});
			},
			adicionarProducerDelivery(){
				this.carregando = true;
				const localDate = moment(this.producerDelivery.dataRegister, 'YYYY-MM-DD').toDate();
				this.producerDelivery.dataRegister = localDate;
				salvar(this.producerDelivery)
					.then(() => {
						console.log("Lançamento salvo com sucesso!");
						this.irParaLancamentosProdutor(this.producerDelivery.producer.id)		
					})
					.catch((error) => {
						console.log(error);
					})
					.finally(() => {
						this.carregando = false;
					});
			},
		},
	};
</script>
