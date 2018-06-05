import * as React from 'react';
import { IPanel } from '../@types';

import './Icons.css';
import icon from './panel.svg';

interface IIconsProps {
  panels: IPanel[];
  addIconRef: (ref: HTMLButtonElement, id: string) => void;
  toggleMinimized: (id: string) => void,
}

const Icons = ({ panels, addIconRef, toggleMinimized }: IIconsProps) => (
  <div className="icons">
    {panels.map((panel) => {
      const onClick = () => toggleMinimized(panel.id);
      const ref = (reference: HTMLButtonElement) => {
        if (reference && !panel.icon.ref) {
          addIconRef(reference, panel.id);
        }
      };

      return (
        <button
          onClick={onClick}
          className={`icons__icon${panel.minimized ? ' icons__icon--minimized' : ''}`}
          key={panel.id}
          ref={ref}
        >
          <span
            className="icons__image"
            style={{ backgroundImage: `url(${panel.icon.src || icon})` }}
          />
          <span className="icons__title">
            {panel.icon.title}
          </span>
        </button>
      );
    })}
  </div>
);

export default Icons;
