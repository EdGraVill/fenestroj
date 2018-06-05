import * as React from 'react';

import { PanelContext } from '.';
import { IPanelActions } from '../@types';
import './Buttons.css';

const Buttons = ({ toggleMinimized, toggleMaximized }: IPanelActions) => (
  <PanelContext.Consumer>
    {(id) => {
      const toggleMin = () => toggleMinimized(id);
      const toggleMax = () => toggleMaximized(id);

      return (
        <div className="panel__buttons">
          <button
            className="panel__button panel__button--minimize"
            onClick={toggleMin}
          >
            <span className="panel__buttonPlaceholder">
              _
            </span>
          </button>
          <button
            className="panel__button panel__button--maximize"
            onClick={toggleMax}
          >
            <span className="panel__buttonPlaceholder">
              ⛶
            </span>
          </button>
          <button className="panel__button panel__button--close">
            <span className="panel__buttonPlaceholder">
              x
            </span>
          </button>
        </div>
      );
    }}
  </PanelContext.Consumer>
);

export default Buttons;
