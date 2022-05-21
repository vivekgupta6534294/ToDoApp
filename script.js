let addBtn = document.querySelector(".add-btn");
let modalCont = document.querySelector(".modal-cont");
let taskAreaCont = document.querySelector(".textarea-cont");
let mainCont = document.querySelector(".main-cont");
let allPriorityColors = document.querySelectorAll(".priority-color");
let removeBtn = document.querySelector(".remove-btn");
let toolBoxColors = document.querySelectorAll(".color");
let addModal = true;
let removeFlag = false;
let colors = ["lightpink", "blue", "green", "black"];
let modalPriorityColor = colors[colors.length - 1];
var uid = new ShortUniqueId();

let ticketArr = [];

if (localStorage.getItem("tickets")) {
  let str = localStorage.getItem("tickets");
  let arr = JSON.parse(str);
  ticketArr = arr;
  for (let i = 0; i < arr.length; i++) {
    let ticketObj = arr[i];
    createTicket(ticketObj.color, ticketObj.task, ticketObj.id);
  }
}

for (let i = 0; i < toolBoxColors.length; i++) {
  toolBoxColors[i].addEventListener("click", function () {
    let currentColor = toolBoxColors[i].classList[1];
    let filteredArr = [];
    for (let i = 0; i < ticketArr.length; i++) {
      if (ticketArr[i].color == currentColor) {
        filteredArr.push(ticketArr[i]);
      }
    }
    // console.log(filteredArr);
    let allTickets = document.querySelectorAll(".ticket-cont");
    for (let j = 0; j < allTickets.length; j++) {
      allTickets[j].remove();
    }
    for (let i = 0; i < filteredArr.length; i++) {
      let ticket = filteredArr[i];
      let color = ticket.color;
      let task = ticket.task;
      let id = ticket.id;
      createTicket(color, task, id);
    }
  });

  toolBoxColors[i].addEventListener("dblclick", function () {
    let allTickets = document.querySelectorAll(".ticket-cont");
    for (let j = 0; j < allTickets.length; j++) {
      allTickets[j].remove();
    }
    for (let i = 0; i < ticketArr.length; i++) {
      let ticket = ticketArr[i];
      let color = ticket.color;
      let task = ticket.task;
      let id = ticket.id;
      createTicket(color, task, id);
    }
  });
}

addBtn.addEventListener("click", function () {
    addBtn.style.color="white";
  if (addModal) {
    //show modal
    modalCont.style.display = "flex";
  } else {
    //hide modal
    modalCont.style.display = "none";
  }
  addModal = !addModal;
});

for (let i = 0; i < allPriorityColors.length; i++) {
  let priorityDivOneColor = allPriorityColors[i];
  priorityDivOneColor.addEventListener("click", function (e) {
    for (let j = 0; j < allPriorityColors.length; j++) {
      allPriorityColors[j].classList.remove("active");
    }
    priorityDivOneColor.classList.add("active");
    modalPriorityColor = priorityDivOneColor.classList[0];
  });
}

modalCont.addEventListener("keydown", function (e) {
  let key = e.key;
  if (key == "Enter") {
    addBtn.style.color="black";
    createTicket(modalPriorityColor, taskAreaCont.value);
    taskAreaCont.value = "";
    modalCont.style.display = "none";
    addModal = !addModal;
  }
});

removeBtn.addEventListener("click", function () {
  if (removeFlag) {
    removeBtn.style.color = "black";
  } else {
    removeBtn.style.color = "white";
  }
  removeFlag = !removeFlag;
});

