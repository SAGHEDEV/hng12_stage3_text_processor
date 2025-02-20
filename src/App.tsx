import { RecoilRoot } from "recoil";
import TextProcessor from "./pages";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeScreen from "./pages/welcome";

function App() {
  return (
    <>
      <BrowserRouter>
        <RecoilRoot>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/main" element={<TextProcessor />} />
          </Routes>
        </RecoilRoot>
      </BrowserRouter>
    </>
  );
}

export default App;
