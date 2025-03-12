import { ToastContainer } from 'react-toastify';
import { Routes, Route } from 'react-router'
import { AuthForm, Navbar, Dashboard, Expenses, useAuth, Incomes,Loading } from "./components";



function App() {

  const { user, isPending, isLoggedIn } = useAuth();


  if (isPending) {
    return <Loading/>
  }
  console.log(isLoggedIn);
  return (
    <>
      {isLoggedIn && <Navbar />}
      <Routes>
        {isLoggedIn ? (
          <Route path="/" element={<Dashboard />} />
        ):(
          <Route path="/" element={<AuthForm />} />
        )}
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/incomes" element={<Incomes />} />
      </Routes>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />
    </>
  )
}

export default App