function createTicket(ticketColor, task, ticketId) {
  let id;
  if (ticketId == undefined) {
    id = uid();
  } else {
    id = ticketId;
  }

  // <div class="ticket-cont">
  //         <div class="ticket-color"></div>
  //         <div class="ticket-id">#qzu03</div>
  //         <div class="task-area">some task</div>
  //     </div>
  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
                            <div class="ticket-id"> #${id}</div>
                            <div class="task-area">${task}</div>
                            <div class="lock-unlock"><i class="fa fa-lock"></i></div>`;
  mainCont.appendChild(ticketCont);

  //lock unlock handle

  //update UI
  let lockUnlockBtn = ticketCont.querySelector(".lock-unlock i");
  let ticketTaskArea = ticketCont.querySelector(".task-area");
  lockUnlockBtn.addEventListener("click", function () {
    if (lockUnlockBtn.classList.contains("fa-lock")) {
      lockUnlockBtn.classList.remove("fa-lock");
      lockUnlockBtn.classList.add("fa-unlock");
      ticketTaskArea.setAttribute("contenteditable", "true");
    } else {
      lockUnlockBtn.classList.remove("fa-unlock");
      lockUnlockBtn.classList.add("fa-lock");
      ticketTaskArea.setAttribute("contenteditable", "false");
    }

    //update ticketArr
    let ticketIdx = getTicketIdx(id);
    ticketArr[ticketIdx].task = ticketTaskArea.textContent;
    updateLocalStorage();
  });

  //handling delete
  ticketCont.addEventListener("click", function () {
    if (removeFlag) {
      //Delete from UI
      ticketCont.remove();

      //Delete from ticketArr
      let ticketIdx = getTicketIdx(id);
      ticketArr.splice(ticketIdx, 1); //remove a ticket.
      updateLocalStorage();
    }
  });

  //handle color
  let ticketColorBand = ticketCont.querySelector(".ticket-color");
  ticketColorBand.addEventListener("click", function () {
    //update UI
    let currentTicketColor = ticketColorBand.classList[1];
    let currentTicketColorIdx = -1;
    for (let i = 0; i < colors.length; i++) {
      if (currentTicketColor == colors[i]) {
        currentTicketColorIdx = i;
        break;
      }
    }
    let nextColorIdx = (currentTicketColorIdx + 1) % colors.length;
    let nextColor = colors[nextColorIdx];
    ticketColorBand.classList.remove(currentTicketColor);
    ticketColorBand.classList.add(nextColor);

    //update ticketArr as well
    let ticketIdx = getTicketIdx(id);
    ticketArr[ticketIdx].color = nextColor;
    updateLocalStorage();
  });

  if (ticketId == undefined) {
    ticketArr.push({ color: ticketColor, task: task, id: id });
    updateLocalStorage();
  }
}

function getTicketIdx(id) {
  for (let i = 0; i < ticketArr.length; i++) {
    if (ticketArr[i].id == id) {
      return i;
    }
  }
}

function updateLocalStorage() {
  let stringifyArr = JSON.stringify(ticketArr);
  localStorage.setItem("tickets", stringifyArr);
}
let nameInput = document.querySelector(".name");
let nameTaken = document.querySelector(".nameTaken");
// if(localStorage.getItem("name")!="-1"){
//     nameInput.target.style.display = "none";
//     let nameTaken = document.querySelector(".nameTaken");
//     nameTaken.innerHTML=localStorage.getItem("name");
//     nameTaken.style.display = "block";
    
// }
getLocalData();
nameTakenFn()



function nameTakenFn() {

    nameInput.addEventListener("keyup", (e) => {

      let value  =e.currentTarget.value

    if (e.key == "Enter") {

      localStorage.setItem("name",value);
      nameTaken.style.display = "block";
      nameTaken.innerHTML = value
      e.target.style.display = "none";
      changeData();

    }
  }
  
  
  );
}

function getLocalData(){

    if(localStorage.getItem("name")){
        nameInput.style.display="none";
        let str=localStorage.getItem("name");
        nameTaken.style.display = "block";
        nameTaken.innerHTML=str;
        changeData();
    }

}
function changeData(){
    nameTaken.addEventListener("dblclick",(e)=>{
                e.target.style.display ='none'
         nameInput.style.display="block";
 
    })
 
}