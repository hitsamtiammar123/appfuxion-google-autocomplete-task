import { ADD_PLACE, REMOVE_PLACE } from '../constant/map-save-place';

export const addPlace = (payload) => ({
  type: ADD_PLACE,
  payload,
});

export const removePlace = (payload) => ({
  type: REMOVE_PLACE,
  payload,
});

export const tooglePlace = (payload) => {
  return (dispatch, getState) => {
    if (!payload) {
      return;
    }
    const { mapsaveplace } = getState();
    const savePlaces = mapsaveplace.savedPlaces;

    if (savePlaces.findIndex((item) => item.id === payload.id) !== -1) {
      dispatch(removePlace(payload));
    } else {
      dispatch(addPlace(payload));
    }
  };
};
