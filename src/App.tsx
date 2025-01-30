import Cates from "./components/cates";
import Notes from "./pages/notes";
import "./App.css";

function App() {
  return (
    <main className="container">
      <section className="sidebar">
        <Cates />
      </section>
      <section className="main">
        <Notes />
      </section>
    </main>
  );
}

export default App;
