import axios from 'axios';
import {
  parseHeaderForLinks,
  loadMoreDataWhenScrolled,
  ICrudGetAction,
  ICrudGetAllAction,
  ICrudPutAction,
  ICrudDeleteAction,
} from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IEntry, defaultValue } from 'app/shared/model/entry.model';

export const ACTION_TYPES = {
  FETCH_ENTRY_LIST: 'entry/FETCH_ENTRY_LIST',
  FETCH_ENTRY: 'entry/FETCH_ENTRY',
  CREATE_ENTRY: 'entry/CREATE_ENTRY',
  UPDATE_ENTRY: 'entry/UPDATE_ENTRY',
  PARTIAL_UPDATE_ENTRY: 'entry/PARTIAL_UPDATE_ENTRY',
  DELETE_ENTRY: 'entry/DELETE_ENTRY',
  SET_BLOB: 'entry/SET_BLOB',
  RESET: 'entry/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IEntry>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type EntryState = Readonly<typeof initialState>;

// Reducer

export default (state: EntryState = initialState, action): EntryState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_ENTRY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_ENTRY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_ENTRY):
    case REQUEST(ACTION_TYPES.UPDATE_ENTRY):
    case REQUEST(ACTION_TYPES.DELETE_ENTRY):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_ENTRY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_ENTRY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_ENTRY):
    case FAILURE(ACTION_TYPES.CREATE_ENTRY):
    case FAILURE(ACTION_TYPES.UPDATE_ENTRY):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_ENTRY):
    case FAILURE(ACTION_TYPES.DELETE_ENTRY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_ENTRY_LIST): {
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    }
    case SUCCESS(ACTION_TYPES.FETCH_ENTRY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_ENTRY):
    case SUCCESS(ACTION_TYPES.UPDATE_ENTRY):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_ENTRY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_ENTRY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.SET_BLOB: {
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType,
        },
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/entries';

// Actions

export const getEntities: ICrudGetAllAction<IEntry> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_ENTRY_LIST,
    payload: axios.get<IEntry>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IEntry> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_ENTRY,
    payload: axios.get<IEntry>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IEntry> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_ENTRY,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const updateEntity: ICrudPutAction<IEntry> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_ENTRY,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IEntry> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_ENTRY,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IEntry> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_ENTRY,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType,
  },
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
