const TODO_OPERATIONS = {
    tasks:[],
    task:null,
    getTasks() {
        return this.tasks;
    },
    add({tid, name, desc, date, url, pr}){
        let todo = new Todo(tid, name, desc, date, url, pr);
        this.tasks.push(todo);
        return todo;
    },
    convert({id, name, desc, date, url, pr}){
        let todo = new Todo(id, name, desc, date, url, pr);
        this.tasks.push(todo);
        return todo;
    },
    remove(){
        this.tasks = this.tasks.filter(task=>!task.markedDelete)
        return this.tasks;
    },
    setTask(task){
        this.task = task;
    },
    getTask(){
        return this.task;
    },
    searchById(id){
        return this.tasks.find((task)=>task.id==id);
    },
    searchByName(name){
        return this.tasks.filter((task)=>task.name==name);
    },
    countMark() {
        return this.tasks.filter(task=>task.markedDelete).length;
    },
    countUnmark() {
        return this.tasks.length - this.countMark();
    },
    sortd(col){
        if (col=='name') {
            this.tasks.sort((first,second)=>first['name'].localeCompare(second['name']));
        }
        else {
            this.tasks.sort((first,second)=>first[col]-second[col]);
        }
    },
    sorta(col){
        if (col=='name') {
            this.tasks.sort((first,second)=>second['name'].localeCompare(first['name']));
        }
        else {
            this.tasks.sort((first,second)=>second[col]-first[col]);
        }
    },
    read(){

    }
}