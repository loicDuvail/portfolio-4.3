import { useContext, useEffect, useRef } from "react";
import "./navbar.css";
import Icon from "./assets/Icon";
import LangCtx from "../../LangCtx";

export default function Navbar({
  onMenu,
  setOnMenu,
  setPage,
  lastPage,
  setLang,
}) {
  let menuBtnRef = useRef();
  const currentLang = useContext(LangCtx);

  useEffect(() => {
    let menuBtn = menuBtnRef.current;
    if (!onMenu) {
      setPage(lastPage);

      menuBtn.className = "state-0";
      menuBtn.onmouseover = () => {};

      menuBtn.onmouseleave = () => {
        menuBtn.className = "state-0";
        menuBtn.onmouseover = () => {
          menuBtn.className = "state-1";
        };
      };
    } else {
      setPage("menu");
      menuBtn.className = "state-2";

      menuBtn.onmouseover = () => {};

      menuBtn.onmouseleave = () => {
        menuBtn.className = "state-2";
        menuBtn.onmouseover = () => {
          menuBtn.className = "state-1";
        };
      };
    }
  });

  function goTo(page) {
    const menuBtn = document.getElementById("menu-btn");
    if (onMenu) menuBtn.click();
    setPage(page);
  }

  //on first load or page change, don't have to wait mouse leave to enable menubtn state changing
  useEffect(() => {
    let menuBtn = menuBtnRef.current;
    menuBtn.onmouseover = () => {
      menuBtn.className = "state-1";
    };
  }, [lastPage]);

  return (
    <nav id="navbar">
      <div id="name-wrapper" onClick={() => goTo("home")}>
        <Icon />
      </div>
      <div id="navbar-right">
        <div id="language-selection">
          <LangCtx.Consumer>
            {(value) => (
              <>
                <p
                  style={{
                    color: value == "fr" ? "var(--highlight_color)" : "inherit",
                  }}
                  className={onMenu ? "visible unselectable" : "unselectable"}
                  onClick={() => setLang("fr")}
                >
                  fr
                </p>
                <p
                  style={{
                    color:
                      value == "eng" ? "var(--highlight_color)" : "inherit",
                  }}
                  className={onMenu ? "visible unselectable" : "unselectable"}
                  onClick={() => setLang("eng")}
                >
                  eng
                </p>
              </>
            )}
          </LangCtx.Consumer>
        </div>
        <button
          id="menu-btn"
          ref={menuBtnRef}
          onClick={() => setOnMenu(!onMenu)}
        >
          <div id="menu-btn-content">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot vert-cent"></div>
            <div className="dot hor-cent"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </button>
      </div>
    </nav>
  );
}
