if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB.");
}
var db;
var request;
(request = window.indexedDB.open("Projects", 1)),
  (request.onerror = function () {
    console.log("there was an error");
  });

request.onsuccess = function () {
  db = request.result;
  console.log("db", db);
};

request.onupgradeneeded = function (event) {
  db = event.target.result;
  console.log("db", db);
  if (!db.objectStoreNames.contains("Projects")) {
    storeOS = db.createObjectStore("Projects", {
      keyPath: "tittle",
      autoIncrement: true,
    });
  }
  console.log("No database");
};

function add() {
  var xyz = document.getElementsByClassName("abc");
  var y = {};

  for (var i = 0; i < xyz.length; i++) {
    y[xyz[i].id] = xyz[i].value;
  }
  // console.log("xyz", y);

  request = db
    .transaction(["Projects"], "readwrite")
    .objectStore("Projects")
    .add(y);

  request.onsuccess = function (event) {
    alert("Data Added");
  };

  request.onerror = function (event) {
    alert("Unable to add data");
  };
  window.location.reload();
}

function getAllItems(callback) {
  var trans = db.transaction(["Projects"], "readwrite");
  var store = trans.objectStore("Projects");
  var items = [];

  trans.oncomplete = function (evt) {
    return items;
  };
  var cursorRequest = store.openCursor();
  cursorRequest.onerror = function (error) {
    console.log(error);
  };

  cursorRequest.onsuccess = function (event) {
    var cursor = event.target.result;
    const listItem = document.createElement("div");
    var list = document.getElementById("task-list");
    const deleteButton = document.createElement("button");
    const editbutton = document.createElement("button");

    if (cursor) {
      listItem.classList.add("top");
      listItem.innerHTML =
        "<h2>" +
        cursor.value.tittle +
        "</h2>" +
        "<br>" +
        
        "<label>Category :- </label>" +
          cursor.value.category +
        "<br><br>" +
        "<label> Discription :- </label>" +
        cursor.value.details +
        "<br><br>" +
       
        "<label> Members :- </label>" +
        cursor.value.txtNums +
        "<br><br> " +
        "<label>Final Deadline :- </label>" +
        "<b>" +
        cursor.value.deadline +
        "</b>" +
        "<br><br> ";
      list.appendChild(listItem);

      var result = Object.values(cursor.value);
      console.log("res", result);
      //Table
      var table = document.createElement("table");
      // console.log(table);
      var thead = document.createElement("thead");
      var tr;
      tr = thead.insertRow(-1);
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = "Member";
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = "Task";
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = "Deadline";
      thead.appendChild(tr);
      table.appendChild(thead);
      listItem.appendChild(table);
      var i = 3;
      var tbody = document.createElement("tbody");

      while (i < result.length - 2) {
        tr = tbody.insertRow(-1);
        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = result[i];
        i++;
        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = result[i];
        i++;
        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = result[i];
        tbody.appendChild(tr);
        i++;
      }
      table.appendChild(tbody);
      listItem.appendChild(table);
      //  button
      listItem.appendChild(editbutton);
      listItem.appendChild(deleteButton);

      editbutton.innerHTML = "Edit ";
      deleteButton.innerHTML = "Delete";
      editbutton.id = "myedit";
      editbutton.classList.add("editbutton");
      deleteButton.classList.add("deletebutton");
      console.log("result0",  cursor.value.tittle)
      editbutton.setAttribute("edit-data",  cursor.value.tittle);
      editbutton.onclick = function (e) {
        abcd();
        editvalues(e);
        modelclose(e)
      };
      deleteButton.setAttribute("delete-data", cursor.value.tittle);
      deleteButton.onclick = function (event) {
        deleteItem(event);
      };
    
    cursor.continue();

    }
  };
}

function editvalues(event) {
  var xyz = document.getElementsByClassName("abc");

  // console.log("xyz", event.target.getAttribute("edit-data"));

  let Task = event.target.getAttribute("edit-data");
  console.log("event", Task);
  var transaction = db.transaction(["Projects"], "readwrite");
  var objectStore = transaction.objectStore("Projects");
  var objectStoreRequest = objectStore.get(Task);
  objectStoreRequest.onsuccess = function (event) {
    console.log("event-data", objectStoreRequest.result);
    var result = Object.values(objectStoreRequest.result);
    for (var i = 0; i < xyz.length; i++) {
      xyz[i].value = result[i];
      if (i == 2) createMany();
    }
    // console.log("value", result);
  };
}

function update() {
  let dataTask = document.getElementById("tittle").value;
  var transaction = db.transaction(["Projects"], "readwrite");
  request = transaction.objectStore("Projects").delete(dataTask);
  transaction.oncomplete = function () {
    console.log("Deleted");
    add();
  };
  // window.location.reload();
}

function deleteItem(event) {
  let dataTask = event.target.getAttribute("delete-data");
  console.log("de", dataTask);
  var transaction = db.transaction(["Projects"], "readwrite");
  request = transaction.objectStore("Projects").delete(dataTask);
  transaction.oncomplete = function () {
    alert("Deleted");
  };
  window.location.reload();
}
var create = document.getElementById("create")
var save = document.getElementById("save")
function modelclose(event){
create.style.display="none"
save.style.display="block"
}