from flask import Flask
from flask.ext.restful import Api, Resource
app = Flask(__name__, static_folder='static', static_url_path='')
api = Api(app)




# Init code for the test

from todoapp.datastore import DataStore
from todoapp.models.todo import Todo

datastore = DataStore()
datastore.add(Todo('One thing', True))
datastore.add(Todo('Two thing', False))
datastore.add(Todo('Three thing', True))

from todoapp.resources.todo import TodoListView, TodoView


api.add_resource(TodoListView, '/api/todos/', endpoint='todos')
api.add_resource(TodoView, '/api/todos/<int:id>/', endpoint='todo')


## Root index


# Maybe there is a better way? 
@app.route('/')
def root():
    return app.send_static_file('index.html')
