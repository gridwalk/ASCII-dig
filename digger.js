digger = {
  run: true,
  loop:null,
  ticks: 0,
  init:function(){
    
    map.init();
    player.init();
    dialog.init();
    camera.update();

    digger.loop = setInterval(function(){

      if( dialog.running ){
        if( dialog.wait ){ return; }
        dialog.advance();
        return;
      }

      // gravity

      $('.player, [weighted=true]').each(function(){
        $tile_below = map.get_adjacent_tile('down',$(this));
        if( $tile_below.attr('fall_through') == "true" && !$tile_below.hasClass('player') ){

          // player gravity
          
          if( $(this).hasClass('player') ){
              
              if( $('.player').attr('name')=='ladder' ){ return; }
              $('.player').removeClass('player');
              $tile_below.addClass('player');
              player.pos_y++;

              // check for hurtful tiles
              if( $('.player').attr('hurts') == 'true' ){
                player.damage(1);
              }

          // everything else gravity

          }else{

            name = $(this).attr('name');
            tiles.change_tile($(this),'air');
            tiles.change_tile($tile_below,name);

          }

          camera.update();

        }
      });

    },50);

  },

  r:function(max){
    return Math.round(Math.random() * max);
  },

  advance_clock:function(){
    
    // countdown on lit bombs
    $('[name=bomb]').each(function(){
      
      $bomb = $(this);
      time_left = $bomb.attr('time-left') - 1;
      if( time_left > 0 ){
        
        // counting down

        $bomb.attr( 'time-left', time_left ).addClass('show-time');
        setTimeout(function(){
          $bomb.removeClass('show-time');
        },500);

      }else{

        // explode
        $blast_radius = map.get_adjacent_tile('all',$bomb);
        $blast_radius.each(function(){
          tiles.change_tile($(this),'explosion');
        });
        tiles.change_tile($bomb,'explosion');
        setTimeout(function(){
          $('[name=explosion]').each(function(){
            tiles.change_tile($(this),'air');
          });
        },500);

      }

    });

  }
};