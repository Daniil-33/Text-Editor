window.onload = function(){
//Заводим переменные под задачу
let List = $('#tdlApp ul');
let Mask = 'tdl_';
//Тут будем хранить внутренний номер документа
//чтоб связатьь списко и текст в редакторе
let N_store;
//При нажатии любой клавиши содержимое тега с ид эдитор записываем в память
document.addEventListener('keydown', function(e) {
    localStorage.setItem(N_store + 'text_in_editor', document.getElementById('editor').innerHTML);
  });

  //функция, которая берет из памяти наши док-нты и делает из них список
 function showTask(){
  document.getElementById('editor').style.display = "none";

  let Storage_size = localStorage.length;

  if(Storage_size > 0){
    for(let i = 0; i < Storage_size; i++){
      let key = localStorage.key(i);
      if(key.indexOf(Mask) == 0){
        N_store = key[4];
        //делаем содержимое хранилища єлементами списка
        $('<li></li>').addClass('tdItem')
          .attr('data-itemid', key)
          .text(localStorage.getItem(key))
          .appendTo(List);
      }
    }
  }
 }

 showTask();
 //Следим, когда пользователь напишет название новго док-нта в поле ввода

 $('#tdlApp input').on('keydown', function(e){
  if(e.keyCode != 13) return;

  let str = e.target.value;
  e.target.value = "";

  //если в поле ввода что-то было написано - обрабатываем

  if(str.length > 0){
    let number_Id = 0;

    List.children().each(function(index, el){
      let element_Id = $(el).attr('data-itemid').slice(4);
      if(element_Id > number_Id)
        number_Id = element_Id;
    })
    number_Id++;

    //Отправляем новый док-нт сразу в память
    localStorage.setItem(Mask+number_Id, str);

    //готовим для него новое поле редактора
    //берем текущий внутренний номер документа
    N_store = number_Id;

    //отправляем в память
    localStorage.setItem(N_store+'text_in_editor', '');

    //делаем окно редактора видимым и очищаем в нем текст

    document.getElementById('editor').innerHTML = '';
    document.getElementById('editor').style.display = "block";

    //добавляем название в док-нта в конец списка

    $('<li></li>').addClass('tdItem')
      .attr('data-itemid', Mask+number_Id)
      .text(str).appendTo(List);

    //меняем заголовок редактора

    document.getElementById('h1_name').innerHTML = localStorage.getItem('tdl_'+N_store);
  }
 });

 //при клике на названеи док-нта делаем его активным
 $(document).on('click', '.tdItem', function(e){
  //находим док по которому кликнули
  let jet = $(e.target);
  //если пр клике был нажал альт
  if(event.altKey){
    //то убираем его из памяти
    localStorage.removeItem(jet.attr('data-itemid'));
    localStorage.removeItem(jet.attr('data-itemid')[4]+'text_in_editor');

    //очищаем и скрываем окно редактора
    document.getElementById('editor').innerHTML='';
    document.getElementById('editor').style.display = "none";

    document.getElementById('h1_name').innerHTML = 'Text editor \'YourText\'';

    jet.remove();

    return true;
  }

  N_store = jet.attr('data-itemid')[4];

  document.getElementById('editor').style.display = "block"
  document.getElementById('editor').innerHTML = localStorage.getItem(N_store + 'text_in_editor');
  
  document.getElementById('h1_name').innerHTML = localStorage.getItem('tdl_'+N_store);  
 });
}
