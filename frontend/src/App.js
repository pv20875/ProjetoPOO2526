import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext } from "./services/auth/context";
import Sidebar from "./views/components/Sidebar";
import Login from "./views/Login";
import Signup from "./views/Signup";

export default function App() {
  const { presentUser } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {presentUser ? (
          <Route path="/*" element={<Sidebar presentUser={presentUser} />} />
        ) : (
          <>
            <Route path="/*" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
