player = {
  hp:5,
  max_hp:5,
  pos_x:0,
  pos_y:1,
  adjacent_tile: {
    left: null,
    right: null,
    top_left: null,
    top_right: null,
    top: null
  },
  shovel_strength:0,
  inventory:{
    ladder:{
      amount:15
    },
    gold:{
      amount:0
    },
    shovel:{
      amount:0
    },
    key:{
      amount:0
    },
    bomb:{
      amount:10
    }
  },
  init:function(){

    // put player on map
    player.pos_x = Math.floor(map.cols_amt / 2);
    $('tr').first().find('td').eq( player.pos_x ).addClass('player');

    // add inventory to stage
    $('body').prepend('<ul id="inventory"></ul>');

    // add HP to stage
    $('body').prepend('<div id="hp"></div>');

  },

  /* * * * * * * * * * *
  *                    *
  * MOVE               *
  * * * * * * * * * * */

  move:function(dir){

    if(dir == "left"){

      if( player.adjacent_tile['left'].length == 0 ){ return; }

      if( player.adjacent_tile['left'].attr('interactive') == 'true' ){
        $tile = player.adjacent_tile['left'];
        name = $tile.attr('name');
        tiles[name].interact($tile);
        return;
      }

      // move left
      if( player.adjacent_tile['left'].attr('passable') == 'true' ){
        $('.player').removeClass('player');
        player.adjacent_tile['left'].addClass('player');
      }else if( player.adjacent_tile['top_left'].attr('passable') == 'true' && player.adjacent_tile['up'].attr('passable') == 'true' ){

        // climb up one
        $('.player').removeClass('player');
        player.adjacent_tile['top_left'].addClass('player');
      }

    }else if(dir == "right"){

      if( player.adjacent_tile['right'].length == 0 ){ return; }

      if( player.adjacent_tile['right'].attr('interactive') == 'true' ){
        $tile = player.adjacent_tile['right'];
        name = $tile.attr('name');
        tiles[name].interact($tile);
        return;
      }
      
      // move right
      if( player.adjacent_tile['right'].attr('passable') == 'true' ){
        $('.player').removeClass('player');
        player.adjacent_tile['right'].addClass('player')
      }else if( player.adjacent_tile['top_right'].attr('passable') == 'true' && player.adjacent_tile['up'].attr('passable') == 'true' ){
        // climb up one
        $('.player').removeClass('player');
        player.adjacent_tile['top_right'].addClass('player');
      }

    }else if(dir == "up"){
      
      $tile_above = player.adjacent_tile['up']; 
      
      if( $tile_above.attr('interactive') == 'true' ){
        name = $tile_above.attr('name');
        tiles[name].interact($tile_above);
        return;
      }

      if( $tile_above.attr('passable') !== 'true' ){ return; }

      if($('.player').attr('name') == 'ladder'){
        $('.player').removeClass('player');
        $tile_above.addClass('player')
      }else{
        player.use_item('ladder');
        player.move('up');
      }

    }else if(dir == "down"){
      
      $tile_below = map.get_adjacent_tile('down',$('.player'));

      if( $tile_below.attr('interactive') == 'true' ){
        name = $tile_below.attr('name');
        tiles[name].interact($tile_below);
        return;
      }

      if( $tile_below.attr('passable') == 'true' ){
        $('.player').removeClass('player');
        $tile_below.addClass('player');
      }

    }

    player.pos_x = $('.player').index();
    player.pos_y = $('.player').parent().index() +1;

    // check for hurtful tiles
    if( $('.player').attr('hurts') == 'true' ){
      player.damage(1)
    }

    camera.update();
    digger.advance_clock();

  },

  /* * * * * * * * * * *
  *                    *
  * DIG                *
  * * * * * * * * * * */

  dig:function(dir){

    $tile = map.get_adjacent_tile(dir,$('.player'));
    hardness = $tile.attr('hardness');


    if( $tile.attr('passable') !== "true" && $tile.length > 0 && player.shovel_strength >= hardness){      
      if( $tile.attr('name')=='gold-in-dirt' ){
        tiles.change_tile($tile,'gold')
      }else{
        tiles.change_tile($tile,'air')
      }
    }

    camera.update();

  },
  move_or_dig:function(dir){

    $next_tile = player.adjacent_tile[dir];
    if( $next_tile.attr('passable')=='true' || $next_tile.attr('interactive')=='true' ){
      player.move(dir);
    }else{
      player.dig(dir);
    }

  },

  /* * * * * * * * * * *
  *                    *
  * USE ITEM           *
  * * * * * * * * * * */

  use_item:function(item){

    if( item == "ladder" && player.inventory.ladder.amount > 0 ){
      player.inventory.ladder.amount--;
      $('.player').attr({
        'name':'ladder',
        'fall_through':'false'
      }).css('color','#000');
      camera.update();
    }

    else if( item == "bomb" && player.inventory.bomb.amount > 0 ){
      
      $tile_above = map.get_adjacent_tile('up',$('.player'));
      $tile_below = map.get_adjacent_tile('down',$('.player'));
      $right_tile = map.get_adjacent_tile('right',$('.player'));
      $left_tile = map.get_adjacent_tile('left',$('.player'));

      if( $tile_above.attr('passable') == 'true' ){ $tile_above.addClass('blinking-bomb'); }
      if( $tile_below.attr('passable') == 'true' ){ $tile_below.addClass('blinking-bomb'); }
      if( $right_tile.attr('passable') == 'true' ){ $right_tile.addClass('blinking-bomb'); }
      if( $left_tile.attr('passable')  == 'true' ){ $left_tile.addClass('blinking-bomb');  }
    
      player.waiting_for_bomb = true;

      camera.update();
    }

  },
  place_bomb:function(dir){
    
    $bomb_location = map.get_adjacent_tile(dir,$('.player'));
    if( !$bomb_location.hasClass('blinking-bomb') ){ return; }

    player.inventory.bomb.amount--;
    $('.blinking-bomb').removeClass('blinking-bomb');
    tiles.change_tile($bomb_location,'bomb');
    player.waiting_for_bomb = false;

    $bomb_location.attr('time-left','5');

  },
  move_or_ladder:function(dir){

    $tile = map.get_adjacent_tile(dir,$('.player'));
    if( $tile.attr('passable') !== "true" ){ return; }
    if( $tile.attr('name') == "ladder" ){
      player.move(dir);
    }else if( player.inventory.ladder.amount > 0 ){
      player.inventory.ladder.amount--;
      tiles.change_tile($tile,'ladder');
      camera.update();
    }

  },

  /* * * * * * * * * * *
  *                    *
  * DAMAGE             *
  * * * * * * * * * * */

  damage:function(amount){
    
    player.hp = player.hp - amount;
    camera.update_hp();

    dialog.lines = {
      0:"OUCH!"
    }

    if( player.hp <= 0 ){
      dialog.lines[1] = "YOU DIED";
      dialog.lines[2] = function(){
        location.reload();
      };
    }

    dialog.run('red')

  }
};