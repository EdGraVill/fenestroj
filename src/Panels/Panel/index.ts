import * as React from 'react';

import PanelContainer, { ButtonsContainer } from './container';
import panelsReducer from './panelsReducer';

export default PanelContainer;

export const PanelContext = React.createContext('');

export const Buttons = ButtonsContainer;

export const panels = panelsReducer;
