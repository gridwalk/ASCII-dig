  camera = {
    left_visibility:0,
    right_visibility:0,
    update_inventory:function(){
      
      $('#inventory>*').remove();
      for( item in player.inventory ){  
        if ( player.inventory[item].amount == 0 ){ continue; }
        $item = $('<li class="inventory-'+item+'">'+item+' x<b>'+player.inventory[item].amount+'</b></li>')
        $('#inventory').append($item);
      }

    },
    update_hp:function(){
      
      $('#hp>*').remove();
      i=0;
      while( i < player.hp ){
        $hit_point = $('<b>&blk14;</b>')
        $('#hp').append($hit_point);
        i++;
      }

    },
    update:function(){

      camera.update_inventory();
      camera.update_hp();

      // update adjacent tiles
      player.adjacent_tile['left']      = map.get_adjacent_tile('left', $('.player') );
      player.adjacent_tile['right']     = map.get_adjacent_tile('right', $('.player') );
      player.adjacent_tile['top_left']  = map.get_adjacent_tile('top_left', $('.player') );
      player.adjacent_tile['top_right'] = map.get_adjacent_tile('top_right', $('.player') );
      player.adjacent_tile['up']        = map.get_adjacent_tile('up', $('.player') );
      player.adjacent_tile['down']      = map.get_adjacent_tile('down', $('.player') );
      
      // handle camera positioning
      x = ((map.cols_amt / 2) - player.pos_x)*9;
      y = (player.pos_y * 15 * -1)+190;
      scale = 1;

      $('#stage table').css('-webkit-transform','scale('+scale+') translateX('+x+'px) translateY('+y+'px)');

      /* * * * * * * * * * *
      *                    *
      * VISION             *
      * * * * * * * * * * */

      // reset visibility
      $('.visible').addClass('seen').removeClass('visible');

      // looking right 
      $('.player').nextAll().each(function(){
        if( $(this).attr('transparent') == 'true' ){
          $(this).addClass('visible');
          camera.right_visibility = $(this).index();
        }else{
          camera.right_visibility = $(this).index();
          $(this).addClass('visible');
          return false;
        }
      });

      // looking left
      $('.player').prevAll().each(function(){
        if( $(this).attr('transparent') == 'true' ){
          $(this).addClass('visible');
          camera.left_visibility = $(this).index();
        }else{
          camera.left_visibility = $(this).index();
          $(this).addClass('visible');
          return false;
        }
      });

      // looking below 1
      $('tr').eq( player.pos_y ).find('td').each(function(){
        pos = $(this).index();
        if( pos >= camera.left_visibility && pos <= camera.right_visibility ){
          $(this).addClass('visible');
        }
      });

      // looking below 2
      $('tr').eq( player.pos_y+1 ).find('td').each(function(){
        pos = $(this).index();
        
        $tile_top_right = map.get_adjacent_tile('top_right',$(this));
        $tile_top_left = map.get_adjacent_tile('top_left',$(this));
        
        // leftward
        if( $tile_top_right.attr('transparent')=='true' && pos >= camera.left_visibility && pos < player.pos_x ){
          $(this).addClass('visible');
        }

        // rightward
        if( $tile_top_left.attr('transparent')=='true' && pos > player.pos_x && pos <= camera.right_visibility ){
          $(this).addClass('visible');
        }

      });

      // looking down 2
      $tile_below_player = map.get_adjacent_tile('down',$('.player'));
      if( $tile_below_player.attr('transparent') == 'true' ){
        $tile_two_below_player = map.get_adjacent_tile('down',$tile_below_player);
        $tile_two_below_player.addClass('visible');
      }


      // looking up 1
      if(player.pos_y - 2 >= 0 ){
        $('tr').eq( player.pos_y - 2 ).find('td').each(function(){
          pos = $(this).index();
  
          if( pos == camera.left_visibility && $(this).next().attr('name') == 'air' ){ $(this).addClass('visible'); }
          if( pos == camera.right_visibility && $(this).prev().attr('name') == 'air' ){ $(this).addClass('visible'); }
  
          if( pos > camera.left_visibility && pos < camera.right_visibility ){
            $(this).addClass('visible');
          }
        });
      }

      // looking up 2
      if( player.pos_y - 3 >= 0 ){
        $('tr').eq( player.pos_y - 3 ).find('td').each(function(){
          pos = $(this).index();
  
          $tile_below = map.get_adjacent_tile('down',$(this));
          

          if( pos == camera.left_visibility && $(this).next().attr('name') == 'air' && $tile_below.attr('transparent') == 'true' ){ $(this).addClass('visible'); }
          if( pos == camera.right_visibility && $(this).prev().attr('name') == 'air' && $tile_below.attr('transparent') == 'true'){ $(this).addClass('visible'); }
          
  
          if( pos > camera.left_visibility && pos < camera.right_visibility  && $tile_below.attr('transparent') == 'true'){
            
            $tile_down_right = map.get_adjacent_tile('down_right',$(this));
            $tile_down_left = map.get_adjacent_tile('down_left',$(this));

            if( pos < player.pos_x && $tile_down_left.attr('transparent') == 'true' ){
              $(this).addClass('visible');
            }else if( pos > player.pos_x && $tile_down_right.attr('transparent') == 'true' ){
              $(this).addClass('visible');
            }else if( pos == player.pos_x ){
              $(this).addClass('visible');
            }
            
          }
        });
      }



    },
    toggle_map_visibility: function(){
      $('#stage').toggleClass('show-visible');
    }
  };