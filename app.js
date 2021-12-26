let windowArr = [];

// handle dropDowns
const list = document.getElementsByClassName("haveChildren");
for (let i = 0; i < list.length; i++) {
  list[i].addEventListener("click", (e) => {
    e.currentTarget.classList.toggle("active");
  });
}

//handle menu(toggle)
const menuBtn = document.getElementById("toggleMenu");

menuBtn.addEventListener("click", () => {
  const menu = document.getElementsByClassName("leftNavigation")[0];
  const searchContainer = document.getElementsByClassName("searchContainer")[0];
  const paragContainer = document.getElementsByClassName("listContentWrapper");

  for (let i = 0; i < paragContainer.length; i++) {
    //hide paragraph
    paragContainer[i].querySelector("p").classList.toggle("displayNone");

    //hide dropdown arrow
    if (paragContainer[i].children[1]) {
      paragContainer[i].children[1].classList.toggle("displayNone");
    }

    //close active lists
    if (paragContainer[i].parentNode.classList.contains("active")) {
      paragContainer[i].parentNode.classList.toggle("active");
    }
    paragContainer[i].classList.toggle("closedMenu");
  }

  searchContainer.classList.toggle("displayNone");
  menu.classList.toggle("closeMenu");

  checkForDraggableWindows();
});

const listItem = document.getElementsByClassName("dragItem");
const container = document.getElementsByClassName("draggableContent")[0];

//menuItems click listener
for (let i = 0; i < listItem.length; i++) {
  listItem[i].addEventListener("click", (e) => {
    e.stopPropagation();
    const menuItemName = listItem[i].children[0].children[1].innerHTML;

    if (container.children[0]) {
      let duplicate = checkDuplicateTabs(container.children[0], menuItemName);

      if (duplicate !== true) {
        const container =
          document.getElementsByClassName("tabNameContainer")[0];
        addTab(container, menuItemName);
        showContent(container, menuItemName);
      } else {
        makeTabActive(container.children[0], menuItemName);
      }
    } else {
      createWindow(menuItemName);
    }
  });
}

//create new window
function createWindow(tabName) {
  const ID = detectID();

  const window = document.createElement("div");
  window.classList.add("Window");
  window.setAttribute("id", ID);
  container.appendChild(window);

  //window headers start here

  const tabHeader = document.createElement("div");
  tabHeader.classList.add("tabHeader");
  window.appendChild(tabHeader);

  tabHeader.addEventListener("dragend", windowDragEnd);

  const tabNameContainer = document.createElement("div");
  tabNameContainer.classList.add("tabNameContainer");
  tabHeader.appendChild(tabNameContainer);

  addBtns(tabHeader);
  addTab(tabNameContainer, tabName);

  //ends here
  //window content starts here
  const UserView = document.createElement("div");
  UserView.classList.add("UserView");
  window.appendChild(UserView);

  UserView.innerHTML = `${tabName} content`;
}

//on mouseUp place window on coursor position
function windowDragEnd(e) {
  const container = e.currentTarget.parentNode;

  container.classList.add("absolute");
  let width = window.getComputedStyle(e.currentTarget).width;
  let positionX = e.clientX - parseInt(width) / 2;
  let positionY = e.clientY;

  const navWrapper = document.getElementsByClassName("navigationWrapper")[0];
  const navWidth = window.getComputedStyle(navWrapper).width;
  //if(user tries to take window left on leftNav) => stop window
  if (positionX < parseInt(navWidth)) {
    positionX = navWidth + 5;
  }
  //if(user tries to take window above topNav) => stop window
  if (positionY < 41) {
    positionY = 42;
  }

  container.style.cssText = `left: ${positionX}px; top: ${positionY}px`;
}

