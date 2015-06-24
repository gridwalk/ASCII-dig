map = {
  box: $('#stage'),
  table: $('#stage table'),
  rows_amt: 30,
  cols_amt: 60,
  charsets: [
    "aaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddgggkw",
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddgggkw",
  ],
  has_shop:false,
  random_symbol: function(set){
    possible = map.charsets[set];
    return possible.charAt(Math.floor(Math.random() * possible.length));
  },
  init: function(){

    // camera.toggle_map_visibility();

    // clear tiles
    map.table.find('tr').remove();
    
    // each row
    for (depth=0; depth<map.rows_amt; depth++){
      map.table.append("<tr></tr>");
      
      // each tile in a row
      for (ii=0; ii<map.cols_amt; ii++){
        

        // get symbol index

        // check depth
        if( depth < 10 ){
          symbol = map.random_symbol(0);
        }else if( depth < 25 ){
          symbol = map.random_symbol(1);
        }else{
          symbol = map.random_symbol(1);
        }

        // last and first tile are bedrock
        if( ii == 0 || ii == map.cols_amt-1 ){
          symbol = 'bedrock';
        }

        if( symbol == 'a' ){ symbol = "air"; }
        if( symbol == 'd' ){ symbol = "soft-dirt"; }
        if( symbol == 'k' ){ symbol = "key"; }
        if( symbol == 'w' ){ symbol = "waste"; }
        if( symbol == 'g' ){ symbol = "gold-in-dirt"; }

        $tile = tiles.get_tile(symbol);

        $('tr').last().append($tile);
      }
    }

    /* * * * * * * * * * *
    *                    *
    * ROOMS, TREASURE    *
    * * * * * * * * * * */

    amount_of_rooms = 10;
    for( room = 0; room <= amount_of_rooms; room++ ){

      gate_placed = false;
      
      room_top_left = [ digger.r( map.cols_amt ), digger.r( map.rows_amt-1 ) ],
      room_width  = digger.r(20)+3;
      room_height = digger.r(10)+3;
      
      // TREASURE
      chance_for_treasure = digger.r(5);
      if(chance_for_treasure==1){
        treasure = true;
        treasure_x = digger.r(room_width-1);
      }else{
        treasure = false;
      }

      // WALLS
      // chance_for_walls = digger.r(1);
      // if(chance_for_walls==1){
        walls = true;
      // }else{
        // walls = false;
      // }


      // each row of the room
      for( i = 0; i < room_height; i++ ){

        $row = $('tr').eq( room_top_left[1] + i );

        // each col of the room
        for( ii = 0; ii < room_width; ii++ ){
          
          // make wall
          if( walls && ( ii == 0 || i == 0 || ii == room_width-1 || i == room_height-1 ) ){

              $old_tile = $row.find('td').eq( room_top_left[0] + ii );

              // chance to make a gate to enter the room
              // chance_for_gate = digger.r(100);
              // if( gate_placed == false && chance_for_gate < 3 ){

              //   // gate
              //   tiles.change_tile($old_tile,"gate");
              //   gate_placed = true;

              // }else{

                // normal wall
                tiles.change_tile($old_tile,"bedrock");

              // }


          }else{

            // make air
            $old_tile = $row.find('td').eq( room_top_left[0] + ii );
            
            if( treasure && i==room_height-1 && ii==treasure_x ){
              tiles.change_tile($old_tile,"treasure");
            }else{
              tiles.change_tile($old_tile,"air");
            }

          }
        }

      }
    
      // determine gate location on four sided room
      gate_pending = true;
      while( gate_pending ){
      
          side = digger.r(1)+1;
          if( side == 1 ){
          
            // top
          
            gate_x = room_top_left[0] + digger.r( room_width - 3 ) + 1;
            gate_y = room_top_left[1];
            adj_dir = 'up';
          
          }else if( side == 2 ){
          
            // right
    
            gate_x = room_top_left[0] + room_width-1;
            gate_y = room_top_left[1] + digger.r( room_height - 3 ) + 1;
            adj_dir = 'right';
    
          }else if( side == 3 ){
          
            // bottom
            gate_x = room_top_left[0] + digger.r( room_width - 3 ) + 1;
            gate_y = room_top_left[1] + room_height - 1;
            adj_dir = 'down';
    
          }else if( side == 4 ){
          
            // left
            gate_x = room_top_left[0];
            gate_y = room_top_left[1] + digger.r( room_height - 3 ) + 1;
            adj_dir = 'left';
    
          }

          $old_tile = map.get_xy(gate_x,gate_y);
          $adj_tile = map.get_adjacent_tile(adj_dir,$old_tile)
          if( $adj_tile.attr('name') == 'bedrock' ){

            // choose a different gate location
            continue;

          }
    
          // set gate location tile
          tiles.change_tile($old_tile,"gate");
          gate_pending = false;
    
        }
      }

    // add ladders
    number_of_ladders = digger.r(10);
    for (var i = 0; i < number_of_ladders; i++) {
      
      ladder_x = digger.r(map.cols_amt);
      ladder_y = digger.r(map.rows_amt);

      $ladder_top = $('tr').eq(ladder_y).find('td').eq(ladder_x);
      $place_ladder_at = $ladder_top;

      ladder_height = digger.r(10);
      for (var ii = 0; ii < ladder_height; ii++) {
        
        tiles.change_tile( $place_ladder_at, "ladder" );
        $place_ladder_at = map.get_adjacent_tile( 'down', $place_ladder_at )

      };

      // chance for treasure below a ladder
      // $place_treasure_at = map.get_adjacent_tile('down',$place_ladder_at);
      tiles.change_tile($place_ladder_at,'treasure');

    };


    // add bedrock
    map.table.append("<tr></tr>");
    for(i=0; i<map.cols_amt;i++){
      $bedrock = tiles.get_tile('bedrock');
      $('tr').last().append($bedrock);
    }



    // shovel location
    shovel_x = Math.floor(map.cols_amt / 2) - 2;

    // shop location
    shop_x = digger.r(map.cols_amt);

    // teleporter location
    teleporter_x = digger.r(map.cols_amt-2)+1;

    // add teleporter just before bottom bedrock
    $teleporter_location = $('tr').eq( map.rows_amt ).find('td').eq( teleporter_x );
    tiles.change_tile($teleporter_location, 'teleporter');

    // couple rows at top for air
    for( i=0; i<6; i++ ){
      map.table.prepend("<tr></tr>");
      for (ii=0; ii<map.cols_amt; ii++){
        
        classes = "air passable";

        // if this is the shop, add the shopkeeper to the tile
        if(i==0 && ii==shop_x){
          classes += " shopkeeper";

          // make sure there is ground around him
          $('tr').eq(1).find('td').eq(shop_x).attr({'class':'soft-dirt','hardness':'1'});

          $tile = tiles.get_tile('shopkeeper');

        }else if( i==0 && ii==shovel_x ){
          
          // if this is the shovel tile

          $tile = tiles.get_tile('shovel');

        }else{

          // normal air tile
          $tile = tiles.get_tile('air');

        }

        $('tr').first().append($tile);

      }
    }

    // make toxic waste spread right and left
    $('[name=waste]').each(function(){

      $left_tile = map.get_adjacent_tile('left',$(this));
      $right_tile = map.get_adjacent_tile('right',$(this));

      spreading = false;

      if( $left_tile.attr('name') == 'air' ){
        spreading = true;

        while(spreading){

          tiles.change_tile( $left_tile,'waste' );
          $left_tile = map.get_adjacent_tile('left',$left_tile);
          if( $left_tile.attr('name') !== 'air' ){
            spreading = false;
          }

        }
      }

      if( $right_tile.attr('name') == 'air' ){
        
        spreading = true;

        while(spreading){
          
          tiles.change_tile( $right_tile,'waste' );
          $right_tile = map.get_adjacent_tile('right',$right_tile);
          if( $right_tile.attr('name') !== 'air' ){
            spreading = false;
          }

        }

      }

    });

    // apply gravity to floating objects
    $('[weighted=true]').each(function(){
      
      falling = true;

      $this = $(this);

      while( falling ){
        $tile_below = map.get_adjacent_tile('down',$this);
        if( $tile_below.attr('fall_through') == "true"){
          name = $this.attr('name');
          tiles.change_tile( $this,'air');
          tiles.change_tile($tile_below,name);

          $this = $tile_below;

        }else{
          falling = false;
        }  
      }
      
    });


  },
  
  get_adjacent_tile:function(dir, $tile){

    tile_pos_x = $tile.index();
    tile_pos_y = $tile.parent().index();

    if( dir == 'left' ){
      return $tile.prev('td');
    }

    if( dir == 'right' ){
      return $tile.next('td');
    }

    if( dir == 'top_left'){
      return $tile.parent().prev().find('td').eq( tile_pos_x - 1 );
    }

    if( dir == 'top_right'){
      return $tile.parent().prev().find('td').eq( tile_pos_x + 1 );
    }
    
    if( dir == 'up'){
      return $tile.parent().prev().find('td').eq( tile_pos_x );
    }

    if( dir == 'down'){
      return $tile.parent().next().find('td').eq( tile_pos_x );
    }

    if( dir == 'down_left'){
      return $tile.parent().next().find('td').eq( tile_pos_x - 1 );
    }

    if( dir == 'down_right'){
      return $tile.parent().next().find('td').eq( tile_pos_x + 1 );
    }

    if( dir == 'all'){

      // doesnt seem to work

      $tiles = map.get_adjacent_tile('left',$tile);
      $tiles = $tiles.add(map.get_adjacent_tile('right',$tile));
      $tiles = $tiles.add(map.get_adjacent_tile('top_left',$tile));
      $tiles = $tiles.add(map.get_adjacent_tile('top_right',$tile));
      $tiles = $tiles.add(map.get_adjacent_tile('up',$tile));
      $tiles = $tiles.add(map.get_adjacent_tile('down',$tile));
      $tiles = $tiles.add(map.get_adjacent_tile('down_left',$tile));
      $tiles = $tiles.add(map.get_adjacent_tile('down_right',$tile));

      return $tiles;
    }

  },
  get_xy:function(x,y){

    $tile = $('tr').eq(y).find('td').eq(x);
    return $tile;

  }
};