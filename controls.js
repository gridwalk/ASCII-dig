controls = {
  holding_shift:false,
  holding_command:false,
  holding_left:false,
  holding_right:false,
  holding_down:false
};

$(window).keydown(function(e){

  e.preventDefault();

  if( dialog.running && !dialog.shop_open ){
    dialog.wait = false;
    return;
  }
  
  // console.log(e.which);

  // shift
  if( e.which == 16 ){
    controls.holding_shift = true;
  }

  // command
  if( e.which == 90 || e.which == 91 ){
    controls.holding_command = true;
  }

  // up
  if(e.which == 38){

    if(dialog.shop_open){
      dialog.shop_cursor_move('up');
    }else if( controls.holding_shift ){
      player.move_or_dig("up");
    }else if( player.waiting_for_bomb ){
      player.place_bomb('up')
    }else{
      player.move('up');
    }
  }

  // down
  if(e.which == 40){
    
    controls.holding_down = true;

    if(dialog.shop_open){
      dialog.shop_cursor_move('down');
    }else if( controls.holding_shift ){
      player.move_or_dig("down");
    }else if( controls.holding_command ){
      player.move_or_ladder("down");
    }else if( player.waiting_for_bomb ){
      player.place_bomb('down')
    }else{
      player.move("down");
    }

  }

  // left
  if(e.which == 37){

    controls.holding_left = true;

    if( controls.holding_shift ){
      player.move_or_dig("left");
    }else if( controls.holding_command ){
      player.move_or_ladder("left");
    }else if( player.waiting_for_bomb ){
      player.place_bomb('left')
    }else{
      player.move("left");
    }
  }

  // right
  if(e.which == 39){

    controls.holding_right = true;

    if( controls.holding_shift ){
      player.move_or_dig("right");
    }else if( controls.holding_command ){
      player.move_or_ladder("right");
    }else if( player.waiting_for_bomb ){
      player.place_bomb('right')
    }else{
      player.move("right");
    }
  }

  // space
  if(e.which == 32){
    if(dialog.shop_open){
      dialog.shop_cursor_select();
    }
  }

  // enter
  if(e.which == 13){
    if(dialog.shop_open){
      dialog.shop_cursor_select();
    }
  }

  //  Z
  if(e.which == 90){
    if( player.waiting_for_bomb ){

      player.waiting_for_bomb = false;
      $('.blinking-bomb').removeClass('blinking-bomb');

    }else{

      player.use_item('bomb');

    }
  }

  // the following keys are not used in the shop.
  if( dialog.shop_open ){ return; }

  

  // 1
  if( e.which == 49 ){
    camera.toggle_map_visibility();
  }

  if( e.which == 82 ){
    location.reload();
  }

});


$(window).keyup(function(e){
  
  // shift
  if( e.which == 16 ){
    controls.holding_shift = false;
  }

  // command
  if( e.which == 90 || e.which == 91 ){
    controls.holding_command = false;
  }

  // left
  if(e.which == 37){
    controls.holding_left = false;
  }

  // right
  if(e.which == 39){
    controls.holding_right = false;
  }

});