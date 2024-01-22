import "./contact.css";
import { useContext, useRef } from "react";
import MessageForm from "./form/MessageForm";
import LangCtx from "../../../LangCtx";

export default function Contact() {
  const clipboardSuccMsg = useRef();
  const lang = useContext(LangCtx);

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      clipboardSuccMsg.current.classList.add("visible");
      setTimeout(() => {
        if (clipboardSuccMsg.current)
          clipboardSuccMsg.current.classList.remove("visible");
      }, 2500);
    } catch (err) {
      alert(
        lang == "eng"
          ? "failed copying to clipboard"
          : "impossible de copier sur le presse-papier"
      );
      console.error(err);
    }
  }

  return (
    <div id="contact-page">
      <h2>{lang == "eng" ? "Contact me" : "Me contacter"}</h2>
      <hr />
      <div id="contact-wrapper">
        <MessageForm apiPath={"./api/sendMail"} required={true} />
        <section id="contact-text">
          <p>
            {lang == "eng"
              ? "You can contact me using this form"
              : "Vous pouvez me contacter avec ce formulaire"}
          </p>
          <p>
            {lang == "eng"
              ? "or you can copy my email-adress"
              : "ou vous pouvez copier mon adresse mail"}
            &nbsp;
            <em onClick={() => copyToClipboard("duvailloic1@gmail.com")}>
              {lang == "eng" ? "here" : "ici"}
            </em>
          </p>
          <div
            id="clipboard-success-msg"
            className="unselectable"
            ref={clipboardSuccMsg}
          >
            {lang == "eng"
              ? "email copied to clipboard"
              : "email copié dans le presse-papier"}
          </div>
        </section>
      </div>
      <div id="map"></div>
    </div>
  );
}
