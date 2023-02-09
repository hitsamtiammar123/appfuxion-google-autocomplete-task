import { SET_SEARCH_RESULT } from '../constant/map-search';

const initialStates = {
  searchResult: null,
  type: '',
};

function reducer(states = initialStates, action) {
  const { type, payload } = action;

  const actions = {
    [SET_SEARCH_RESULT]: () => ({
      ...states,
      searchResult: payload,
      type,
    }),
  };

  return actions[type] ? actions[type]() : states;
}

export default reducer;
