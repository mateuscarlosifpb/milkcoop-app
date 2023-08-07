import  api from "./api.js";

export const salvar = (body) => {
	const url = "/producer/";
	return api.request({
		method: "post",
		url,
		data: body,
	});
};

export const buscarPorId = (id) => {
	const url = `/producer/${id}`;
	return api.request({
		method: "get",
		url,
	});
};

export const buscarTodos = (filtro, page) => {
	const url = "/producer/findAll";
	return api.request({
		method: "post",
		url,
		data: filtro,
		params: { page },
	});
};