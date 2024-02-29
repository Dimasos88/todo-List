

let taskText = document.querySelector('.text-input');
let addTaskButton = document.querySelector('.add-task');
let taskListingBlock = document.querySelector('.task-listing-block');

let taskPriority = document.querySelector('#priority-select');
let taskPriorityFilter = document.querySelector('#priority-select-filter');

let dateSort = document.querySelector('input[name=checkbox-date]');
let prioritySort = document.querySelector('input[name=checkbox-priority]');

let taskStatusActive = document.querySelector('input[name=checkbox-active]');
let taskStatusComplited = document.querySelector('input[name=checkbox-complited]');
let taskStatusCanceled = document.querySelector('input[name=checkbox-canceled]');

let clearTasksButton = document.querySelector('.clear-tasks');

let tasksList = [];
let filterTasksList = [];


//Проверяем локал сторедж шо там есть

if (localStorage.getItem('taskListingBlock')) {
    tasksList = JSON.parse(localStorage.getItem('taskListingBlock'));
    showTasks(tasksList);
} 


// Делаем дату для вывода в блок
function makeDate() {
    const date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    minutes = date.getMinutes();
    const taskdate = [day, month, year].join('.') +" "+"/"+" "+ [hour, minutes].join(':');
    return taskdate;
}

//Считываем инпут, создаём объект и джесоним в локалсторедж
addTaskButton.addEventListener('click', function() {
    
    if (taskText.value) {
        let newTask = {
            text: taskText.value,
            priority: taskPriority.value,
            status: 'active',
            date: Number(new Date()),
            showdate: makeDate(),
        };
        dateSort.checked ? tasksList.unshift(newTask): tasksList.push(newTask);
    } else {
        alert('Задача пуста!');
    }
    showTasks(tasksList); 
    localStorage.setItem('taskListingBlock', JSON.stringify(tasksList));
    document.querySelector('.text-input').value = '';
})

filterTasksList = tasksList;

//Формируем блоки и добавляем их в вёрстку
function showTasks(List) {
    let showTask = '';
    if (tasksList.length === 0) taskListingBlock.innerHTML = '';
    if (filterTasksList.length === 0) taskListingBlock.innerHTML = '';
    
    List.forEach(function(item, i){
        const style = item.priority === 'a-low' ? 'a-low' : item.priority === 'b-middle' ? 'b-middle' : "c-high";
        const styleText = item.priority === 'a-low' ? 'низкий' : item.priority === 'b-middle' ? 'средний' : "высокий";
        showTask += 
                `<div class = "task-wrapper ">
                    <div class = "task-priority-wrapper">
                        <p class = "${style}-text">${styleText}</p>
                    </div>
                    <div class = "task ${style} ${item.status}"> 
                        <div class = "task-text-wrapper">
                            <p class = "task-text" id = "text-task-${i}">${item.text}</p>
                            <div class = "button-staus-task-wrapper">
                                <button class = "but-hov status-up" onclick = "statusUp(${i})"><img id = "status-up-${i}" src="/icons/check2.svg" alt="delete"></button>                       
                                <button class = "but-hov status-down" onclick = "statusDown(${i})"><img id = "status-down-${i}" src="/icons/Cancel.svg" alt="delete"></button>
                            </div>
                        </div>
                        <p class = "date-text">${item['showdate']}</p>
                    </div>
                    <div class = "button-task-wrapper">
                        <button class = "but-hov delete" onclick = "deleteTask(${i})"><img id = "task-${i}" src="/icons/trasher.svg" alt="delete"></button>
                    </div>
                </div>`;
        taskListingBlock.innerHTML = showTask;
        
    });
}

// Фильтруем массив заданий по приоритету

taskPriorityFilter.addEventListener("change", function() {
    filterTasksList = tasksList;
    if (this.value != 'any') {
        filterTasksList = tasksList.filter((item) => item.priority == this.value);
        console.log(filterTasksList);
    } else {
        filterTasksList = tasksList;
    }
    showTasks(filterTasksList);
});


//Фильтруем массив заданий по статусу
document.querySelector('.status-filter-wrapper').addEventListener('change', function() {
    let arr1 = [];
    let arr2 = [];
    let arr3 = [];

    if (taskStatusActive.checked) {
        arr1 = tasksList.filter((item) => item['status'] === 'active');
    } else if (!taskStatusActive.checked) {
        arr1 = [];
    }

    if (taskStatusCanceled.checked) {
        arr3 = tasksList.filter((item) => item['status'] === 'canceled');
    } else if (!taskStatusCanceled.checked) {
        arr3 = [];
    }

    if (taskStatusComplited.checked) {
        arr2 = tasksList.filter((item) => item['status'] === 'complited');
    } else if (!taskStatusComplited.checked) {
        arr2 = [];
    }

    filterTasksList = [].concat(arr2, arr1, arr3);
    showTasks(filterTasksList);
});



//Сортировка по дате
dateSort.addEventListener('change', function() {
if  (dateSort.checked) {
        sortListUp(filterTasksList, 'date');
} 
if  (!dateSort.checked) {
        sortListDown(filterTasksList, 'date');
}
});

//Сортировка по приоритету
prioritySort.addEventListener('change', function() {
    if  (this.checked) {
        sortListUp(tasksList, 'priority');
    } else {
        sortListDown(tasksList, 'priority'); 
    }
});

// Фунуции для сортировки
function sortListUp(arr, prop) {
    arr.sort((a, b) => (
        a[prop] < b[prop] ? 1 : b[prop] < a[prop] ? -1 : 0));
    showTasks(arr);
}

function sortListDown(arr, prop) {
    arr.sort((a, b) => (
        a[prop] > b[prop] ? 1 : b[prop] > a[prop] ? -1 : 0));
    showTasks(arr);
}


// Отчистка всех заданий
clearTasksButton.addEventListener('click', function() {
    if (confirm("вы уверены?")) {
        clear();
    }  
});

//Функция для отчистки всех заданий
function clear() {
    localStorage.clear();
    location.reload();
}

//Удаление задания 
function deleteTask(index) {
    if (confirm('вы уверены?')) {
        tasksList = tasksList.filter((item) => item !== (filterTasksList[index]));
        filterTasksList.splice(index, 1);
        showTasks(filterTasksList);
        localStorage.setItem('taskListingBlock', JSON.stringify(tasksList));
    }
}


// Изменение статуса заданий

//Повышение статуса
function statusUp(index) {
    switch(tasksList[index].status) {
        case "active":
            tasksList[index].status = 'complited';
            break;
        case "canceled":
            tasksList[index].status = 'active';
            break;
    }
    showTasks(tasksList);
    localStorage.setItem('taskListingBlock', JSON.stringify(tasksList));
}

//Понижение статуса
function statusDown(index) {
    switch(tasksList[index].status) {
        case "active":
            tasksList[index].status = 'canceled';
            break;
        case "complited":
            tasksList[index].status = 'active';
            break;
    }
    showTasks(tasksList);
    localStorage.setItem('taskListingBlock', JSON.stringify(tasksList));
}

