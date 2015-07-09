from todoapp.resources import app, datastore
from flask import jsonify
from flask.ext.restful import Resource, reqparse
from todoapp.models.todo import Todo

class TodoListView(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('title', type=str,
                                    required=True,
                                    help="No task title",
                                    location='json')
        self.reqparse.add_argument('active', type=bool,
                                    default=True,
                                    location='json')
        self.reqparse.add_argument('sort_index', type=int, location='json')
        super(TodoListView, self).__init__()

    def get(self):
        return jsonify(data=[todo.serialize() for todo in datastore.all()])

    def post(self):
        args = self.reqparse.parse_args()
        todo = Todo(args['title'],args['active'])
        if args['sort_index'] is not None:
            todo.sort_index = args['sort_index']
        datastore.add(todo);
        return jsonify(data=todo.serialize())

class TodoView(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('title', type=str, location='json')
        self.reqparse.add_argument('active', type=bool, location='json')
        self.reqparse.add_argument('sort_index', type=int, location='json')
        super(TodoView, self).__init__()

    def get(self, id):
        todo = datastore.getById(int(id))
        if todo is None:
            return 404, 404
        return jsonify(data=todo.serialize())

    def put(self, id):
        todo = datastore.getById(int(id))
        if todo is None:
            return 404, 404

        #Update the object
        args = self.reqparse.parse_args()
        todo.title = args['title']
        todo.active = args['active']
        todo.sort_index = args['sort_index']
        todo = datastore.update(todo)

        return jsonify(data=todo.serialize())

    def delete(self, id):
        return {'result': True}
