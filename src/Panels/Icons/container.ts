import { connect } from 'react-redux';

import { IAction, IState } from '../@types';
import Icons from './Icons';
import { addIconRef, toggleMinimized } from './iconsActions';

export default connect((state: IState) => ({
  panels: state.panels,
}), (dispatch: (action: IAction) => void) => ({
  addIconRef: (ref: HTMLButtonElement, id: string) => dispatch(addIconRef(ref, id)),
  toggleMinimized: (id: string) => dispatch(toggleMinimized(id)),
}))(Icons);
