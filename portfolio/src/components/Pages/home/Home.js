import LangCtx from "../../../LangCtx";
import "./home.css";
import { useContext, useEffect } from "react";

export default function Home(props) {
  const { setPage } = props;
  const lang = useContext(LangCtx);

  function updateRot(rs = []) {
    let root = document.documentElement.style;
    root.setProperty("--_rx", rs[0]);
    root.setProperty("--_ry", rs[1]);
    root.setProperty("--_rz", rs[2]);
  }
  useEffect(() => {
    setTimeout(() => updateRot([1, 1, 1]), 100);

    let i = 5,
      changeRate = 0.01;

    let cubeBreathInterval = setInterval(() => {
      i += changeRate;
      let spacing = Math.sin(i) * 20 + 100;
      document.documentElement.style.setProperty("--_spacing", spacing + "px");
    }, 16);

    return () => {
      clearInterval(cubeBreathInterval);
      updateRot([0, 0, 0]);
    };
  });
  return (
    <div id="home-page" className="page">
      <div className="scene">
        <div className="cube spinning" id="cube">
          <div className="cube__face spacing cube--front"></div>
          <div className="cube__face spacing cube--back"></div>
          <div className="cube__face spacing cube--left"></div>
          <div className="cube__face spacing cube--right"></div>
          <div className="cube__face spacing cube--top"></div>
          <div className="cube__face spacing cube--bottom"></div>
        </div>
      </div>
      <div id="text-wrapper" className="unselectable">
        <p>{lang == "eng" ? "Hi" : "Salut"},</p>
        <div>
          <p>{lang == "eng" ? "I'm" : "Je suis"}&nbsp;</p>
          <em>Loïc</em>
          <p>,</p>
        </div>
        <p>
          {lang == "eng" ? "full stack developer" : "développeur full stack"}
        </p>
        <div id="shortcuts">
          <a>
            <p onClick={() => setPage("work")}>
              {lang == "eng" ? "view my work" : "voir mes projets"}
            </p>
          </a>
          <a>
            <p onClick={() => setPage("contact")}>
              {lang == "eng" ? "contact me" : "me contacter"}
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
