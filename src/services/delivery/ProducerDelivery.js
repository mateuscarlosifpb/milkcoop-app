import  api from "../api.js";

export const salvar = (body) => {
	const url = "/producer-delivery/";
	return api.request({
		method: "post",
		url,
		data: body,
	});
};

export const buscarPorId = (id) => {
	const url = `/producer-delivery/${id}`;
	return api.request({
		method: "get",
		url,
	});
};
export const relatorio = () => {
	const url = "/producer-delivery/report";
	return api.request({
		method: "get",
		url,
	});
};
export const dashBoard = (body) => {
	const url = "/producer-delivery/dashBoard";
	return api.request({
		method: "post",
		data: body,
		url,
	});
};

export const buscarTodos = (filtro, page) => {
	const url = "/producer-delivery/findAll";
	return api.request({
		method: "post",
		url,
		data: filtro,
		params: { page },
	});
};
export const excluir = (id) => {
	const url = `/producer-delivery/${id}`;
	return api.request({
		method: "delete",
		url,
	});
};
