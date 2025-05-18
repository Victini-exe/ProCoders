from flask_restful import Resource, reqparse
from flask_security import auth_required, current_user, roles_required, roles_accepted
from ..database import db
from ..models import Todo

class TodoListResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('title', type=str, required=True, help='Title is required')
        self.parser.add_argument('description', type=str, required=False, help='Description is optional')

    @auth_required()
    @roles_required('admin')
    def get(self):
        todos = Todo.query.all()
        return [todo.to_dict() for todo in todos], 200

    
class TodoResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('title', type=str, required=True, help='Title is required')
        self.parser.add_argument('description', type=str, required=False, help='Description is optional')
        self.parser.add_argument('completed', type=bool, required=False, default=False, help='Completed status')

    @auth_required()
    @roles_accepted('admin', 'user')
    def get(self, todo_id):
        todo = Todo.query.get_or_404(todo_id)
        return todo.to_dict(), 200
    
    @auth_required()
    @roles_accepted('user')
    def post(self):
        args = self.parser.parse_args()
        todo = Todo(title=args['title'], description=args.get('description'), user_id=current_user.id)
        db.session.add(todo)
        db.session.commit()
        return todo.to_dict(), 201

    @auth_required()
    @roles_accepted('user')
    def put(self, todo_id):
        args = self.parser.parse_args()
        todo = Todo.query.get_or_404(todo_id)
        todo.title = args['title']
        todo.description = args.get('description')
        todo.completed = args['completed']
        db.session.commit()
        return todo.to_dict(), 200

    @auth_required()
    @roles_accepted('user')
    def delete(self, todo_id):
        todo = Todo.query.get_or_404(todo_id)
        db.session.delete(todo)
        db.session.commit()
        return {'message': 'Todo deleted successfully'}, 204