import { queryApplication } from '../services/application';

const ApplicationModel = {
  namespace: 'application',
  state: {
    list: [],
  },
  reducers: {
    restate(state, action) {
      return {
        ...state,
        list: action.payload 
      }
    },
  },
  effects: {
    *fetch({payload}, { call, put }) {
      const response = yield call(queryApplication,payload);
      yield put({
        type: 'restate',
        payload: response,
      });
    },
  },
};

export default ApplicationModel;
