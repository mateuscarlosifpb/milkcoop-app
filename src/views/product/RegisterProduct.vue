<template>
	<ViewWrapper
		:listaNavegacao="listaNavegacao"
		>
		<template #titulo>
			Cadastrar Produto
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
							<h6><b>Nome</b></h6>
							<InputGroup
								:disabled="true"
                                v-model="productVO.productName"
								label="Digíte o nome do produto"
								/>
						</v-col>
					</v-row>
                    <v-row>
						<v-col
							align="start"
							cols="12"
							lg="12"
							>
							<h6><b>Data</b></h6>
							<InputGroup
                                v-model="dataRegister"
                                type="date"
								/>
						</v-col>
					</v-row>
                    <v-row>
						<v-col
							align="start"
							cols="12"
							lg="12"
							>
							<h6><b>Preço</b></h6>
							<CampoValor
                                v-model="productVO.price"
								label="Digíte o preço do produto"
								/>
						</v-col>
					</v-row>
					<v-row>
						<v-col
							cols="12"
							lg="4">
							<ButtonDefaut
								@click="adicionarProduct"
								texto="Salvar"
								icone="mdi-content-save"
								cor="tema"
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
	import CampoValor from "../../components/forms/CampoValor.vue";
	import ButtonDefaut from "@/components/atoms/ButtonDefaut.vue";
	import ViewWrapper from "@/components/wrapper/ViewWrapper.vue";
	import CardDefaut from "../../components/atoms/CardDefaut.vue";
	import {  salvar,buscarPorId } from "../../services/product/ProductService.js"
	import moment from 'moment';

	export default {
		name: "RegisterProduct",
		components: {
			InputGroup,
			CampoValor,
			ButtonDefaut,
			CardDefaut,
			ViewWrapper,
		},
		data(){
			return {
				listaNavegacao: [
					{ text: "Início", to: "/homeDash" },
					{ text: "Pesquisar Produto", to: "/searchProduct" },
					{ text: "Cadastrar Produto", to: "/registerProduct" },
				],
				dataRegister:"",
                productVO: {
                    id: this.$route.query.id || undefined,
					quantity: 0,
                    productName: "LEITE",
                    price: "",
                    dataRegister: null,
                }
		
			};
		},
		methods: {
			adicionarProduct(){
				this.carregando = true;
				const localDate = moment(this.dataRegister, 'YYYY-MM-DD').toDate();
				this.productVO.dataRegister = localDate;
				salvar(this.productVO)
					.then(() => {
						console.log("Produto salvo com sucesso!");
						this.$router.push("/searchProduct");
					})
					.catch((error) => {
						console.log(error);
					})
					.finally(() => {
						this.carregando = false;
					});
			},
			carregarProduct(){
				this.carregando = true;
				buscarPorId(this.productVO.id)
					.then((response) => {
						const res = response.data;
						console.log(res);
						this.productVO = {
							id: res.id,
							productName: res.productName,
							price: res.price,
							dataRegister: res.dataRegister,
						};
						this.dataRegister= res.dataRegister;
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
			if(this.productVO.id !== undefined){
				this.carregarProduct();
			}
		},
	};
</script>
