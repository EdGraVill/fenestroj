import * as React from 'react';
import Panels, { Panel } from './Panels';

const App = () => (
  <div className="App">
    <Panels>
      <Panel title="Panel de Prueba 1" />
      <Panel title="Panel de Prueba 2" />
      <Panel title="Panel de Prueba 3" />
    </Panels>
  </div>
);

export default App;
