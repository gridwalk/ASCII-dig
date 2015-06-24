var dialog = {
  
  wait:false,
  box: null,
  lines:{},
  cursor:0,
  running:false,
  shop_open:false,

  init:function(){
    $('body').append( $('<div id="dialog"></div>') );
    dialog.box = $('#dialog');
  },

  advance:function(){
    dialog.cursor++;
    dialog.run();
  },

  show:function(option){
    dialog.box.show();
  },
  close:function(){
    dialog.box.hide();
    dialog.box.text("");
    dialog.cursor = 0;
    dialog.running = false;
    dialog.shop_open = false;
  },
  
  run:function(option){
    
    dialog.show();
    dialog.running = true;
    line = dialog.lines[ dialog.cursor ];

    if( typeof line == 'string'){
      
      dialog.box.text(line);
      dialog.wait = true;
      // wait is set to false in controls.js

    }else if( typeof line == 'function' ){
      line();
      dialog.wait = true;
    }

    if( dialog.cursor >= Object.keys(dialog.lines).length ){
      dialog.close();
    }

  },

  shop:function(shop_number){

    dialog.shop_open = true;

    if( shop_number == 1 ){
      items = [['ladder',15,10],['bomb',3,20],['laser',1,50]];
    }

    $item_list = $('<ul id="shop-item-list"></ul>');

    i=0
    items.forEach(function(item){

      $item = $('<li amount="'+items[i][1]+'" item="'+items[i][0]+'" price="'+items[i][2]+'" ><i>'+items[i][0]+' x '+items[i][1]+'</i> ['+items[i][2]+']</li>');
      $item_list.append($item);
      i++;

    });

    // exit option
    $item_list.append('<li class="nothing">NOTHING</li>');

    dialog.box.text("");
    dialog.box.addClass('shop');
    dialog.show();
    dialog.box.append( $item_list );
    $item_list.find('li:first-child').addClass('active');

  },
  
  shop_cursor_move:function(dir){
    if( dir == 'up' ){
      $('.shop li.active').removeClass('active').prev().addClass('active');
      if( $('.shop li.active').length == 0 ){
        $item_list.find('li:last-child').addClass('active');
      }
    }else{
      $('.shop li.active').removeClass('active').next().addClass('active');
      if( $('.shop li.active').length == 0 ){
        $item_list.find('li:first-child').addClass('active');
      }
    }
  },
  
  shop_cursor_select:function(){
    $selected = $('.shop li.active');

    if( $selected.hasClass('nothing') ){
      dialog.close();
      return;
    }

    if( player.inventory.gold.amount >= $selected.attr('price')*1 ){
      
      purchased = $selected.find('i').text();
      item_id = $selected.attr('item');
      item_amount = $selected.attr('amount')*1;
      item_price = $selected.attr('price')*1;

      dialog.lines = {
        0:'Purchased '+purchased,
        1:function(){
          dialog.shop(1);
        }
      }

      player.inventory.gold.amount = player.inventory.gold.amount - item_price;
      player.inventory[item_id].amount = player.inventory[item_id].amount + item_amount;
      camera.update_inventory();

      dialog.shop_open = false;
      dialog.cursor = 0;
      dialog.run();


    }else{
      
      dialog.lines = {
        0:'You can\'t afford that',
        1:function(){
          dialog.shop(1);
        }
      }
      
      dialog.shop_open = false;
      dialog.cursor = 0;
      dialog.run();

    }
  }

}