//create window buttons(minimize, maximize, close)
function addBtns(containerName) {
  const BtnContainer = document.createElement("div");
  BtnContainer.classList.add("windowBtns");

  const minimizeBtn = document.createElement("button");
  const maximizeBtn = document.createElement("button");
  const closeBtn = document.createElement("button");

  closeBtn.classList.add("windowCloseBtn");
  maximizeBtn.classList.add("windowMaximizeBtn");
  minimizeBtn.classList.add("windowMinimizeBtn");

  minimizeBtn.innerHTML = `<i class="fas fa-window-minimize"></i>`;
  maximizeBtn.innerHTML = `<i class="fas fa-window-maximize"></i>`;
  closeBtn.innerHTML = `<i class="fas fa-times"></i>`;

  BtnContainer.appendChild(minimizeBtn);
  BtnContainer.appendChild(maximizeBtn);
  BtnContainer.appendChild(closeBtn);

  containerName.appendChild(BtnContainer);

  closeBtn.addEventListener("click", (e) => {
    closeWindow(e.currentTarget);
  });

  minimizeBtn.addEventListener("click", minimizeWindow);

  maximizeBtn.addEventListener("click", maximizeWindow);
}

function detectID() {
  if (windowArr.length === 0) {
    windowArr.push(0);
    return 0;
  } else {
    return windowArr.length;
  }
}

//create new tab
function addTab(container, name) {
  if (container.children) {
    checkForActiveTab(container.children);
  }

  const Rhombus = document.createElement("div");
  Rhombus.classList.add("Rhombus", "activeTab");
  container.appendChild(Rhombus);

  const leftCrop = document.createElement("div");
  leftCrop.classList.add("leftCrop");
  Rhombus.appendChild(leftCrop);

  const tabName = document.createElement("span");
  tabName.classList.add("tabName");
  Rhombus.appendChild(tabName);

  const rightCrop = document.createElement("div");
  rightCrop.classList.add("rightCrop");
  Rhombus.appendChild(rightCrop);

  const paragraph = document.createElement("p");
  paragraph.innerHTML = name;
  tabName.appendChild(paragraph);

  const closeIcn = document.createElement("i");
  closeIcn.classList.add("fas", "fa-times", "closeTab");
  tabName.appendChild(closeIcn);

  Rhombus.addEventListener("click", () => {
    checkForActiveTab(container.children);
    Rhombus.classList.add("activeTab");
    showContent(container, name);
  });

  Rhombus.addEventListener("dragstart", dragStart);

  Rhombus.addEventListener("dragend", dragEnd);

  closeIcn.addEventListener("click", closeTab);
}

//close tab when clicking on close icn
function closeTab(e) {
  const tab = e.currentTarget.parentNode.parentNode;

  //if(closedTab === activeTab) => make last tab active
  if (tab.classList.contains("activeTab")) {
    const index = tab.parentNode.children.length - 1;
    tab.parentNode.children[index].classList.add("activeTab");
  }

  //if(closingTab === lastTabInWindow) => close window
  if (tab.parentNode.children.length === 1) {
    closeWindow(e.currentTarget.parentNode.parentNode);
  } else {
    tab.remove();
  }
}

//check for duplicate tabs
function checkDuplicateTabs(container, newName) {
  const tabnameContainer = container.children[0].children[0].children;
  for (let i = 0; i < tabnameContainer.length; i++) {
    const currentNames = tabnameContainer[i].children[1].children[0].innerHTML;
    if (currentNames === newName) {
      return true;
    }
  }
}

//if any active tab => remove them
function checkForActiveTab(container) {
  for (let i = 0; i < container.length; i++) {
    if (container[i].classList.contains("activeTab")) {
      container[i].classList.remove("activeTab");
    }
  }
}

function closeWindow(element) {
  windowArr.splice(windowArr.length - 1, 1);
  const window = element.parentNode.parentNode.parentNode;
  window.remove();
}

function maximizeWindow(e) {
  const window = e.currentTarget.parentNode.parentNode.parentNode;
  window.classList.toggle("absolute");
}

