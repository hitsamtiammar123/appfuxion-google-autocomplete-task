import { ADD_PLACE, REMOVE_PLACE } from '../constant/map-save-place';

export const addPlace = (payload) => ({
  type: ADD_PLACE,
  payload,
});

export const removePlace = (payload) => ({
  type: REMOVE_PLACE,
  payload,
});
