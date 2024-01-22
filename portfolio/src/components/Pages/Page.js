import Home from "./home/Home";
import About from "./about/About";
import Work from "./work/Work";
import Contact from "./contact/Contact";
import Menu from "./menu/Menu";
import { useEffect, useState } from "react";

export default function Page(props) {
  const {
    pageName,
    pageTransitionDelay,
    lastPage,
    setPage,
    focussedProject,
    setFocussedProject,
  } = props;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //TODO: remove mounted class from last page before loading new one

    setTimeout(() => {
      setLoading(false);
    }, 1 || pageTransitionDelay);

    return () => setLoading(true);
  }, [pageName]);

  return (
    <div className="page">
      {loading
        ? null
        : (() => {
            switch (pageName) {
              case "menu":
                return <Menu setPage={setPage} lastPage={lastPage} />;
              case "home":
                return <Home setPage={setPage} />;
              case "work":
                return (
                  <Work
                    focussedProject={focussedProject}
                    setFocussedProject={setFocussedProject}
                  />
                );
              case "about":
                return <About />;
              case "contact":
                return <Contact />;
              default:
                return (
                  <p>
                    invalid page name for Content component, reading "{pageName}
                    "
                  </p>
                );
            }
          })()}
    </div>
  );
}
