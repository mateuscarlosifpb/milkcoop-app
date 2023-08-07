import Vue from "vue";
import VueRouter from "vue-router";
import RegisterProducer from "../views/producer/RegisterProducer.vue";
import SearchProducer from "../views/producer/SearchProducer.vue";
import SearchProducerDelivery from "../views/delivery/SearchProducerDelivery.vue";
import RegisterProducerDelivery from "../views/delivery/RegisterProducerDelivery.vue";
import SearchProduct from "../views/product/SearchProduct.vue";
import RegisterProduct from "../views/product/RegisterProduct.vue";
import SearchInventorySale from "../views/inventorySale/SearchInventorySale.vue";
import HomeDash from "../views/dash/HomeDash.vue";
import SearchPayroll from "../views/payroll/SearchPayroll.vue"
import RegisterPayroll from "../views/payroll/RegisterPayroll.vue"


Vue.use(VueRouter);

const routes = [
	{ path: "/registerProducer", name: "RegisterProducer", component: RegisterProducer },
	{ path: "/searchProducer", name: "SearchProducer", component: SearchProducer },
	{ path: "/searchProducerDelivery", name: "SearchProducerDelivery", component: SearchProducerDelivery },
	{ path: "/registerProducerDelivery", name: "RegisterProducerDelivery", component: RegisterProducerDelivery },
	{ path: "/searchProduct", name: "SearchProduct", component: SearchProduct },
	{ path: "/registerProduct", name: "RegisterProduct", component: RegisterProduct },
	{ path: "/searchInventorySale", name: "SearchInventorySale", component: SearchInventorySale },
	{ path: "/homeDash", name: "HomeDash", component: HomeDash },
	{ path: "/searchPayroll", name: "SearchPayroll", component: SearchPayroll },
	{ path: "/registerPayroll", name: "RegisterPayroll", component: RegisterPayroll },

];	

const router = new VueRouter({
	mode: "history",
	base: "/milkcoop/",
	routes,
});

export default router;