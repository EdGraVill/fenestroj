import * as React from 'react';

import FenestroContainer, { ButtonsContainer } from './container';
import fenestrojReducer from './fenestrojReducer';

export default FenestroContainer;

export const FenestroContext = React.createContext('');

export const Buttons = ButtonsContainer;

export const fenestroj = fenestrojReducer;
