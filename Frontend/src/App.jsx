import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

import LoginForm from './Page/LoginPage/JS/LoginForm.jsx';
import RegisterForm from './Page/RegisterPage/JS/RegisterForm.jsx';
import ForgotPasswordForm from './Page/ForgotPasswordPage/JS/ForgotPasswordForm.jsx';
//ResetPasswordForm
import ResetPasswordForm from './Page/ResetPasswordPage/JS/ResetPasswordForm.jsx';
import Home from './Page/HomePage/JS/HomeForm.jsx';



axios.defaults.baseURL = 'http://localhost:5000'; // Set the base URL

function App() {
  return (
    <Router>
      <div className="App">
        <Routes> {/* Use Routes instead of Switch */}
          <Route path="/login" element={<LoginForm />} /> {/* Use element instead of component */}
          <Route path="/register" element={<RegisterForm />} /> {/* Use element instead of component */}
          <Route path="/forgot-password" element={<ForgotPasswordForm />} /> {/* Add ForgetPassword route */}
          <Route exact path="/" element={<Navigate to="/login" />} /> {/* Use element and Navigate */}
          <Route path="/reset-password" element={<ResetPasswordForm />} /> 
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
