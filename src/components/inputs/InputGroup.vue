<template>

	<v-text-field
		:label="label"
		v-if="!child"
		:state="state"
		v-bind="$attrs"
		v-model="dado"
		:disabled="disabled"
		@blur="emitBlurEvent"
		:regular="$vuetify.theme.themes.light.designs.inputs.tipos.regular"
		:solo="$vuetify.theme.themes.light.designs.inputs.tipos.solo"
		:solo-inverted="$vuetify.theme.themes.light.designs.inputs.tipos.soloInverted"
		:filled="$vuetify.theme.themes.light.designs.inputs.tipos.filled"
		:outlined="$vuetify.theme.themes.light.designs.inputs.tipos.outlined"
		:dense="$vuetify.theme.themes.light.designs.inputs.tipos.dense"
		:clearable="$vuetify.theme.themes.light.designs.inputs.tipos.clearable"
		:flat="$vuetify.theme.themes.light.designs.inputs.tipos.flat"
		:full-width="$vuetify.theme.themes.light.designs.inputs.tipos.fullWidth"
		:persistent-hint="$vuetify.theme.themes.light.designs.inputs.tipos.persistentHint"
		:persistent-placeholder="$vuetify.theme.themes.light.designs.inputs.tipos.persistentPlaceholder"
		:readonly="$vuetify.theme.themes.light.designs.inputs.tipos.readonly"
		:reverse="$vuetify.theme.themes.light.designs.inputs.tipos.reverse"
		:rounded="$vuetify.theme.themes.light.designs.inputs.tipos.rounded"
		:shaped="$vuetify.theme.themes.light.designs.inputs.tipos.shaped"
		:single-line="$vuetify.theme.themes.light.designs.inputs.tipos.singleLine"
		/>

</template>

<script>
	export default {
		name: "InputGroup",
		props: {
			state: {
				required: false,
				default: "",
			},
			value: {
				required: true,
			},
			label: {
				default: "",
			},
			invalidFeedback: {
				default: "",
			},
			child: {
				default: "",
			},
			tamCampo: {
				default: 250,
				type: Number,
			},
			disabled: {
				default: false,
				type: Boolean,
			},
			isRequired: {
				default: true,
				type: Boolean,
			},
		},
		data(){
			return {
				dado: this.value,
			};
		},
		watch: {
			dado(){
				this.$emit("input", this.dado);
			},
			value(){
				this.dado = this.value;
			},
		},
		methods: {
			emitBlurEvent(){
				if(this.dado){
					this.$emit("input", this.dado.trim());
				}
				this.$emit("blur");
			},
		},
	};
</script>
