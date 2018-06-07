import * as React from 'react';

import { ContextMenuTrigger } from 'react-contextmenu';
import './Control.css';

interface IControlProps {
  startMoving: (event: React.MouseEvent<HTMLDivElement>) => void;
  stopMoving: (event: React.MouseEvent<HTMLDivElement>) => void;
  startResizing: (event: React.MouseEvent<HTMLDivElement>) => void;
  stopResizing: (event: React.MouseEvent<HTMLDivElement>) => void;
  toggleMaximized: () => void;
  id: string;
}

const Control = ({
  startMoving,
  stopMoving,
  startResizing,
  stopResizing,
  toggleMaximized,
  id,
}: IControlProps) => {
  const noDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    return false;
  };

  return (
    <ContextMenuTrigger id={id}>
      <div
        role="button"
        tabIndex={-1}
        className="fenestro__control fenestro__control--H"
        onMouseDown={startMoving}
        onMouseUp={stopMoving}
        onDragStart={noDrag}
        onDoubleClick={toggleMaximized}
      />
      <div
        role="button"
        tabIndex={-1}
        className="fenestro__control fenestro__control--CT"
        onMouseDown={startResizing}
        onMouseUp={stopResizing}
        onDragStart={noDrag}
      />
      <div
        role="button"
        tabIndex={-1}
        className="fenestro__control fenestro__control--LT"
        onMouseDown={startResizing}
        onMouseUp={stopResizing}
        onDragStart={noDrag}
      />
      <div
        role="button"
        tabIndex={-1}
        className="fenestro__control fenestro__control--RT"
        onMouseDown={startResizing}
        onMouseUp={stopResizing}
        onDragStart={noDrag}
      />
      <div
        role="button"
        tabIndex={-1}
        className="fenestro__control fenestro__control--RC"
        onMouseDown={startResizing}
        onMouseUp={stopResizing}
        onDragStart={noDrag}
      />
      <div
        role="button"
        tabIndex={-1}
        className="fenestro__control fenestro__control--RB"
        onMouseDown={startResizing}
        onMouseUp={stopResizing}
        onDragStart={noDrag}
      />
      <div
        role="button"
        tabIndex={-1}
        className="fenestro__control fenestro__control--CB"
        onMouseDown={startResizing}
        onMouseUp={stopResizing}
        onDragStart={noDrag}
      />
      <div
        role="button"
        tabIndex={-1}
        className="fenestro__control fenestro__control--LB"
        onMouseDown={startResizing}
        onMouseUp={stopResizing}
        onDragStart={noDrag}
      />
      <div
        role="button"
        tabIndex={-1}
        className="fenestro__control fenestro__control--LC"
        onMouseDown={startResizing}
        onMouseUp={stopResizing}
        onDragStart={noDrag}
      />
    </ContextMenuTrigger>
  );
};

export default Control;
