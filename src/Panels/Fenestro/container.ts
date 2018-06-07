import { connect } from 'react-redux';

import { IAction, IAddFenestroParam, IMoveFenestroParam, IResizeFenestroParam, IState } from '../@types';
import Buttons from './Buttons';
import Fenestro from './Fenestro';
import {
  addFenestro,
  moveFenestro,
  moveToTop,
  removeFenestro,
  resizeFenestro,
  startMoving,
  startResizing,
  stopMoving,
  stopResizing,
  toggleMaximized,
  toggleMinimized,
} from './fenestrojActions';

const FenestroContainer = connect((state: IState) => ({
  fenestroj: state.fenestroj,
}), (dispatch: (action: IAction) => void) => ({
  addFenestro: (addFenestroParam: IAddFenestroParam) => dispatch(addFenestro(addFenestroParam)),
  moveFenestro: (moveFenestroParam: IMoveFenestroParam) =>
    dispatch(moveFenestro(moveFenestroParam)),
  moveToTop: (id: string) => dispatch(moveToTop(id)),
  removeFenestro: (id: string) => dispatch(removeFenestro(id)),
  resizeFenestro: (resizeFenestroParam: IResizeFenestroParam) =>
    dispatch(resizeFenestro(resizeFenestroParam)),
  startMoving: (id: string) => dispatch(startMoving(id)),
  startResizing: (id: string) => dispatch(startResizing(id)),
  stopMoving: (id: string) => dispatch(stopMoving(id)),
  stopResizing: (id: string) => dispatch(stopResizing(id)),
  toggleMaximized: (id: string) => dispatch(toggleMaximized(id)),
  toggleMinimized: (id: string) => dispatch(toggleMinimized(id)),
}))(Fenestro);

export default FenestroContainer;

export const ButtonsContainer = connect(undefined, (dispatch: (action: IAction) => void) => ({
  toggleMaximized: (id: string) => dispatch(toggleMaximized(id)),
  toggleMinimized: (id: string) => dispatch(toggleMinimized(id)),
}))(Buttons);
