import * as React from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { IFenestro } from '../@types';

import icon from './fenestroj.svg';
import './Icons.css';

interface IIconsProps {
  fenestroj: IFenestro[];
  addIconRef: (ref: HTMLButtonElement, id: string) => void;
  toggleMinimized: (id: string) => void,
}

const Icons = ({ fenestroj, addIconRef, toggleMinimized }: IIconsProps) => (
  <div className="icons">
    {fenestroj.map((fenestro) => {
      const onClick = () => toggleMinimized(fenestro.id);
      const ref = (reference: HTMLButtonElement) => {
        if (reference && !fenestro.icon.ref) {
          addIconRef(reference, fenestro.id);
        }
      };

      return (
        <ContextMenuTrigger id={`IconOf${fenestro.id}`} key={fenestro.id}>
          <button
            onClick={onClick}
            className={`icons__icon${fenestro.minimized ? ' icons__icon--minimized' : ''}`}
            ref={ref}
          >
            <span
              className="icons__image"
              style={{ backgroundImage: `url(${fenestro.icon.src || icon})` }}
            />
            <span className="icons__title">
              {fenestro.icon.title}
            </span>
          </button>
          <ContextMenu id={`IconOf${fenestro.id}`} key={fenestro.id}>
            <MenuItem onClick={onClick}>
              {fenestro.minimized ? 'Show' : 'Hide'}
            </MenuItem>
          </ContextMenu>
        </ContextMenuTrigger>
      );
    })}
  </div>
);

export default Icons;
