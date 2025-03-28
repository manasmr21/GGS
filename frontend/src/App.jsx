import { BrowserRouter as Routers, Routes, Route } from "react-router-dom";
import Login from "./components/Authentication/Login";
import "./App.css"
import Users from "./components/Users/Users";

function App() {
  return (
    <>
      <Routers>
        <Routes>
          <Route exact path="/" element={<Login/>} />
          <Route exact path="/users" element={<Users/>} />
        </Routes>
      </Routers>
    </>
  );
}

export default App;
