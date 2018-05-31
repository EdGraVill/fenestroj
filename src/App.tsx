import * as React from 'react';
import Panels, { Panel } from './Panels';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Panels>
          <Panel title="Foo" />
        </Panels>
      </div>
    );
  }
}

export default App;
