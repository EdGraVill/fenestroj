import { connect } from 'react-redux';

import { IAction, IState } from '../@types';
import Fenestroj from './Fenestroj';

const FenestrojContainer = connect((state: IState) => ({
  fenestroj: state.fenestroj,
}), (dispatch: (action: IAction) => void) => ({
  factoryMode: () => dispatch({ type: 'FACTORY_MODE' }),
}))(Fenestroj);

export default FenestrojContainer;
