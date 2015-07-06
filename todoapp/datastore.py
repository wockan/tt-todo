from copy import deepcopy

class DataStore:
    """ simple datastore for todos """
    increment_id = 0

    def __init__(self):
        self.todos = []

    def add(self, todo):
        self.increment_id += 1
        todo.id = self.increment_id
        sort_index = len(self.todos) + 1
        self.todos.append(todo)

        #if not default sort_index sort and update list
        if todo.sort_index is not 0:
            self.updateSort(todo, sort_index)
            self.sort();
        else:
            todo.sort_index = sort_index
        return deepcopy(todo)

    def update(self, todo):
        updateTodo = None
        for todoItem in self.todos:
            if todo.id == todoItem.id:
                updateTodo = todoItem

        if updateTodo == None:
            return None

        updateTodo.title = todo.title
        updateTodo.active = todo.active
        old_sort_index = updateTodo.sort_index
        #if sort_index changed sort and update list
        if updateTodo.sort_index is not todo.sort_index:
            updateTodo.sort_index = todo.sort_index
            self.updateSort(updateTodo, old_sort_index)
            self.sort()

        return deepcopy(updateTodo)

    def getById(self, id):
        for todo in self.todos:
            if todo.id == id:
                return deepcopy(todo)
        return None

    def all(self):
        return deepcopy(self.todos)

    def updateSort(self, todo, old_sort_index):
        for item in self.todos:
            if item.id is todo.id:
                continue
            #rearamge the list
            if todo.sort_index < old_sort_index:
                if old_sort_index >= item.sort_index and item.sort_index >= todo.sort_index:
                    item.sort_index = item.sort_index + 1
            else:
                if old_sort_index <= item.sort_index and item.sort_index <= todo.sort_index:
                    item.sort_index = item.sort_index - 1

        return todo

    def sort(self):
        self.todos = sorted(self.todos, key=lambda todo: todo.sort_index)
