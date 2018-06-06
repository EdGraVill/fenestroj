import * as React from 'react';

import facebook from './icons/facebook.svg';
import youtube from './icons/youtube.svg';
import Panels, { Panel } from './Panels';

const App = () => (
  <div className="App">
    <Panels>
      <Panel title="YouTube" icon={youtube} />
      <Panel title="facebook" icon={facebook} />
    </Panels>
  </div>
);

export default App;
