logoutBtn.onclick = () =>
  fetch("/admin/logout", { method: "POST" })
    .then((res) => {
      if (res.status != 200) throw new Error(res.json().msg);
      return res.json();
    })
    .then(() => window.location.assign("/"))
    .catch((err) => console.error(err));

projectsBtn.onclick = () => window.location.assign("/admin/DB/index.html");

mailBtn.onclick = () => window.location.assign("/admin/getMailsAnalytics");
