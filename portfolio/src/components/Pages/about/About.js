import { useContext } from "react";
import "./about.css";
import LangCtx from "../../../LangCtx";

export default function About() {
  const lang = useContext(LangCtx);
  return (
    <div id="about-page">
      <h2>{lang == "eng" ? "About" : "A propos"}</h2>
      <hr />
      {lang == "eng" ? (
        <p>
          Hy, my name is Loïc Duvail, I'm a self-taught web developer.
          <br />I love to learn and deepen my understanding of many subjects,
          such as philosophy, music, physics, maths, arts and informatics.
          <br />
          <br />
          I think of being self-taught as a chance, since it made me
          self-sufficient in developping web applications.
          <br />
          I have worked on many of my projects from scratch, and am therefore
          quite efficient in vanilla javascript, but have also used frameworks
          such as React.js or Vue.js for some projects.
          <br />
          <br />I would love to put my skills into use, be it in making website
          and optimizing my work flow, or in solving complex problems requiring
          abstraction, for instance developping web libraries.
        </p>
      ) : (
        <p>
          Salut, je m'appelle Loïc Duvail, et suis un développeur web
          autodidacte.
          <br />
          J'adore apprendre de nouvelles choses et approfondir mes connaissances
          et compréhensions dans de nombreux domaines, tels que la philosophie,
          la musique, la physique, les maths, l'art et l'informatics.
          <br />
          <br />
          Je pense qu'être autodidacte est une chance, car cela m'a permis de
          développer une compréhension dialectique de l'informatique, et
          d'acquérir une grande autonomie dans la réalisation de mes projets.
          <br />
          J'ai beaucoup travaillé &quot;from scratch&quot;, et suis donc très
          familier avec Javascript vanilla, mais ai aussi utilisé des frameworks
          tels que React.js ou Vue.js pour certains de mes projets.
          <br />
          <br />
          J'adorerai mettre mes compétences à l'usage, que ce soit dans le
          développement web pur afin d'optimiser mon work-flow, ou dans la
          résolution de problèmes complexes demandant de l'abstraction, par
          exemple en développant des librairies pour le web.
        </p>
      )}
    </div>
  );
}
