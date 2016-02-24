var todoApp=angular.module("todoApp",['ngRoute']);

todoApp.config(function($routeProvider){
  $routeProvider
  .when('/',{templateUrl:'todo-list.html',controller:'viewController'})
  .when('/items',{templateUrl:'todo-item.html',controller:'editController'})
});

todoApp.filter('range',function(){
  return function(input,min,max){
    var input=[];
    for (i=min;i<=max;i++){
      input.push(i);
    }
    return input;
  }
})

todoApp.service('todoListService',function($http){
  var todo=[];
  return {
    addTodo:function(data){
      var len=todo.length;
      todo.push({"id":len,"text":data});
      this.setTodo(len,data);
    },
    getTodo:function(id){
      if(todo.length==0){
        todo=JSON.parse(localStorage.todo);
      }
      return $.grep(todo,function(e,i){return e.id==id})[0];
    },
    setTodo:function(id,data){
      var temp=JSON.parse(localStorage.todo);
      var matchTodo=$.grep(temp,function(e,i){return e.id==id});
      if(matchTodo.length==0){
       temp.push({"id":id,"text":data});
      }
      else{
        $.each(temp,function(i,e){
          if(e.id==id){
            e.text=data;
          }
        });
        todo=temp;
      }
      localStorage.todo=JSON.stringify(temp);
    },
    getTodos:function(){
      var promise="";
      if(todo.length==0){
          promise=$http.get('/scripts/app/todo.json').success(function(data) {
            todo = data;
            localStorage.todo=JSON.stringify(data);
            return data;
        });
      }
      else{
        return todo;
      }
      return promise;
    }
  }
});

todoApp.service('userFormService',function(){
  var userInfo=[];
  return {
    saveUser:function(name,age,language,gender){
      var user={};
      user.name=name;
      user.age=age;
      user.gender=gender;
      user.language=language;
      userInfo.push(user);
    },
    getUsers:function(){
      return userInfo;
    }
  }
})

todoApp.controller('viewController',function($scope,todoListService){

  if(angular.isFunction(todoListService.getTodos().then)){
    todoListService.getTodos().then(function(response){
      $scope.todo=response.data;  
    });
  }
  else{
    $scope.todo=todoListService.getTodos();
  }

  $scope.add=function(){
    todoListService.addTodo($scope.newTodo);
  }
});

todoApp.controller('viewUserController',function($scope,userFormService){

  $scope.users=userFormService.getUsers();
});

todoApp.controller('editController',function($scope,$location,todoListService){
  $scope.id=$location.search().id;
  $scope.todoText=todoListService.getTodo($scope.id).text;
  $scope.save=function(){
    todoListService.setTodo($scope.id,$scope.todoText);
    $location.url('/');
  }
  $scope.cancel=function(){
    $scope.todoText="";
  }
});

todoApp.controller('newUserController',function($scope,$location,userFormService){
  $scope.items=[];
  $scope.items.length=100;
  $scope.submit=function(){
    userFormService.saveUser($scope.name,$scope.age,$scope.lang,$scope.gender);
    $location.url('/');
  }
});



