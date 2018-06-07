import * as React from 'react';

import { FenestroContext } from '.';
import { IFenestroActions } from '../@types';
import './Buttons.css';

const Buttons = ({ toggleMinimized, toggleMaximized }: IFenestroActions) => (
  <FenestroContext.Consumer>
    {(id) => {
      const toggleMin = () => toggleMinimized(id);
      const toggleMax = () => toggleMaximized(id);

      return (
        <div className="fenestro__buttons">
          <button
            title="Hide"
            className="fenestro__button fenestro__button--minimize"
            onClick={toggleMin}
          >
            <span className="fenestro__buttonPlaceholder">
              _
            </span>
          </button>
          <button
            title="Expand"
            className="fenestro__button fenestro__button--maximize"
            onClick={toggleMax}
          >
            <span className="fenestro__buttonPlaceholder">
              ⛶
            </span>
          </button>
        </div>
      );
    }}
  </FenestroContext.Consumer>
);

export default Buttons;
