import  api from "../api.js";

export const createPayroll = (body) => {
	const url = "/payroll/";
	return api.request({
		method: "post",
		url,
		data: body,
	});
};

export const findPayrollById = (id) => {
	const url = `/payroll/${id}`;
	return api.request({
		method: "get",
		url,
	});
};

export const findPayroll = (filtro, page) => {
	const url = "/payroll/findAll";
	return api.request({
		method: "post",
		url,
		data: filtro,
		params: { page },
	});
};
export const deletePayroll = (id) => {
	const url = `/payroll/${id}`;
	return api.request({
		method: "delete",
		url,
	});
};
export const confirmPayment = (id) => {
	const url = `/payroll/confirmPayment/${id}`;
	return api.request({
		method: "put",
		url,
	});
};
export const generatePayroll = (persist) => {
	const url = "/payroll/generatePayroll";
	return api.request({
		method: "post",
		url,
		data: persist,
	});
};
export const generatePayrollPageable = (request, page) => {
	const url = "/payroll/generatePayrollPageable";
	return api.request({
		method: "post",
		url,
		data: request,
		params: { page },
	});
};
