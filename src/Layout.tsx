// layout 布局
import { useState, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import cn from "classnames";
import { sceneList } from "./config";

const Layout = function () {
  const [activeNavId, setActiveNavId] = useState("home");

  return (
    <Router>
      <>
        <section className="navigation">
          {sceneList.map((item) => {
            const { path, label, id } = item;
            return (
              <div
                className={cn(
                  "label-item",
                  activeNavId === id ? "label-item-active" : ""
                )}
                key={id}
                onClick={() => setActiveNavId(id)}
              >
                <Link to={path}>{label}</Link>
              </div>
            );
          })}
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
      </>
    </Router>
  );
};

export default Layout;
