import * as React from 'react';

import './App.css';
import { Fenestro, Fenestroj } from './Panels';

const App = () => (
  <div className="App">
    <Fenestroj>
      <Fenestro title="fenestroj">
        <Fenestroj>
          <Fenestro title="fenestro" initialHeight={300} initialWidth={400} />
        </Fenestroj>
      </Fenestro>
    </Fenestroj>
  </div>
);

export default App;
