let taskText = document.querySelector('.text-input');
let searchText = document.querySelector('.text-search');

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

//Проверяем бэк шо там есть
async function checkData() {
    await getTasks();
    showTasks(tasksList);
    filterTasksList = tasksList;
}
checkData();

// Делаем дату для вывода в блок
function makeDate() {
    const taskdate = new Intl.DateTimeFormat("ru", {dateStyle: "short", timeStyle: "short"}).format(new Date()).replace(',',' / ');
    return taskdate;
}

//Считываем инпут, создаём объект и джесоним в локалсторедж
addTaskButton.addEventListener('click', function() {
    if (taskText.value.trim()) {
        let newTask = {
            text: taskText.value,
            priority: taskPriority.value,
            status: 'd-active',
            state: 'normal',
            date: Number(new Date()),
            showdate: makeDate(),
        };
        dateSort.checked ? tasksList.unshift(newTask): tasksList.push(newTask);
        postTask(newTask);
        
    } else {
        alert('Задача пуста!');
    }
    checkData();
    localStorage.setItem('taskListingBlock', JSON.stringify(tasksList));
    document.querySelector('.text-input').value = '';
})

//Формируем блоки и добавляем их в вёрстку
function showTasks(List) {
    // console.log("после вызова шоу таска", tasksList);
    // console.log("после вызова шоу таска фильтр", filterTasksList);
    let showTask = '';
    if (tasksList.length === 0) {
        taskListingBlock.innerHTML = '';
    }
    if (filterTasksList.length === 0) {
        taskListingBlock.innerHTML = '';
    }
    List.forEach(function(item, i){
        const style = item.priority === 'a-low' ? 'a-low' : item.priority === 'b-middle' ? 'b-middle' : "c-high";
        const styleText = item.priority === 'a-low' ? 'низкий' : item.priority === 'b-middle' ? 'средний' : "высокий";
        showTask += 
            `<div class = "task-wrapper" >
                    <div class = "task-priority-wrapper">
                        <p class = "${style}-text">${styleText}</p>
                    </div>
                    <div class = "task ${style} ${item.status}"> 
                        <div class = "task-text-wrapper" >
                            <p class = "task-text state-text-${item.state}  id = "text-task-${i}" onclick = "stateChange(${item.id})">${item.text}</p>
                            <div class = "state-${item.state}"><input type="text" id="task-input-redact-${item.id}" name="name" class="text-input-redact" value = "${tasksList[i].text}" onclick = "textChange(${item.id}, ${i})"></div>
                            <div class = "button-staus-task-wrapper">
                                <button class = "but-hov status-up but-up-${item.status}" onclick = "statusUp(${item.id}, '${item.status}')"><img id = "status-up-${i}" src="/icons/check2.svg" alt="delete"></button>                       
                                <button class = "but-hov status-down but-down-${item.status}" onclick = "statusDown(${item.id}, '${item.status}')"><img id = "status-down-${i}" src="/icons/Cancel.svg" alt="delete"></button>
                            </div>
                        </div>
                        <p class = "date-text">${item['showdate']}</p>
                    </div>
                    <div class = "button-task-wrapper">
                        <button class = "but-hov delete" onclick = "deleteTasks(${item.id})"><img id = "task-${i}" src="/icons/trasher.svg" alt="delete"></button>
                    </div>
                </div>`;
        taskListingBlock.innerHTML = showTask;
    });
}

filterTasksList = tasksList;

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
        arr1 = tasksList.filter((item) => item['status'] === 'd-active');
    } else if (!taskStatusActive.checked) {
        arr1 = [];
    }

    if (taskStatusCanceled.checked) {
        arr3 = tasksList.filter((item) => item['status'] === 'canceled');
    } else if (!taskStatusCanceled.checked) {
        arr3 = [];
    }

    if (taskStatusComplited.checked) {
        arr2 = tasksList.filter((item) => item['status'] === 'z-complited');
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
    else if  (!dateSort.checked) {
            sortListDown(filterTasksList, 'date');
    }
});

//Сортировка по приоритету
prioritySort.addEventListener('change', function() {
    if  (prioritySort.checked) {
        sortListUp(filterTasksList, 'priority');
    } 
    else if (!prioritySort.checked) {
        sortListDown(filterTasksList, 'priority'); 
    }
});

// Фунуции для сортировки
function sortListUp(arr, prop) {
    arr.sort((a, b) => (a[prop] < b[prop] ? 1 : b[prop] < a[prop] ? -1 : 0));
    showTasks(arr);
}

function sortListDown(arr, prop) {
    arr.sort((a, b) => (a[prop] > b[prop] ? 1 : b[prop] > a[prop] ? -1 : 0));
    showTasks(arr);
}

//Поиск по тексту
searchText.addEventListener('input', function() {
    let searchTextLength = this.value.trim().length;
    if (this.value.length > 2) {
        let searchedTasks = filterTasksList.filter((item) => item.text.substr(0, searchTextLength).toLowerCase() == this.value.toLowerCase().trim());
        showTasks(searchedTasks);
    } else {
        showTasks(filterTasksList);
    }     
})

//------------------------------------------------------------------------//

//Добавление задачи (типа на бэк)
async function postTask(task) {
    await fetch('http://127.0.0.1:3000/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(task),
    });
}

//Получение задач (типа с бэка)
async function getTasks() {
    let response = await fetch('http://127.0.0.1:3000/items');
    tasksList = await response.json();
}

//Удаление задач (типа с бэка)
async function deleteTasks(id) {
    if (confirm("Вы уверены?")) {
        await fetch(`http://127.0.0.1:3000/items/${id}`, {
            method: 'DELETE'
        });
        filterTasksList = filterTasksList.filter((item) => item.id != id);
    }
    await checkData();
}

//Изменение стутуса задач (типа с бэка)
async function statusUp(id, someStatus) {
    let newStatus = someStatus == 'd-active' ? 'z-complited': someStatus == 'canceled' ? 'd-active' : "не пон";

    await fetch(`http://127.0.0.1:3000/items/${id}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({status: newStatus}),
    });
    await checkData();
    sortListUp(filterTasksList, 'status');
}

async function statusDown(id, someStatus) {
    let newStatus = someStatus == 'd-active' ? 'canceled': someStatus == 'z-complited' ? 'd-active' : "не пон";

    await fetch(`http://127.0.0.1:3000/items/${id}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({status: newStatus}),
    });
    await checkData();
    sortListUp(filterTasksList, 'status');
}

//Редактирование текста на бэке
async function stateChange(id) {
    await fetch(`http://127.0.0.1:3000/items/${id}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({state: 'redacted'}),
    });
    await checkData();
}

async function textChange(id, index) {
    document.querySelector(`#task-input-redact-${id}`).value = tasksList[index].text;

    document.querySelector(`#task-input-redact-${id}`).addEventListener('keydown', async function(event) {
        if (event.keyCode == 13) {
            await fetch(`http://127.0.0.1:3000/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({state: 'normal', text: this.value})
            });
            await checkData();
        }
    });
}