


var API = {
  url: 'http://127.0.0.1:5000/api'
};

API.Todo = {
  all: function(callback) {
    return $.ajax({
        type: 'GET',
        url: API.url + '/todos/',
        success: function(result) {
          callback(null, result.data);
        },
        error: function(err) {
          callback(err);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
      });
  },
  get: function(id, callback) {
    return $.ajax({
        type: 'GET',
        url: API.url + '/todos/'+ id + '/',
        success: function(result) {
          callback(null, result.data);
        },
        error: function(err) {
          callback(err);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
      });
  },
  create: function(todo, callback) {
    return $.ajax({
        type: 'POST',
        url: API.url + '/todos/',
        data: JSON.stringify(todo),
        success: function(result) {
          callback(null, result.data);
        },
        error: function(err) {
          callback(err);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
      });
  },
  update: function(todo, callback) {
    return $.ajax({
        type: 'PUT',
        url: API.url + '/todos/' + todo.id + '/',
        data: JSON.stringify(todo),
        success: function(result) {
          callback(null, result.data);
        },
        error: function(err) {
          callback(err);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
      });
  }
};





var TodoApp = React.createClass({
  getInitialState: function() {
    return {items: [], activeCount: 0};
  },
  componentDidMount: function() {
    API.Todo.all(function(err, items) {
      if(err) {
        return alert(JSON.stringify(err));
      }
      if (this.isMounted()) {
        this.setState({items: items});
        this.calculateItemsLeft();
      }

    }.bind(this));
  },
  reload: function(callback) {
    API.Todo.all(function(err, items) {
      if(err) {
        return alert(JSON.stringify(err));
      }
      this.setState({items: items});
      this.calculateItemsLeft();
      callback();
    }.bind(this));
  },
  createTodo: function(title, callback) {
    var self;
    var todo =  {
      title:title,
      active:true,
    };

    API.Todo.create(todo, function(err, item) {
      if(err) {
        return alert(JSON.stringify(err));
      }
      this.reload(function() {
        callback();
      });

    }.bind(this));
  },
  updateTodo: function(todo, callback) {
    API.Todo.update(todo, function(err) {
      if(err) {
        return alert(JSON.stringify(err));
      }
      this.state.items.map(function(item) {
        if(todo.id === item.id) {
          return todo;
        }
        return item;
      });
      this.setState({items: this.state.items});
      this.calculateItemsLeft();
      callback(err);
    }.bind(this));
  },
  calculateItemsLeft: function () {
    if(!this.state.items.length) {
      return;
    }

    var activeCount = 0;
    this.state.items.forEach(function(item) {
      if(item.active) {
        activeCount++;
      }
    });

    this.setState({activeCount:activeCount});

  },
  render: function() {
    return (
      <div>
        <div className="title-div">
          <span>Todos</span>
        </div>
        <TodoForm createTodo={this.createTodo} />
        <div className="list-div">
          <TodoList updateTodo={this.updateTodo} reload={this.reload} items={this.state.items} />
        </div>
        <div className="footer-div">
          <span></span>
          <span>{this.state.activeCount} items left</span>
          <TodoMarkAll updateTodo={this.updateTodo} items={this.state.items} />
        </div>
      </div>
    );
  }
});


var TodoForm = React.createClass({
  getInitialState: function() {
    return {title:''};
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.createTodo(this.state.title, function() {
      console.log(',,,,,,fMMMMMM')
      this.setState({title: ''});
    }.bind(this));
    return;
  },
  onChange: function(e) {
    this.setState({title: e.target.value});
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text"  name="title" onChange={this.onChange} value={this.state.title} placeholder="What needs to be done?"/>
        <input type="submit" className="btn btn-primary" name="add" value="Add Todo" />
      </form>
    );
  }

});

var TodoList = React.createClass({
  mixins: [SortableMixin],
  handleSort: function (evt) {
    var self = this;
    var fromItem = this.props.items[evt.oldIndex];
    var toItem = this.props.items[evt.newIndex];

    fromItem.sort_index = toItem.sort_index;
    this.props.updateTodo(fromItem,function(err) {
      self.props.reload(function() {
        // more code if needed
      });
    });
  },
  render: function() {
    var self = this;
    var createItem = function(item, index) {
      return (<TodoListItem key={item.id} updateTodo={self.props.updateTodo} item={item} index={index}/>);
    };
    return <ul onDragOver={this.dragOver} className="list-group">{this.props.items.map(createItem)}</ul>;
  }
});

var TodoListItem = React.createClass({

  onChange: function(e){
    var item = this.props.item;
    if(item.active) {
      item.active = false;
    } else {
      item.active = true;
    }

    this.props.updateTodo(item, function() {

    });
	},
  render: function() {
    var item = this.props.item;
    var index = this.props.index;
    var itemClasses = classNames(
      'list-group-item', {'gray': (index % 2) === 1}
    );
    var spanClass = classNames({'item-inactive': !item.active});
		return (
      <li className={itemClasses}>
        <input type="checkbox"  onChange={this.onChange} name="done" value="" checked={!item.active}/>
        <span className={spanClass}>{item.title}</span>
        <img src="/img/drag.png"/>
      </li>
		);
	}
});


var TodoMarkAll = React.createClass({
  onClick: function(e) {
    e.preventDefault();
    var self = this;
    var count = 0;
    var maxItems = this.props.items.length;
    if(!this.props.items.length) {
      return;
    }

    function inactiveAll(todo) {
      if(todo.active) {
        todo.active = false;
        return self.props.updateTodo(todo, function(err) {
          if(err) {
            return alert(JSON.stringify(err));
          }
          if(count >= maxItems) {
            return;
          }
          inactiveAll(self.props.items[count++]);
        });
      }
      if(count >= maxItems) {
        return;
      }
      inactiveAll(self.props.items[count++]);
    }


    inactiveAll(this.props.items[count++]);
  },
  render: function() {
    return (<a onClick={this.onClick} href="#">Mark all as complete</a>);
  }
});




React.render(<TodoApp />, document.getElementById('todo-container'));
