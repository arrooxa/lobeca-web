import "./App.css";
import { Route, Routes } from "react-router";
import Homepage from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;
