import { connect } from 'react-redux';

import { IAction, IAddPanelParam, IMovePanelParam, IResizePanelParam, IState } from '../@types';
import Panel from './Panel';
import {
  addPanel,
  movePanel,
  moveToTop,
  removePanel,
  resizePanel,
  startMoving,
  startResizing,
  stopMoving,
  stopResizing,
  togglePanel,
} from './panelsActions';

const PanelContainer = connect((state: IState) => ({
  panels: state.panels,
}), (dispatch: (action: IAction) => void) => ({
  addPanel: (addPanelParam: IAddPanelParam) => dispatch(addPanel(addPanelParam)),
  movePanel: (movePanelParam: IMovePanelParam) => dispatch(movePanel(movePanelParam)),
  moveToTop: (id: string) => dispatch(moveToTop(id)),
  removePanel: (id: string) => dispatch(removePanel(id)),
  resizePanel: (resizePanelParam: IResizePanelParam) => dispatch(resizePanel(resizePanelParam)),
  startMoving: (id: string) => dispatch(startMoving(id)),
  startResizing: (id: string) => dispatch(startResizing(id)),
  stopMoving: (id: string) => dispatch(stopMoving(id)),
  stopResizing: (id: string) => dispatch(stopResizing(id)),
  togglePanel: (id: string) => dispatch(togglePanel(id)),
}))(Panel);

export default PanelContainer;
