export interface IIcon {
  id: string;
  title: string;
}

export interface IPanel {
  id: string;
  title: string;
  active: boolean;
  maximized: boolean;
  minimized: boolean;
  position: number;
  resizing: boolean;
  moving: boolean;
  top: number | string;
  left: number | string;
  height: number | string;
  width: number | string;
  icon: IIcon;
}

export interface IState {
  panels: IPanel[];
}

export interface IAction {
  type: string;
  payload?: any;
}

export interface IAddPanelParam {
  id: string,
  title: string,
  left: string | number,
  top: string | number,
  height: string | number,
  width: string | number,
}

export interface IMovePanelParam {
  id: string;
  left: number;
  top: number;
}

export interface IResizePanelParam {
  id: string;
  height: number;
  width: number;
}

export interface IPanelActions {
  addPanel: (param: IAddPanelParam) => void;
  movePanel: (param: IMovePanelParam) => void;
  moveToTop: (id: string) => void;
  removePanel: (id: string) => void;
  resizePanel: (resizePanelParam: IResizePanelParam) => void;
  startMoving: (id: string) => void;
  startResizing: (id: string) => void;
  stopMoving: (id: string) => void;
  stopResizing: (id: string) => void;
  toggleMinimized: (id: string) => void;
  toggleMaximized: (id: string) => void;
}
