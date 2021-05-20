import './App.css';
import MemePage from './meme-components/MemePage';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import Login from './login-components/Login';
import { GlobalProvider } from './redux/save-meme/GlobalState';

import SaveList from './meme-components/SaveList';
import GenerateMeme from './meme-components/Generate-Meme';
import MemeGenerated from './meme-components/MemeGenerated';

function App() {

  return (
    <div className="App">
      <GlobalProvider>
     <Router>
       <Switch>

       <Route path='/generated'>
          <MemeGenerated />
        </Route>
         <Route path="/generate-meme">
           <GenerateMeme/>
         </Route>
         <Route path="/save">
          <SaveList/>
         </Route>
       <Route path="/login">
       <Login/>
         </Route>
         <Route path="/">
       <MemePage/>
         </Route>
         

       </Switch>
     </Router>
     </GlobalProvider>
    </div>
  );
}

export default App;
