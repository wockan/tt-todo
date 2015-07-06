
class Todo:
    def __init__(self, title, active = True, sort_index = 0):
        self.id = 0
        self.title = title
        self.active = active
        self.sort_index = sort_index

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'active': self.active,
            'sort_index': self.sort_index
        }
