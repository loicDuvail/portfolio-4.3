import { useEffect, useState } from "react";
import Page from "./components/Pages/Page";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";

import LangCtx from "./LangCtx";

import "./app.css";

export default function App() {
  const [onMenu, setOnMenu] = useState(false);
  const [page, _setPage] = useState("home");
  const [lastPage, setLastPage] = useState("home");
  const [lang, setLang] = useState("eng");
  const [focussedProject, setFocussedProject] = useState(null);

  const PAGE_ANIMATION_TIME_ms = 500;

  function setPage(newPage) {
    if (newPage != "menu") setLastPage(newPage);
    _setPage(newPage);
  }

  useEffect(() => {
    let menuBtn = document.getElementById("menu-btn");
    menuBtn.onmouseover = () => {
      menuBtn.className = "state-1";
    };
  }, [focussedProject]);

  return (
    <LangCtx.Provider value={lang}>
      <Navbar onMenu={onMenu} setOnMenu={setOnMenu} lastPage={lastPage} setPage={setPage} setLang={setLang} />
      <Page
        pageName={page}
        pageTransitionDelay={PAGE_ANIMATION_TIME_ms}
        lastPage={lastPage}
        setPage={setPage}
        focussedProject={focussedProject}
        setFocussedProject={setFocussedProject}
      />
      <Footer
        author={"Loïc Duvail"}
        linkedin_link={"https://www.linkedin.com/in/loic-duvail-970422235/"}
        github_link={"https://github.com/loicDuvail"}
      />
    </LangCtx.Provider>
  );
}
