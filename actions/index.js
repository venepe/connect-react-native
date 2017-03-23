/**
 * @flow
 */

 import { ON_CAPTURE, RESET  } from '../constants/BluetoothTypes';

export const reset = () => {
  return {
    type: RESET,
  };
}

export const onCapture = payload => {
  return {
    type: ON_CAPTURE,
    ...payload
  };
}

const actions = {
  reset,
  onCapture,
}

export default actions;
