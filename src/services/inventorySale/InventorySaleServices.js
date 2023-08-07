import  api from "../api.js";

export const createInventorySale = (body) => {
	const url = "/inventory-sale/";
	return api.request({
		method: "post",
		url,
		data: body,
	});
};

export const findInventorySaleById = (id) => {
	const url = `/inventory-sale/${id}`;
	return api.request({
		method: "get",
		url,
	});
};

export const findInventorySale = (filtro, page) => {
	const url = "/inventory-sale/findAll";
	return api.request({
		method: "post",
		url,
		data: filtro,
		params: { page },
	});
};
export const deleteInventorySale = (id) => {
	const url = `/inventory-sale/${id}`;
	return api.request({
		method: "delete",
		url,
	});
};