function minimizeWindow() {
  const container = document.getElementsByClassName("mainContent")[0];
  //if(there is no taskbar created) => create taskbar
  if (!container.children[2]) {
    const taskBar = document.createElement("div");
    taskBar.classList.add("taskBar");
    container.appendChild(taskBar);
  }

  const taskBar = document.getElementsByClassName("taskBar")[0];

  //create more space for taskbar
  const draggableContent =
    document.getElementsByClassName("draggableContent")[0];
  draggableContent.classList.add("taskBarOpened");

  const currentWindow = this.parentNode.parentNode.parentNode;
  currentWindow.classList.add("none");

  const minimizedItem = document.createElement("div");
  minimizedItem.classList.add("minimizedItem");
  minimizedItem.innerHTML = `window #${currentWindow.id}`;
  minimizedItem.setAttribute("id", currentWindow.id);
  taskBar.appendChild(minimizedItem);

  minimizedItem.addEventListener("click", openWindowFromTaskBar);
}

//on click taskbar icon maximize content back to window
function openWindowFromTaskBar(e) {
  const ID = e.currentTarget.id;
  const windows = document.getElementsByClassName("Window");
  const taskBar = e.currentTarget.parentNode;

  for (let i = 0; i < windows.length; i++) {
    if (windows[i].id === ID) {
      windows[i].classList.remove("none");
    }
  }
  e.currentTarget.remove();
  //if(no minimized items left in taskbar) => delete taskbar
  if (taskBar.children.length === 0) {
    taskBar.previousElementSibling.classList.remove("taskBarOpened");
    taskBar.remove();
  }
}

function dragStart(e) {
  if (e.currentTarget.parentNode.children.length > 1) {
    this.setAttribute("draggable", true);
  }
}

function dragEnd(e) {
  //if(user is not dragging last tab in window)
  if (e.currentTarget.parentNode.children.length > 1) {
    this.setAttribute("draggable", false);

    const element = this.parentNode.getBoundingClientRect();

    let parentContainerPosition = {
      top: element.top + window.pageYOffset,
      left: element.left + window.pageXOffset,
    };

    //if(mouse position (top/bot) is (greater/less) then current elements parentContainer position) => create new window
    if (
      e.clientY - 30 > parentContainerPosition.top ||
      e.clientY < parentContainerPosition.top
    ) {
      const tabName = e.currentTarget.children[1].children[0].innerHTML;
      createWindow(tabName);
      e.currentTarget.remove();
    }
  }
}

function showContent(container, tabName) {
  if (!container.classList.contains("Window")) {
    //recursion until container is not window
    showContent(container.parentNode, tabName);
  } else {
    container.children[1].innerHTML = `${tabName} content`;
  }
}

//take windows away from navigation
function checkForDraggableWindows() {
  const windows = document.getElementsByClassName("Window");
  const navWrapper = document.getElementsByClassName("navigationWrapper")[0];
  const navWidth = window.getComputedStyle(navWrapper).width;
  //if(menuOpens and there is userWindow) => place them in correct place
  if (windows) {
    for (let i = 0; i < windows.length; i++) {
      let windowLeft = window.getComputedStyle(windows[i]).left;
      if (windowLeft < navWidth) {
        windows[i].style.cssText = `left: ${navWidth + 5}px`;
      }
    }
  }
}

//if(userClicked on already created tab) => make that tab active
function makeTabActive(container, name) {
  const tabNamesContainer = container.children[0].children[0].children;
  for (let i = 0; i < tabNamesContainer.length; i++) {
    if (tabNamesContainer[i].children[1].children[0].innerHTML !== name) {
      if (tabNamesContainer[i].classList.contains("activeTab")) {
        tabNamesContainer[i].classList.remove("activeTab");
      }
    } else {
      if (!tabNamesContainer[i].classList.contains("activeTab")) {
        tabNamesContainer[i].classList.add("activeTab");
        showContent(container, name);
      }
    }
  }
}
