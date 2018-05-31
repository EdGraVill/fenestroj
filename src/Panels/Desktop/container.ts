import { connect } from 'react-redux';

import { IAction, IState } from '../@types';
import Desktop from './Desktop';

const DesktopContainer = connect((state: IState) => ({
  panels: state.panels,
}), (dispatch: (action: IAction) => void) => ({
  factoryMode: () => dispatch({ type: 'FACTORY_MODE' }),
}))(Desktop);

export default DesktopContainer;
