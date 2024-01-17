import {Routes, Route} from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';

const App = ()=>{
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
  )
}

export default App;