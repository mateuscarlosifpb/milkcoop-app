export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(value);
};
export const formatCPF = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
export const formatTelefone = (telefone) => {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}
export const formatData = (data) => {
    const partes = data.split("-");
    const ano = partes[0];
    const mes = partes[1];
    const dia = partes[2];
    return `${dia}/${mes}/${ano}`; 
}