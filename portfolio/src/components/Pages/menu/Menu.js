import { useRef, useEffect, useContext } from "react";
import "./menu.css";
import LangCtx from "../../../LangCtx";

export default function Menu(props) {
  const { setPage, lastPage } = props;
  const lang = useContext(LangCtx);

  function goTo(page) {
    let menuBtn = document.getElementById("menu-btn");
    menuBtn.click();
    setPage(page);
  }

  const menuList_element = useRef();

  useEffect(() => {
    let pages = ["home", "about", "work", "contact"];
    for (let i = 0; i < 4; i++) {
      if (lastPage === pages[i])
        menuList_element.current.children[i * 2].className = "lastPage";
    }
  });

  return (
    <div id="menu-page" className="unselectable">
      <ul id="menu-list" ref={menuList_element}>
        <li onClick={() => goTo("home")}>
          {lang == "eng" ? "Home" : "Accueil"}
        </li>
        <hr />
        <li onClick={() => goTo("about")}>
          {lang == "eng" ? "About me" : "À propos"}
        </li>
        <hr />
        <li onClick={() => goTo("work")}>
          {lang == "eng" ? "Projects" : "Projets"}
        </li>
        <hr />
        <li onClick={() => goTo("contact")}>Contact</li>
      </ul>
    </div>
  );
}
