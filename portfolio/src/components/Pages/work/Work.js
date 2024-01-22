import { useContext, useEffect, useRef, useState } from "react";
import Arrow from "./assets/Arrow";
import ProjectPage from "./components/ProjectPage";
import "./work.css";
import Loader from "./assets/Loader";
import LangCtx from "../../../LangCtx";

export default function Work({ focussedProject, setFocussedProject }) {
  const [projects, _setProjects] = useState([]);
  const [loading, setLoadingState] = useState(true);

  const setProjects = (projects) => {
    setLoadingState(false);
    _setProjects(projects);
  };

  const lang = useContext(LangCtx);

  function storeProjects(projects) {
    localStorage.setItem("projects", JSON.stringify(projects));
    localStorage.setItem(
      "last-download-dateTime",
      new Date().getTime().toString()
    );
  }

  function projectsUpToDate(maxAge_ms) {
    return (
      localStorage.getItem("projects") &&
      new Date().getTime() -
        parseInt(localStorage.getItem("last-download-dateTime")) <
        maxAge_ms
    );
  }

  function loadProjects() {
    // if projects last downloaded less than 2h ago
    if (projectsUpToDate(3600_000 * 2))
      return setProjects(JSON.parse(localStorage.getItem("projects")));

    fetch("/api/get_projects")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) throw data.error;
        storeProjects(data);
        setProjects(data);
      })
      .catch((e) => {
        console.error(e);
        setProjects([]);
      });
  }

  useEffect(loadProjects, []);

  if (loading)
    return (
      <div id="work-page" className="loading">
        <p>
          {lang == "eng"
            ? "Loading projects"
            : "projets en cours de chargement"}
          ...
        </p>
        <Loader />
      </div>
    );

  if (!projects[0])
    return (
      <div id="work-page" className="failed-loading">
        <p>
          {lang == "eng"
            ? "projects could't be accessed"
            : "impossible d'accéder aux projets"}{" "}
          :/
        </p>
      </div>
    );

  if (!focussedProject)
    return (
      <div id="work-page">
        <h2>
          <em>{projects.length}</em> {lang == "eng" ? "projects" : "projets"}
        </h2>
        <hr />
        <div id="content">
          <ul id="projects-list">
            {projects.map((project, index) => (
              <>
                <li
                  id={project.project_name + "-li"}
                  className="project-link"
                  key={index}
                  onMouseOver={() => {
                    document
                      .getElementById(project.project_name + "-img")
                      .classList.add("visible");
                  }}
                  onMouseLeave={() => {
                    document
                      .getElementById(project.project_name + "-img")
                      .classList.remove("visible");
                  }}
                  onClick={() => setFocussedProject(project)}
                >
                  <Arrow />
                  <p>{project.project_name}</p>
                </li>
                {index != projects.length - 1 ? <hr /> : null}
              </>
            ))}
          </ul>
          <div id="projects-previs">
            <div id="img-container">
              {projects.map((project, index) => (
                <img
                  id={project.project_name + "-img"}
                  key={index}
                  src={project.img}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <ProjectPage focusProject={setFocussedProject} project={focussedProject} />
  );
}
