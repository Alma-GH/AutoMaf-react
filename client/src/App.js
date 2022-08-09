import "./style/App.scss"
import StartPage from "./components/Pages/StartPage";
import EnterPage from "./components/Pages/EnterPage";
import FindPage from "./components/Pages/FindPage";
import CreatePage from "./components/Pages/CreatePage";
import PreparePage from "./components/Pages/PreparePage";
import GamePage from "./components/Pages/GamePage";


function App() {
  return (
    <div className="App">
      <EnterPage/>
      <StartPage/>
      <FindPage/>
      <CreatePage/>
      <PreparePage/>
      <GamePage/>
    </div>
  );
}

export default App;
