import { ADD_PLACE, REMOVE_PLACE } from '../constant/map-save-place';

const initialStates = {
  savedPlaces: [],
  type: '',
}

function reducer(states = initialStates, action){
  const { type, payload } = action;

  const actions = {
    [ADD_PLACE]: () => ({
      ...states,
      savedPlaces: [...states.savedPlaces, payload],
      type
    }),
    [REMOVE_PLACE]: () => ({
      ...states,
      savedPlaces: states.savedPlaces.filter(
        item => item.id !== payload.id
      ),
      type,
    })
  }

  return actions[type] ? actions[type]() : states;
}

export default reducer;
