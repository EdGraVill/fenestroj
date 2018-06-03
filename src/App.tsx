import * as React from 'react';
import Panels, { Panel } from './Panels';

const App = () => (
  <div className="App">
    <Panels>
      <Panel title="Foo" />
    </Panels>
  </div>
);

export default App;
