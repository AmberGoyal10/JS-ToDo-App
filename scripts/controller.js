// Glue between view and model
window.addEventListener('DOMContentLoaded', init);

function init() {
    bindEvent();
    initSort();
    updateCount();
}

function bindEvent() {
    document.querySelector('#add').addEventListener('click', addTask);
    document.querySelector('#delete').addEventListener('click', deleteTask);
    document.querySelector('#save').addEventListener('click', save);
    document.querySelector('#load').addEventListener('click', load);
    document.querySelector('#update').addEventListener('click', updateTask);
    document.querySelector('#search').addEventListener('click', search);
    document.querySelector('#sort').addEventListener('click', sort);
    document.querySelector('#seacrhText').addEventListener('click', searchText);
}

function initSort() {
    document.querySelector('#sortId').addEventListener('click', sortId);
    document.querySelector('#sortName').addEventListener('click', sortName);
    document.querySelector('#sortPr').addEventListener('click', sortPr); 
}

function addTask() {
    const tempObject = {tid:'', name:'', desc:'', date:'', url:'', pr:''};
    for (let key in tempObject) {
        tempObject[key] = document.querySelector("#"+key).value;
    }
    const todo = TODO_OPERATIONS.add(tempObject);
    printTask(todo);
    updateCount();
    clearAllFields();
}

function clearAllFields() {
    const tempObject = {tid:'', name:'', desc:'', date:'', url:'', pr:''};
    for (let key in tempObject) {
        document.querySelector('#'+key).value = null;
    }
    document.querySelector('#tid').focus();
}

function printTask(todo) {
    let tbody = document.querySelector('#tasks');
    let tr = tbody.insertRow();
    let index = 0;
    for (let key in todo) {
        if (key == 'markedDelete') continue;
        if (key == 'url') {
            let td = tr.insertCell(index);
            td.appendChild(getPhoto(todo[key]));
            index++;
            continue;
        }
        tr.insertCell(index).innerText = todo[key];
        index++;
    }
    let td = tr.insertCell(index);
    td.appendChild(addIcons('edit', edit, todo.id));
    td.appendChild(addIcons('delete', markDelete, todo.id));
}

function getPhoto(url) {
    let img = document.createElement('img');
    img.src = url;
    img.className="size";
    img.addEventListener('click', gotoUrl);
    return img;
}

function gotoUrl() {
    window.open(this.getAttribute('src'));
}

function edit() {
    let img = this;
    let id = img.getAttribute('taskid');
    let taskObj = TODO_OPERATIONS.searchById(id);
    if (taskObj) {
        showTask(taskObj);
        TODO_OPERATIONS.setTask(taskObj);
    }
}

function showTask(taskObj) {
    for (let key in taskObj) {
        if (key == 'id') {
            document.querySelector(`#tid`).value = taskObj[key];
        }
        else if (key == 'markedDelete') continue;
        else {
            document.querySelector(`#${key}`).value = taskObj[key];
        }
    }
    document.querySelector('#update').setAttribute('updatetask', taskObj);
}

function updateTask() {
    let taskObj = TODO_OPERATIONS.getTask();
    if (taskObj) {
        for (let key in taskObj) {
            if (key == 'id') {
                taskObj[key] = document.querySelector("#tid").value;
                continue;    
            }
            if (key == 'markedDelete') continue;
            taskObj[key] = document.querySelector("#"+key).value;
        }
        TODO_OPERATIONS.setTask(null);
        clearAllFields();
        printTable(TODO_OPERATIONS.getTasks());
        modal("Sucess", "Task Updated");
    }
    else {
        modal('Error', 'Nothing selected to Update');
    }
}

function markDelete() {
    let img = this;
    let id = img.getAttribute('taskid');
    let taskObj = TODO_OPERATIONS.searchById(id);
    if(taskObj) {
        taskObj.toggle();
        updateCount();
    }
    let tr = img.parentNode.parentNode;
    tr.classList.toggle('alert-danger');
}

function addIcons(imageName, callBackFn, id) { 
    let img = document.createElement('img');
    img.src = `assets/images/${imageName}.png`;
    img.className="size mr-2";
    img.setAttribute('taskid', id);
    img.addEventListener('click', callBackFn);
    return img;
}

function updateCount() {
    document.querySelector('#total').innerText = TODO_OPERATIONS.getTasks().length;
    document.querySelector('#mark').innerText = TODO_OPERATIONS.countMark();
    document.querySelector('#unmark').innerText = TODO_OPERATIONS.countUnmark();
}

function deleteTask() {
    let tasks = TODO_OPERATIONS.remove();
    printTable(tasks);
}

const clearTable = () => document.querySelector('#tasks').innerHTML = null;

function printTable(tasks) {
    clearTable();
    //tasks.forEach(task=>printTask(task));
    tasks.forEach(printTask);
    updateCount();
}

function save() {
    if (window.localStorage) {
        let tasks = {'tasks': TODO_OPERATIONS.getTasks()};
        localStorage.tasks = JSON.stringify(tasks);
        modal("Success", "Records Saved");
    }
    else {
        modal("Error", "Browser is Outdated");
    }
}

function load() {
    if (window.localStorage) {
        if (localStorage.tasks) {
            let data = JSON.parse(localStorage.tasks);
            data.tasks.forEach(task=>{
                TODO_OPERATIONS.convert(task);
            });
            if (TODO_OPERATIONS.tasks.length!=0) {
                printTable(TODO_OPERATIONS.getTasks());
                modal("Success", "Records Loaded");
            }
            else {
                modal("Error", "No Data to Load");
            }
        }
        else {
            modal("Error", "No Data to Load");
        }
    }
    else {
        modal("Error", "Browser is Outdated");
    }
}

function modal(title, body) {
    document.querySelector('#modalLabel').innerText = title;
    document.querySelector('.modal-body').innerText = body;
}

function sort() {
    let sortButtons = document.querySelectorAll('.sortButton');
    sortButtons.forEach(button=>{
        if(button.style.display=='none') {
            button.style.display = 'block';
        }
        else {
            button.style.display = 'none'
        }
    });
}

function sortId() {
    if (this.getAttribute('order')=='des') {
        TODO_OPERATIONS.sortd('id');
        this.setAttribute('order', 'ase')
    }
    else {
        TODO_OPERATIONS.sorta('id');
        this.setAttribute('order', 'des');
    }
    printTable(TODO_OPERATIONS.getTasks());
}

function sortName() {
    if (this.getAttribute('order')=='des') {
        TODO_OPERATIONS.sortd('name');
        this.setAttribute('order', 'ase')
    }
    else {
        TODO_OPERATIONS.sorta('name');
        this.setAttribute('order', 'des');
    }
    printTable(TODO_OPERATIONS.getTasks());
}

function sortPr() {
    if (this.getAttribute('order')=='des') {
        TODO_OPERATIONS.sortd('pr');
        this.setAttribute('order', 'ase')
    }
    else {
        TODO_OPERATIONS.sorta('pr');
        this.setAttribute('order', 'des');
    }
    printTable(TODO_OPERATIONS.getTasks());
}

function search() {
    let bar = document.querySelector('.searchBar');
    if(bar.style.display == 'none') {
        bar.style.display = 'inline';
    }
    else {
        bar.style.display = 'none';
    }
}

function searchText() {
    let text = document.querySelector('#seacrhTextbox').value;
    let tasks;
    if (text=='') {
        tasks = TODO_OPERATIONS.getTasks();
    }
    else {
        tasks = TODO_OPERATIONS.searchByName(text);
    }
    
    printTable(tasks);
}
