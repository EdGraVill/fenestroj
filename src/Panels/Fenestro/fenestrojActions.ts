import { IAction, IAddFenestroParam, IMoveFenestroParam, IResizeFenestroParam } from '../@types';

export const addFenestro = (addFenestroParam: IAddFenestroParam): IAction => ({
  payload: addFenestroParam,
  type: 'ADD_FENESTRO',
});

export const moveFenestro = (moveFenestroParam: IMoveFenestroParam): IAction => ({
  payload: moveFenestroParam,
  type: 'MOVE_FENESTRO',
});

export const moveToTop = (id: string): IAction => ({
  payload: id,
  type: 'MOVE_FENESTRO_TO_TOP',
});

export const removeFenestro = (id: string): IAction => ({
  payload: id,
  type: 'REMOVE_FENESTRO',
});

export const resizeFenestro = (resizeFenestroParam: IResizeFenestroParam): IAction => ({
  payload: resizeFenestroParam,
  type: 'RESIZE_FENESTRO',
});

export const startMoving = (id: string): IAction => ({
  payload: id,
  type: 'START_MOVING_FENESTRO',
});

export const startResizing = (id: string): IAction => ({
  payload: id,
  type: 'START_RESIZING_FENESTRO',
});

export const stopMoving = (id: string): IAction => ({
  payload: id,
  type: 'STOP_MOVING_FENESTRO',
});

export const stopResizing = (id: string): IAction => ({
  payload: id,
  type: 'STOP_RESIZING_FENESTRO',
});

export const toggleMinimized = (id: string): IAction => ({
  payload: id,
  type: 'TOGGLE_MINIMIZED',
});

export const toggleMaximized = (id: string): IAction => ({
  payload: id,
  type: 'TOGGLE_MAXIMIZED',
});
