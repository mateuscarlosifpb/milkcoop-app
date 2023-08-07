<template>
	<ViewWrapper
		:listaNavegacao="listaNavegacao"
		>
		<template #titulo>
			Cadastrar Produtor
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
							<h6><b>CPF</b></h6>
							<InputGroup
                                v-model="producerVO.cpf"
								label="Digíte o CPF do produtor"
								:tamCampo="100"
								/>
						</v-col>
					</v-row>
                    <v-row>
						<v-col
							align="start"
							cols="12"
							lg="12"
							>
							<h6><b>Nome Completo</b></h6>
							<InputGroup
                                v-model="producerVO.fullName"
								label="Digíte o nome do produtor"
								:tamCampo="100"
								/>
						</v-col>
					</v-row>
                    <v-row>
						<v-col
							align="start"
							cols="12"
							lg="12"
							>
							<h6><b>Telefone</b></h6>
							<InputGroup
                                v-model="producerVO.telephone"
								label="Digíte o telefone do produtor"
								:tamCampo="100"
								/>
						</v-col>
					</v-row>
					<v-row>
                        <v-col
							align="start"
							cols="7"
							lg="7"
							>
							<h6><b>Rua</b></h6>
							<InputGroup
                                v-model="producerVO.addressVO.street"
								label="Digíte a rua do produtor"
								:tamCampo="100"
								/>
						</v-col>
						<v-col
							align="start"
							cols="2"
							lg="2"
							>
							<h6><b>Numero</b></h6>
							<InputGroup
                                v-model="producerVO.addressVO.number"
								label="Digíte o cep do produtor"
								:tamCampo="100"
								/>
						</v-col>
						<v-col
							align="start"
							cols="3"
							lg="3"
							>
							<h6><b>CEP</b></h6>
							<InputGroup
                                v-model="producerVO.addressVO.cep"
								label="Digíte o cep do produtor"
								:tamCampo="100"
								/>
						</v-col>
					</v-row>
                    <v-row>
						<v-col
							align="start"
							cols="3"
							lg="3"
							>
							<h6><b>Cidade</b></h6>
							<InputGroup
                                v-model="producerVO.addressVO.city"
								label="Digíte a cidade do produtor"
								:tamCampo="100"
								/>
						</v-col>
                        <v-col
							align="start"
							cols="3"
							lg="3"
							>
							<h6><b>Estado</b></h6>
							<InputGroup
                                v-model="producerVO.addressVO.state"
								label="Digíte o estado do produtor"
								:tamCampo="100"
								/>
						</v-col>
					</v-row>

					<v-row>
						<v-col
							cols="12"
							lg="4">
							<ButtonDefaut
								:loading="carregando"
								@click="adicionarProducer"
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
	import ButtonDefaut from "@/components/atoms/ButtonDefaut.vue";
	import ViewWrapper from "@/components/wrapper/ViewWrapper.vue";
	import CardDefaut from "../../components/atoms/CardDefaut.vue";
	import { buscarPorId, salvar } from "@/services/ProducerService";

	export default {
		name: "RegisterProducer",
		components: {
			InputGroup,
			ButtonDefaut,
			CardDefaut,
			ViewWrapper,
		},
		data(){
			return {
				listaNavegacao: [
					{ text: "Início", to: "/homeDash" },
					{ text: "Pesquisar Produtor", to: "/searchProducer" },
					{ text: "Cadastrar Produtor", to: "/registerProducer" },
				],
				carregando: false,
                producerVO: {
                    id: this.$route.query.id || undefined,
                    cpf: "",
                    fullName: "",
                    addressVO: {
                        street: "",
                        number: "",
                        cep: "",
                        city: "",
                        state: "",
                    },
                    telephone: "",
                }
		
			};
		},
		methods: {
			adicionarProducer(){
				this.carregando = true;
				salvar(this.producerVO)
					.then(() => {
						console.log("Produtor salvo com sucesso!");
						this.$router.push("/searchProducer");
					})
					.catch((error) => {
						console.log(error);
					})
					.finally(() => {
						this.carregando = false;
					});
			},
			carregarProdutor(){
				this.carregando = true;
				buscarPorId(this.producerVO.id)
					.then((response) => {
						const res = response.data;
						console.log(response.data)
						this.producerVO= {
							id: res.id,
							cpf: res.cpf,
							fullName: res.fullName,
							addressVO: {
								street: res.address.street,
								number: res.address.number,
								cep: res.address.cep,
								city: res.address.city,
								state: res.address.state,
							},
							telephone: res.telephone,
						}
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
			if(this.producerVO.id !== undefined){
				this.carregarProdutor();
			}
		},
	};
</script>
