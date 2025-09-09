import { Route, Routes } from "react-router";
import Home from "./pages";
import { ROUTES } from "./constants";

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
    </Routes>
  );
}

export default App;
