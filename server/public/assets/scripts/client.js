// var randomQuote;
$(document).ready(function(){
  console.log('inside doc reay!');
  $('#todos-form').on('submit', postTodos);

  getTodos();

  $(".active-todos, .completed-container").on('click', '#btndelete', function(){
    if (confirm('Are you sure you want delete this task?')) {
    // Save it!
    console.log(this);
    var id =$(this).data('id');
    var todoID = {'id': id};
    console.log('button data-id', $(this).data('id'));
    $(this).parent().fadeOut(1500);
    // $(this).parent().text('YOU ARE TRUELY GREAT!').delay(3000).fadeIn(1000).slideUp(1000);
    deleteTodo(todoID);
    } else {
    // Do nothing!
    }
  });

  $(".active-todos, .completed-container").on('click', '#btncomplete', function(){
    console.log(this);
    var id =$(this).parent().data('id');
    var completed = $(this).parent().data('completed');
    console.log('initial completed value after button',completed)
    if (completed == true){
      completed = 'false';
    }else if (completed == false){
      completed = 'true';
    }else if (completed == null){
      completed = 'true';
    }
    console.log('final completed value after button',completed)

    var todoID = {'id': id, 'completed': completed};
    console.log('button data-id', $(this).data('id'));
    $(this).parent().fadeIn(3500);
    completeTodo(todoID);


  });

// timmer button event listener
$(".active-todos").on('click', '#btntimer', timerChange);

});

function timerChange(){
  var id = $(this).data('id');
  var i = $(this).find('#timerSetvalue').val();
  console.log($(this).data('id'));
  $('.slide-link[data-slide="0"]').addClass('active');

  var i = $(".active-todos").find('#timerSetvalue[data-id='+""+id+']').val();
  console.log(i);

  function myLoop () {           //  create a loop function
     setTimeout(function () {    //  call a 3s setTimeout when the loop is called
        $(".active-todos").find('#btntimer[data-id='+""+id+']').text(i+" sec");          //  your code here
        i--;                     //  increment the counter
        if (i > 0) {            //  if the counter < 10, call the loop function
           myLoop();             //  ..  again which will trigger another
        }else if(i == 0){
          $(".active-todos").find('#btntimer[data-id='+""+id+']').text("0 sec");
          alert("time's up champ!")
        }                       //  ..  setTimeout()
     }, 1000)
  }
  myLoop();
//   for(var timervalue=10000 ; timervalue>0 ; ){
//   $(".active-todos").find('#btntimer').text(timervalue+" mins");
//   timervalue -= 1000;
//   setTimeout(timerChange, 1000);
//   }
}

function postTodos(event){
  event.preventDefault();

  console.log('made it into postTodos function');
  console.log('button data-status', $(this).data('status'))
  var formData = {};
  console.log('form data', formData);

  var formArray = $('#todos-form').serializeArray();
  $.each(formArray, function(index, element){
    formData[element.name] = element.value;
  });
  console.log('form data', formData);

  $.ajax({
    type:'POST',
    url: '/todo',
    data: formData,
    success: getTodos
  });
  $('#todos-form').trigger('reset');

}
function getTodos() {
  $.ajax({
    type: 'GET',
    url: '/todo',
    success: todosAppendDom
  });
}

function todosAppendDom(todosArray){
  $('.todo-container').remove();
  console.log('inside appendDom after GET call', todosArray);
  // $('.active-todos', '.completed-container').
  var plusMoney=0;
  for(var i = 0; i < todosArray.length; i++){
    $('.active-todos').append('<div id="todo-container" class="todo-container" data-completed='+""+todosArray[i].completed+' data-id='+""+todosArray[i].id+'>'+'</div>');
    var $el = $('.active-todos').children().last();
    $el.append('<button class="btn" id="btntimer" data-status="completed" type="submit" value="Submit" data-id='+""+todosArray[i].id+'>'+'Start Timer</button>');
    $el.append('<textarea size="13" rows="1" cols="5" class="btn" id="timerSetvalue" data-status="completed" type="submit" value="Submit" placeholder="enter seconds" data-id='+""+todosArray[i].id+'>'+'</textarea>');
    $el.append('<button class="btn" id="btndelete" data-status="delete" type="submit" value="Submit" data-id='+""+todosArray[i].id+'>'+'Delete</button>');
    $el.append('<button class="btn" id="btncomplete" data-status="completed" type="submit" value="Submit" data-id='+""+todosArray[i].id+'>'+'Done</button>');
    // $el.append('<input class="btn" id="btncomplete" data-status="completed" type="checkbox" value="Submit" data-id='+""+todosArray[i].id+'>'+'</input>');
    // <input type="checkbox" name="vehicle" value="Bike">
    $el.append('<p class="item" data-id='+""+todosArray[i].id+'><span class="item-span">'+todosArray[i].item+'     '+'($'+todosArray[i].money+')'+'</span> --||-- '+"<span class='description'>"+todosArray[i].description+'</span></p>');

    if($el.data('completed') == true){
        $el.appendTo('.completed-container');
        $el.find("#btncomplete").text('Not Done');

        plusMoney += parseFloat(todosArray[i].money);
        // $('.total-money').empty();
          console.log("plusMoney", plusMoney);
          $('.total-money').text('Total Earned $'+ plusMoney.toFixed(2));


        // $el.find("#checkbox").checked(true);
        // $el.find("#checkbox").selected(true);
        // $el.css({ "background-color": "#00FFFF", "border-left": "5px solid #000" }).appendTo('.completed-container');
    }else if ($el.data('completed') != true) {
      $el.find("#btncomplete").text('Done');
      // var minusMoney = 0 ;
      // minusMoney-= parseFloat(todosArray[i].money);
      // $('.total-money').empty();
      //   console.log("totalMoney", totalMoney);
      //   $('.total-money').text('Money Earned ', totalMoney);

    };

  }
};


function deleteTodo(todoID){

  console.log('todoID inside DELETE call', todoID);
  $.ajax({
    type:'DELETE',
    url: '/todo',
    data: todoID,
    success: getTodos
  });
  $('#todos-form').trigger('reset');
}


function completeTodo(todoID){

  console.log('todoID inside DELETE call', todoID);
  $.ajax({
    type:'PUT',
    url: '/todo',
    data: todoID,
    success: getTodos
  });
  $('#todos-form').trigger('reset');
}
