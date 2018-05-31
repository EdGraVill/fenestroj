import {
  IAction,
  IAddPanelParam,
  IMovePanelParam,
  IPanel,
  IResizePanelParam,
} from "../@types";

const initialState: IPanel[] = [];

export default (state: IPanel[] = initialState, action: IAction) => {
  const { type, payload } = action;

  const alterValue = (id: string, field: string, value: any): IPanel[] => {
    return state.map((panel) => {
      if (panel.id !== id) {
        return panel;
      }

      return {
        ...panel,
        [field]: value,
      };
    });
  }

  if (type === 'FACTORY_MODE') {
    return initialState;
  } else if (type === 'ADD_PANEL') {
    const {
      id,
      title,
      left,
      top,
      height,
      width,
    }: IAddPanelParam = payload;

    return [
      ...state,
      {
        active: true,
        height,
        icon: {
          id,
          title,
        },
        id,
        left: typeof left === 'number' ?
          `calc(${left}px + ${state.length}rem)` :
          `calc(${left.replace('calc(', '').replace(')', '')} + ${state.length}rem)`,
        minimized: false,
        moving: false,
        position: state.length,
        resizing: false,
        title,
        top: typeof top === 'number' ?
          `calc(${top}px + ${state.length * 2.2}rem)` :
          `calc(${top.replace('calc(', '').replace(')', '')} + ${state.length * 2.2}rem)`,
        width,
      },
    ];
  } else if (type === 'MOVE_PANEL') {
    const { id, left, top }: IMovePanelParam = payload;
    
    return state.map((panel) => {
      if (panel.id !== id) {
        return panel;
      }

      return {
        ...panel,
        left,
        top,
      };
    });
  } else if (type === 'MOVE_PANEL_TO_TOP') {
    const id: string = payload;

    if (state.length === 1) {
      return state;
    }

    return state.map((panel) => {
      const actualPanel = state.find(pan => pan.id === id);

      if (panel.id !== id && actualPanel) {
        return {
          ...panel,
          position: panel.position >= actualPanel.position ? panel.position - 1 : panel.position,
        };
      }

      return {
        ...panel,
        position: state.length - 1,
      };
    });
  } else if (type === 'REMOVE_PANEL') {
    const id: string = payload

    return state.reduce((prev, current) => [
      ...prev,
      ...(current.id !== id ? [current] : []),
    ], [])
  } else if (type === 'RESIZE_PANEL') {
    const { id, height, width }: IResizePanelParam = payload;

    return state.map((panel) => {
      if (panel.id !== id) {
        return panel;
      }

      return {
        ...panel,
        height,
        width,
      };
    })
  } else if (type === 'START_MOVING_PANEL') {
    const id: string = payload;

    return alterValue(id, 'moving', true);
  } else if (type === 'START_RESIZING_PANEL') {
    const id: string = payload;

    return alterValue(id, 'resizing', true);
  } else if (type === 'STOP_MOVING_PANEL') {
    const id: string = payload;

    return alterValue(id, 'moving', false);
  } else if (type === 'STOP_RESIZING_PANEL') {
    const id: string = payload;

    return alterValue(id, 'resizing', false);
  } else if (type === 'TOGGLE_PANEL') {
    const id: string = payload;

    return state.map((panel) => {
      if (panel.id !== id) {
        return panel;
      }

      return {
        ...panel,
        minimized: !panel.minimized,
      };
    });
  }
  
  return state;
};
