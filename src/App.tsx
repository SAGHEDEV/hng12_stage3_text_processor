import { RecoilRoot } from "recoil";
import TextProcessor from "./pages";

function App() {
  return (
    <>
      <RecoilRoot>
        <TextProcessor />
      </RecoilRoot>
    </>
  );
}

export default App;
