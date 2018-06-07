export interface IIcon {
  src?: string;
  title: string;
  ref: HTMLButtonElement;
}

export interface IFenestro {
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
  fenestroj: IFenestro[];
}

export interface IAction {
  type: string;
  payload?: any;
}

export interface IAddFenestroParam {
  icon?: string,
  iconTitle?: string,
  id: string,
  title: string,
  left: string | number,
  top: string | number,
  height: string | number,
  width: string | number,
}

export interface IMoveFenestroParam {
  id: string;
  left: number;
  top: number;
}

export interface IResizeFenestroParam {
  id: string;
  height: number;
  width: number;
}

export interface IFenestroActions {
  addFenestro: (param: IAddFenestroParam) => void;
  moveFenestro: (param: IMoveFenestroParam) => void;
  moveToTop: (id: string) => void;
  removeFenestro: (id: string) => void;
  resizeFenestro: (resizeFenestroParam: IResizeFenestroParam) => void;
  startMoving: (id: string) => void;
  startResizing: (id: string) => void;
  stopMoving: (id: string) => void;
  stopResizing: (id: string) => void;
  toggleMinimized: (id: string) => void;
  toggleMaximized: (id: string) => void;
}
