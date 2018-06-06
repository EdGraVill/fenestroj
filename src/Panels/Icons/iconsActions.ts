import { IAction } from '../@types';

export const addIconRef = (ref: HTMLButtonElement, id: string): IAction => ({
  payload: { ref, id },
  type: 'ADD_ICON_REF',
});

export const toggleMinimized = (id: string): IAction => ({
  payload: id,
  type: 'TOGGLE_MINIMIZED',
});
