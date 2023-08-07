<template>
	<v-app class="tudo">
		<Sidebar/>
		<v-main
			:color="$vuetify.theme.dark == false? '#f8f9fe' : ''"
			>
			<router-view/>
		</v-main>
	</v-app>
</template>

<script>
	import Sidebar from "./components/organisms/Sidebar.vue";
	export default {
		components: {
      Sidebar,
		},
		data(){
			return {
				drawer: true,
				mini: true,
			};
		},
	};
</script>

<style>
  .tudo {
    height: 100%;
	width:100%;
  }
  .pagina {
    padding: 2rem 1.2rem 2rem 1.2rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 0.25rem;
  }
  ::-webkit-scrollbar {
		width: 0px;
		height: 5px;
	}

	::-webkit-scrollbar-thumb {
		background: var(--v-tema)!important;
		border-radius: 2px;
	}

	::-webkit-scrollbar-track {
		background: var(--v-tema)!important;
		border-radius: 2px;
	}
</style>
