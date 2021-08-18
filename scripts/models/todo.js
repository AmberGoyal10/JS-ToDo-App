class Todo {
    constructor(id, name, desc, date, url, pr) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.date = date;
        this.url = url;
        this.pr = pr;
        this.markedDelete = false;
    }
    toggle() {
        this.markedDelete = !this.markedDelete;
    }
}