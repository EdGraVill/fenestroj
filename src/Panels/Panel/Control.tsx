import * as React from 'react';

import './Control.css';

interface IControlProps {
  startMoving: (event: React.MouseEvent<HTMLDivElement>) => void;
  stopMoving: (event: React.MouseEvent<HTMLDivElement>) => void;
  startResizing: (event: React.MouseEvent<HTMLDivElement>) => void;
  stopResizing: (event: React.MouseEvent<HTMLDivElement>) => void;
  toggleMaximized: () => void;
}

const Control = ({
  startMoving,
  stopMoving,
  startResizing,
  stopResizing,
  toggleMaximized,
}: IControlProps) => {
  const noDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    return false;
  };

  return (
    <React.Fragment>
      <div
        role="button"
        tabIndex={-1}
        className="panel__control panel__control--H"
        onMouseDown={startMoving}
        onMouseUp={stopMoving}
        onDragStart={noDrag}
        onDoubleClick={toggleMaximized}
      />
      <div
        role="button"
        tabIndex={-1}
        className="panel__control panel__control--CT"
        onMouseDown={startResizing}
        onMouseUp={stopResizing}
        onDragStart={noDrag}
      />
      <div
        role="button"
        tabIndex={-1}
        className="panel__control panel__control--LT"
        onMouseDown={startResizing}
        onMouseUp={stopResizing}
        onDragStart={noDrag}
      />
      <div
        role="button"
        tabIndex={-1}
        className="panel__control panel__control--RT"
        onMouseDown={startResizing}
        onMouseUp={stopResizing}
        onDragStart={noDrag}
      />
      <div
        role="button"
        tabIndex={-1}
        className="panel__control panel__control--RC"
        onMouseDown={startResizing}
        onMouseUp={stopResizing}
        onDragStart={noDrag}
      />
      <div
        role="button"
        tabIndex={-1}
        className="panel__control panel__control--RB"
        onMouseDown={startResizing}
        onMouseUp={stopResizing}
        onDragStart={noDrag}
      />
      <div
        role="button"
        tabIndex={-1}
        className="panel__control panel__control--CB"
        onMouseDown={startResizing}
        onMouseUp={stopResizing}
        onDragStart={noDrag}
      />
      <div
        role="button"
        tabIndex={-1}
        className="panel__control panel__control--LB"
        onMouseDown={startResizing}
        onMouseUp={stopResizing}
        onDragStart={noDrag}
      />
      <div
        role="button"
        tabIndex={-1}
        className="panel__control panel__control--LC"
        onMouseDown={startResizing}
        onMouseUp={stopResizing}
        onDragStart={noDrag}
      />
    </React.Fragment>
  );
};

export default Control;
