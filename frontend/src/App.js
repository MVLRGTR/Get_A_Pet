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
import PrimaryLogin from './components/pages/auth/PrimaryLogin'
import ForgotPassword from './components/pages/auth/ForgotPassword'
import ForgotPasswordLogin from './components/pages/auth/ForgotPasswordLogin'
import PetAdoptions from './components/pages/pets/PetAdoptions'
import About from './components/pages/About'
import Notifications from  './components/pages/User/Notification'
import FavoritePets from './components/pages/User/FavoritePets'
import ActivesChats from './components/pages/User/ChatsActives'
import Chat from './components/pages/User/Chat'
/*Components */
import Navbar from './components/Layouts/Navbar'
import Footer from './components/Layouts/Footer'
import Container from './components/Layouts/Container'
import Message from './components/Layouts/Message'
/*context */
import { UserProvider } from './context/UserContext'

//URLs a seream adionadas
///pets/mypets/:id ver detalhes do meu pet e os possiveis adotantes

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar/>
        <Message/>
        <Container>
          <Routes>

            <Route path='/login' element={<Login />} />
            <Route path='/forgotpassword' element={<ForgotPassword/>} />
            <Route path='/forgotpassword/login' element={<ForgotPasswordLogin/>} />
            <Route path='/register' element={<Register />} />
            <Route path='/user/profile' element={<Profile />} />
            <Route path='/pets/mypets' element={<Mypets />} />
            <Route path='/pets/addpet' element={<AddPet />} />
            <Route path='/pets/edit/:id' element={<EditPet />} />
            <Route path='/pets/getpet/:id' element={<PetDetails/>} />
            <Route path='/pets/myadoptions' element={<MyAdoptions/>} />
            <Route path='/login/primarylogin' element={<PrimaryLogin/>} />
            <Route path='/pets/mypets/adoptions/:id' element={<PetAdoptions/>} />
            <Route path='/:page' element={<Home />} />
            <Route path='/notifications/:page' element={<Notifications/>}/>
            <Route path='/' element={<About/>}/>
            <Route path='/favoritepets/:page' element={<FavoritePets/>}/>
            <Route path='/activechats/:page' element={<ActivesChats/>}/>
            <Route path='/chat/:id' element={<Chat/>}/>

          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  )
}

export default App
