import { IAction, IAddPanelParam, IMovePanelParam, IResizePanelParam } from '../@types';

export const addPanel = (addPanelParam: IAddPanelParam): IAction => ({
  payload: addPanelParam,
  type: 'ADD_PANEL',
});

export const movePanel = (movePanelParam: IMovePanelParam): IAction => ({
  payload: movePanelParam,
  type: 'MOVE_PANEL',
});

export const moveToTop = (id: string): IAction => ({
  payload: id,
  type: 'MOVE_PANEL_TO_TOP',
});

export const removePanel = (id: string): IAction => ({
  payload: id,
  type: 'REMOVE_PANEL',
});

export const resizePanel = (resizePanelParam: IResizePanelParam): IAction => ({
  payload: resizePanelParam,
  type: 'RESIZE_PANEL',
});

export const startMoving = (id: string): IAction => ({
  payload: id,
  type: 'START_MOVING_PANEL',
});

export const startResizing = (id: string): IAction => ({
  payload: id,
  type: 'START_RESIZING_PANEL',
});

export const stopMoving = (id: string): IAction => ({
  payload: id,
  type: 'STOP_MOVING_PANEL',
});

export const stopResizing = (id: string): IAction => ({
  payload: id,
  type: 'STOP_RESIZING_PANEL',
});

export const togglePanel = (id: string): IAction => ({
  payload: id,
  type: 'TOGGLE_PANEL',
});
