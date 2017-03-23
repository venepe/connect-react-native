/**
 * @flow
 */

import { RESET, ON_CAPTURE } from '../constants/BluetoothTypes';

const initialState = {
  peripheralId: null,
  serviceUUID: null,
  characteristicUUID: null,
};

const bluetooth = (state = initialState, action) => {
  switch (action.type) {
  case RESET:
  return Object.assign({}, state, {
    peripheralId: null,
    serviceUUID: null,
    characteristicUUID: null,
  });
  case ON_CAPTURE:
  return Object.assign({}, state, {...action.payload});
  default:
    return state;
  }
}

export const getBluetoothConnection = state => { return state };

export default bluetooth;
