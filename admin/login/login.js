document.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) login();
});

function login() {
  const password = passwordInput.value;
  fetch("logout", { method: "post" }).then((res) =>
    fetch("/admin/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    })
      .then((res) => {
        if (res.status != 200) throw new Error(res.json().msg);
        return res.json();
      })
      .then((res) => {
        window.open("/admin", "_self");
      })
      .catch((err) => console.error(err))
  );
}

let eyeClosed = true;

eyeContainer.onclick = () => {
  eyeClosed = !eyeClosed;
  if (eyeClosed) {
    eyeOpen.classList.remove("visible");
    eyeClose.classList.add("visible");
    passwordInput.type = "password";
    passwordInput.focus();
  } else {
    eyeClose.classList.remove("visible");
    eyeOpen.classList.add("visible");
    passwordInput.type = "text";
    passwordInput.focus();
  }
};
