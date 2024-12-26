import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/nav";
import Cates from "./components/cates";
import { sceneList } from "./config";
import "./App.css";

function App() {
  return (
    <main className="container">
      <Router>
        <section className="sidebar">
          <Nav />
          <Cates />
        </section>
        <section className="main">
          <Suspense fallback={<div>Loading</div>}>
            <Routes>
              {sceneList.map((item) => {
                const { path, Component, id } = item;
                return <Route path={path} key={id} element={<Component />} />;
              })}
            </Routes>
          </Suspense>
        </section>
      </Router>
    </main>
  );
}

export default App;
