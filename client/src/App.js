import "./style/App.scss"
import StartPage from "./components/Pages/StartPage";
import EnterPage from "./components/Pages/EnterPage";
import FindPage from "./components/Pages/FindPage";


function App() {
  return (
    <div className="App">
      <StartPage/>
      <EnterPage/>
      <FindPage/>
    </div>
  );
}

export default App;
