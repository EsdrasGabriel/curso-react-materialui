import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface ICitiesListing {
  id: number;
  nome: number;
}
export interface ICitiesDetail {
  id: number;
  nome: string;
}
type TPeopleWithTotalCount = {
  data: ICitiesListing[];
  totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TPeopleWithTotalCount | Error> => {
  try {
    const urlRelativa = `/cidades?_page=${page}&_limit=${Environment.ROW_LIMIT}&nome_like=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.ROW_LIMIT),
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (err) {
    console.error(err);
    return new Error((err as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getById = async (id: number): Promise<ICitiesDetail | Error> => {
  try {
    const { data } = await Api.get(`/cidades/${id}`);

    if (data) return data;

    return new Error('Erro ao consultar o registro.');
  } catch (err) {
    console.error(err);
    return new Error((err as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<ICitiesDetail, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await Api.post<ICitiesDetail>('/cidades', dados);

    if (data) return data.id;

    return new Error('Erro ao criar o registro.');
  } catch (err) {
    console.error(err);
    return new Error((err as { message: string }).message || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: number, dados: ICitiesDetail): Promise<void | Error> => {
  try {
    await Api.put(`/cidades/${id}`, dados);
  } catch (err) {
    console.error(err);
    return new Error((err as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/cidades/${id}`);
  } catch (err) {
    console.error(err);
    return new Error((err as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

export const CidadesService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};