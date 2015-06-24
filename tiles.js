
// terrain and air have numbers
// items and NPCs have names

var tiles = {
  
  'air':{
    name:'air',
    passable:true,
    fall_through:true,
    transparent:true,
    hurts:false,
    weighted:false,
    graphic:'&blk14;',
    hardness:'0',
    color:'rgb(0, 135, 199)',
    layer:0,
    interactive:false
  },
  'soft-dirt':{
    name:'soft-dirt',
    passable:false,
    fall_through:false,
    transparent:false,
    hurts:false,
    weighted:false,
    graphic:'&blk12;',
    hardness:'1',
    color:'rgb(145, 113, 81)',
    layer:0,
    interactive:false
  },
  'bedrock':{
    name:'bedrock',
    fall_through:false,
    passable:false,
    transparent:false,
    hurts:false,
    weighted:false,
    graphic:'&blk12;',
    hardness:'999',
    color:'gray',
    layer:0,
    interactive:false
  },
  'gold-in-dirt':{
    name:'gold-in-dirt',
    fall_through:false,
    passable:false,
    transparent:false,
    hurts:false,
    weighted:false,
    graphic:'<img style="position:absolute;bottom:-1px;left:-1px;" src="images/gold.png" />&blk12;',
    hardness:'1',
    color:'rgb(145, 113, 81)',
    layer:0,
    interactive:false
  },
  'gold':{
    name:'gold',
    fall_through:false,
    passable:false,
    transparent:true,
    hurts:false,
    weighted:true,
    graphic:'<span style="position: absolute;color: yellow;bottom: 0px;left: 0px;font-size: 10px;">.</span>',
    hardness:'999',
    color:'yellow',
    layer:1,
    interactive:true,
    interact:function($this){
      player.inventory.gold.amount++;
      tiles.change_tile($this,'air');
      camera.update_inventory();

      dialog.lines = {
        0:'1 GOLD!'
      }

      dialog.run();
    }
  },
  'shopkeeper':{
    name:'shopkeeper',
    fall_through:false,
    passable:false,
    transparent:true,
    hurts:false,
    weighted:true,
    graphic:'<span style="position: absolute;bottom: -2px;color: #68B897;left: -2px;">&#9731;</span>',
    hardness:'999',
    color:'#fff',
    layer:1,
    interactive:true,
    interact:function($this){

      dialog.lines = {
        0:'You will need some supplies.',
        1:'I only accept gold.',
        2:function(){
          dialog.shop(1);
        }
      }

      dialog.run();

    }
  },
  'shovel':{
    name:'shovel',
    fall_through:false,
    passable:false,
    transparent:true,
    hurts:false,
    weighted:true,
    graphic:'<img style="position:absolute;bottom:2px;" src="images/shovel.png" />',
    hardness:'999',
    color:'#fff',
    layer:1,
    interactive:true,
    interact:function($this){
      player.inventory.shovel.amount++;
      player.shovel_strength = 1;
      tiles.change_tile($this,'air');
      camera.update_inventory();

      dialog.lines = {
        0:'Got a LVL 1 shovel.'
      }

      dialog.run();

    }
  },
  'ladder':{
    name:'ladder',
    fall_through:false,
    passable:true,
    transparent:true,
    hurts:false,
    weighted:false,
    graphic:'&blk14;',
    hardness:'0',
    color:'#000',
    layer:1,
    interactive:false
  },

  'treasure':{
    name:'treasure',
    fall_through:false,
    passable:false,
    transparent:true,
    hurts:false,
    weighted:true,
    graphic:'&blk14;<b style="color:rgb(147, 232, 98);position:absolute;bottom:-3px;left:0px;font-size:10px;">&#x2709;</b>',
    hardness:'0',
    color:'rgb(0, 135, 199)',
    layer:1,
    interactive:true,
    interact:function($this){
      treasure = digger.r(3);
      amount = digger.r(10)+1;

      if( treasure <= 2 ){

        dialog.lines = {
          0: amount+" gold!"
        }

        player.inventory.gold.amount = player.inventory.gold.amount + amount;

      } else if( treasure == 3 ){

        dialog.lines = {
          0: amount+" Ladders!"
        }
        player.inventory.ladder.amount = player.inventory.ladder.amount + amount;


      } else if( treasure == 4 ){

        dialog.lines = {
          0:"It's empty!"
        }

      } else if( treasure == 5 ){

        dialog.lines = {
          0:"It's empty!"
        }

      }

      dialog.run();
      tiles.change_tile($this,'air');
      camera.update();

    }
  },
  'teleporter':{
    name:'teleporter',
    fall_through:false,
    passable:false,
    transparent:true,
    hurts:false,
    weighted:true,
    graphic:'<span style="font-size:6px;color:#fff;" >&#8682;</span>',
    hardness:'0',
    color:'#fff',
    layer:1,
    interactive:true,
    interact:function($this){
      $('.player').removeClass('player');
      $('tr').eq(0).find('td').eq( player.pos_x ).addClass('player');
      player.pos_y = 0;
      camera.update();
    }
  },
  'waste':{
    name:'waste',
    fall_through:true,
    passable:true,
    transparent:true,
    weighted:true,
    hurts:true,
    graphic:'&blk14;<span style="position:absolute;color: rgb(84, 216, 20);font-size: 7px;bottom: 0px;left:0px;">_</span>',
    hardness:'0',
    color:'rgb(0, 135, 199)',
    layer:1,
    interactive:false,
    interact:function($this){
      
    }
  },
  'gate':{
    name:'gate',
    fall_through:false,
    passable:false,
    transparent:false,
    hurts:false,
    weighted:false,
    graphic:'<span style="font-size:10px;color:#fff">&boxtimes;</span>',
    hardness:'999',
    color:'#fff',
    layer:1,
    interactive:true,
    interact:function($this){
      
      if( player.inventory.key.amount > 0 ){

        player.inventory.key.amount--;
        tiles.change_tile($this,'air');

      }else{

        dialog.lines = {
          0:"You need a key."
        }
        dialog.run();

      }

    }
  },
  'key':{
    name:'key',
    fall_through:false,
    passable:false,
    transparent:true,
    hurts:false,
    weighted:true,
    graphic:'<img style="position:absolute;bottom:2px;" src="images/key.png" />',
    hardness:'999',
    color:'#fff',
    layer:1,
    interactive:true,
    interact:function($this){
      player.inventory.key.amount++;
      tiles.change_tile($this,'air');
      camera.update_inventory();

      dialog.lines = {
        0:'Got a key.'
      }

      dialog.run();

    }
  },

  'bomb':{
    name:'bomb',
    fall_through:false,
    passable:false,
    transparent:true,
    hurts:false,
    weighted:true,
    graphic:'<img style="position:absolute;bottom:0px;" src="images/bomb.png" />',
    hardness:'999',
    color:'#fff',
    layer:1,
    interactive:false,
    time_left:5,
    interact:function($this){

    }
  },

  'explosion':{
    name:'explosion',
    fall_through:true,
    passable:true,
    transparent:true,
    hurts:true,
    weighted:false,
    graphic:'&blk12;',
    hardness:'999',
    color:'#fff',
    layer:1,
    interactive:false
  },

  get_tile:function(tile_index){

    

    name         = tiles[tile_index].name;
    fall_through = tiles[tile_index].fall_through;
    passable     = tiles[tile_index].passable;
    hardness     = tiles[tile_index].hardness;
    graphic      = tiles[tile_index].graphic;
    hurts        = tiles[tile_index].hurts;
    weighted     = tiles[tile_index].weighted;
    transparent  = tiles[tile_index].transparent;
    interactive  = tiles[tile_index].interactive;
    style        = "color:"+tiles[tile_index].color;
    
    $tile = $("<td name='"+name+"' hurts='"+hurts+"' passable='"+passable+"' fall_through='"+fall_through+"' hardness='"+hardness+"' weighted='"+weighted+"' transparent='"+transparent+"' interactive='"+interactive+"' style='"+style+"' >"+graphic+"</td>");

    return $tile;

  },
  change_tile:function($old_tile, tile_index){

    $old_tile.attr({
      name         : tiles[tile_index].name,
      fall_through : tiles[tile_index].fall_through,
      hurts        : tiles[tile_index].hurts,
      passable     : tiles[tile_index].passable,
      hardness     : tiles[tile_index].hardness,
      weighted     : tiles[tile_index].weighted,
      transparent  : tiles[tile_index].transparent,
      interactive  : tiles[tile_index].interactive,
      style        : "color:"+tiles[tile_index].color,
    }).html( tiles[tile_index].graphic );

  }

}