<template>
	<div>
		<v-text-field
			v-model="dado"
			:label="label"
			prefix="R$"
			:readonly=$vuetify.theme.themes.light.designs.inputs.tipos.readonly
			:disabled=disabled
			:outlined=$vuetify.theme.themes.light.designs.inputs.tipos.outlined
			:clearable=$vuetify.theme.themes.light.designs.inputs.tipos.clearable
			placeholder=" "
			:dense=$vuetify.theme.themes.light.designs.inputs.tipos.dense
			:rounded=$vuetify.theme.themes.light.designs.inputs.tipos.rounded
			:shaped=$vuetify.theme.themes.light.designs.inputs.tipos.shaped
			locale="pt-BR"
			length=11
			precision=2
			:empty=null
			/>
	</div>
</template>

<script>

	export default {
		props: ["value", "state", "label", "isRequired", "disabled"],
		name: "CampoValor",

		data(){
			return {
				dado: this.value,
			};
		},

		watch: {
			dado(valor){
				this.$emit("input", valor);
			},
			value(){
				this.dado = this.value;
			},
		},
	};
</script>

<style></style>
