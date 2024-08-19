import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

/*Pages */
import Login from './components/pages/auth/Login'
import Register from './components/pages/auth/Register'
import Home from './components/pages/Home'
import Profile from './components/pages/User/Profile'
import Mypets from './components/pages/pets/Mypets'
import AddPet from './components/pages/pets/AddPet'
import EditPet from './components/pages/pets/EditPet'
import PetDetails from './components/pages/pets/PetDetails'
import MyAdoptions from './components/pages/pets/MyAdoptions'
/*Components */
import Navbar from './components/Layouts/Navbar'
import Footer from './components/Layouts/Footer'
import Container from './components/Layouts/Container'
import Message from './components/Layouts/Message'
/*context */
import { UserProvider } from './context/UserContext'


function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar/>
        <Message/>
        <Container>
          <Routes>

            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/user/profile' element={<Profile />} />
            <Route path='/pets/mypets' element={<Mypets />} />
            <Route path='/pets/addpet' element={<AddPet />} />
            <Route path='/pets/edit/:id' element={<EditPet />} />
            <Route path='/pets/:id' element={<PetDetails/>} />
            <Route path='/pets/myadoptions' element={<MyAdoptions/>} />
            <Route path='/' element={<Home />} />
            

          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
