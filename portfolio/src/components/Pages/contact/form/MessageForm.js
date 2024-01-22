import "./messageForm.css";
import Loader from "./assets/Loader";
import { useContext, useRef, useState } from "react";
import LangCtx from "../../../../LangCtx";

export default function MessageForm(props) {
  const { apiPath, required } = props;
  const [loaderState, _setLoaderState] = useState(null);
  const lastLoaderState = useRef(null);
  const canResend = useRef(true);
  const formRef = useRef();
  const errorMsgRef = useRef();

  const MinLoaderLoadingTime_ms = 1000;
  const lang = useContext(LangCtx);

  function setLoaderState(state) {
    if (lastLoaderState.current == "loading")
      return setTimeout(() => {
        _setLoaderState(state);
        lastLoaderState.current = state;
      }, MinLoaderLoadingTime_ms);

    _setLoaderState(state);
    lastLoaderState.current = state;
  }

  function isFormFilled(formEl = document.createElement("form")) {
    let filledRequiredEls = [
      ...formEl.getElementsByTagName("input"),
      ...formEl.getElementsByTagName("textarea"),
    ];
    return !filledRequiredEls.some((el) => el.value == "");
  }

  function sendEmail(email, name, subject, message) {
    if (!canResend.current)
      return displayErr(
        lang == "eng"
          ? "You have to wait for 5s between each send"
          : "veuillez attendre 5s entre chaque tentative d'envoi"
      );

    setLoaderState("loading");
    canResend.current = false;
    setTimeout(() => {
      canResend.current = true;
    }, 5000);

    fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: email,
        name,
        subject,
        message,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error) throw response.error;
        setLoaderState("success");
        [
          ...formRef.current.getElementsByTagName("input"),
          ...formRef.current.getElementsByTagName("textarea"),
        ].forEach((el) => (el.value = ""));
        setTimeout(() => {
          setLoaderState(null);
        }, 5000);
      })
      .catch((err) => {
        setLoaderState("failure");
        console.error(err);
        setTimeout(() => {
          displayErr(
            lang == "eng"
              ? "failed to send mail, check your internet connection or try again later"
              : "échec de l'envoi du mail, vérifiez votre connection internet ou réessayez plus tard"
          );
        }, 1000);
      });
  }

  const displayErr = (errMsg) => (errorMsgRef.current.innerText = errMsg);
  const clearErr = () => displayErr("");

  function handleOnClick(e) {
    e.preventDefault();
    if (required && !isFormFilled(formRef.current))
      return displayErr(
        lang == "eng"
          ? "please fill every field before continuing"
          : "veuillez remplir tous les champs avant de continuer"
      );
    clearErr();

    const inputs = [
      document.getElementById("email-input"),
      document.getElementById("name-input"),
      document.getElementById("subject-input"),
      document.getElementById("message-input"),
    ];

    sendEmail(...inputs.map((input) => input.value));
  }

  return (
    <div id="email-form-container">
      <div id="error-msg" ref={errorMsgRef}></div>
      <form id="email-form" ref={formRef}>
        <div id="email-form-top">
          <input id="email-input" placeholder="email" type="email" />
          <input
            id="name-input"
            placeholder={lang == "eng" ? "name" : "nom"}
            type="text"
          />
        </div>
        <input
          id="subject-input"
          placeholder={lang == "eng" ? "subject" : "sujet"}
        ></input>
        <textarea id="message-input" placeholder="message"></textarea>
        <div id="form-bottom">
          <button id="form-btn" onClick={handleOnClick}>
            {lang == "eng" ? "send message" : "envoyer"}
          </button>
          <Loader state={loaderState} />
        </div>
      </form>
    </div>
  );
}
