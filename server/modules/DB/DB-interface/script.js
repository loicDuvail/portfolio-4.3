let settings = {};

function loadSettings() {
  return fetch("./settings.json")
    .then((response) => response.json())
    .then((data) => (settings = data));
}

async function loadTable(tableName) {
  const getTableRoute = settings.tables.find((table) => table.name === tableName).routes.get;

  return new Promise((resolve, reject) => {
    fetch(getTableRoute)
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => reject(err));
  });
}

function askValidation() {
  validationPopup.style.display = "flex";
  let btns = document.querySelectorAll(".validation-btn");

  return new Promise((resolve, reject) => {
    btns[0].onclick = () => {
      reject(false);
      validationPopup.style.display = "none";
    };
    btns[1].onclick = () => {
      resolve(true);
      validationPopup.style.display = "none";
    };
  });
}

function deleteItem(tableName, item) {
  let deleteItemRoute = settings.tables.find((table) => table.name === tableName).routes.delete;

  return askValidation().then(() =>
    fetch(deleteItemRoute, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    }).catch((err) => console.error(err))
  );
}

function updateItem(tableName, item) {
  let updateItemRoute = settings.tables.find((table) => table.name === tableName).routes.update;

  return fetch(updateItemRoute, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
}

function postItem(tableName, item) {
  let postItemRoute = settings.tables.find((table) => table.name === tableName).routes.post;

  return fetch(postItemRoute, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
}

let binSVG = `<svg class="bin-svg" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M17.004 20L17.003 8h-1-8-1v12H17.004zM13.003 10h2v8h-2V10zM9.003 10h2v8h-2V10zM9.003 4H15.003V6H9.003z"></path><path d="M5.003,20c0,1.103,0.897,2,2,2h10c1.103,0,2-0.897,2-2V8h2V6h-3h-1V4c0-1.103-0.897-2-2-2h-6c-1.103,0-2,0.897-2,2v2h-1h-3 v2h2V20z M9.003,4h6v2h-6V4z M8.003,8h8h1l0.001,12H7.003V8H8.003z"></path><path d="M9.003 10H11.003V18H9.003zM13.003 10H15.003V18H13.003z"></path></svg>`;
let addSVG = `<svg class="add-svg" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" stroke-width="2" d="M12,22 L12,2 M2,12 L22,12"></path></svg>`;

function addRow(htmlTable, tableName, item) {
  let row = document.createElement("tr");

  Object.keys(item).forEach((field) => {
    if (field == "id") return;
    let td = document.createElement("td");
    let txtArea = document.createElement("textarea");
    txtArea.innerText = item[field].toString().replaceAll("%n", "\n");
    txtArea.onchange = () => {
      item[field] = txtArea.value;
      updateItem(tableName, item)
        .then((response) => {
          if (response.status != 200) throw new Error(response.msg);
          console.log("successful update");
        })
        .catch((err) => alert(err));
    };
    td.appendChild(txtArea);
    row.appendChild(td);
  });

  let deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = binSVG;
  deleteBtn.onclick = () =>
    deleteItem(tableName, item)
      .then((response) => {
        if (response.status != 200) throw new Error(response.statusText);
        htmlTable.removeChild(row);
      })
      .catch((err) => alert(err));
  row.appendChild(deleteBtn);

  htmlTable.appendChild(row);
}

function addInsertRow(table, tableName, itemTemplate) {
  itemTemplate = { ...itemTemplate };
  let row = document.createElement("tr");

  Object.keys(itemTemplate).forEach((field) => {
    if (field === "id") return;
    let td = document.createElement("td");
    let txtArea = document.createElement("textarea");
    txtArea.onchange = () => (itemTemplate[field] = txtArea.value);
    td.appendChild(txtArea);
    row.appendChild(td);
  });

  let addBtn = document.createElement("button");
  addBtn.innerHTML = addSVG;
  addBtn.onclick = () =>
    postItem(tableName, itemTemplate)
      .then((r) => r.json())
      .then((r) => {
        if (r.status !== 200) throw new Error(r.msg);
      })
      .catch((err) => console.error(err));

  row.appendChild(addBtn);

  table.appendChild(row);
}

function displayTable(tableName) {
  const table = document.createElement("table");
  const headRow = document.createElement("tr");
  table.appendChild(headRow);
  tablesContainer.appendChild(table);

  loadTable(tableName).then((items) => {
    let fields = Object.keys(items[0]);

    fields.forEach((field) => {
      if (field === "id") return;
      let th = document.createElement("th");
      th.innerText = field;
      headRow.appendChild(th);
    });

    items.forEach((item) => addRow(table, tableName, item));
    addInsertRow(table, tableName, items[0]);
  });
}

loadSettings().then(() => displayTable("projects"));
