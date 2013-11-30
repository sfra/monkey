if(!window.console){
	 console={};
	 console.log=function(){};
}/* fix for IE */

$(function(){
   var SCREEN=document.getElementById('scene');
   var alien=new Object();
   alien.direction={'p':false, 'l':false, 'g':false, 'd':false};
   alien.lives=prompt("How many lives?","5")*20;
   alien.stepLen=15;
   alien.points=0;
   $('div#life').css({'width': alien.lives+'px'});
   
   var HEIGTH=$('#scene').css('height').split('p')[0];
   var WIDTH=$('#scene').css('width').split('p')[0];
   var wall=[]; var jewels=[];
   var bomb_id=0;
   var bombList=new Object();
 
   
   
   var time = (new Date).getTime();
   var interval=150; /* speed of the game*/
   var countSetTimeOut; /* timer game loop*/
   Bomb=function(x,y,id){
        this.x=x;this.y=y;this.id=id;
        this.p=document.createElement('div');
        SCREEN.appendChild(this.p);
        this.p.setAttribute('class', 'bomba'); this.p.setAttribute('id', "bomba_"+this.id);
        this.p.style.height=this.h+"px";
        this.p.style.width=this.d+"20";
        this.p.style.left=(this.x*20)+"px"; this.p.style.top="0px";
     //   this.p.innerHTML=bomb_id;
        
   }
  
  Bomb.prototype.h=20;
  Bomb.prototype.d=20;
  Bomb.prototype.BombFall=function(dx){this.x+=dx;}
  Bomb.prototype.destr=function(){
      delete(this.x); delete(this.y); delete(this.id);
  }

    
    Square=function(x,y,h){
        this.x=x;this.y=y; this.h=h; this.p=document.createElement('div');
    }
    
    
    Square.prototype.place=function(){
        SCREEN.appendChild(this.p);
        this.p.setAttribute('class', this.klasa);
        this.p.style.height=this.h+"px";
        this.p.style.width=this.h+"px";
        this.p.style.top=this.y+"px";
        this.p.style.left=this.x+"px";
    }
      
     Brick=function(x,y,h){
         this.klasa="cegla";
         Square.apply(this,arguments);
      }

Brick.prototype=new Square();

      Jewel=function(x,y,h){
          this.klasa='jewel';
         Square.apply(this,arguments);
      }
    Jewel.prototype=new Square();

 
 $.getJSON('wall.json', function(data){
   //console.log('start:',data);
    $.each(data, function(index,entry){
      var temp; var tab;  
      if(entry['obiekt']=="jewel"){
          temp=new Jewel(entry['x'], entry['y'], entry['h']);
          tab=jewels;
      }
    
      if(entry['obiekt']=="cegla"){
          temp=new Brick(entry['x'], entry['y'], entry['h']);
          tab=wall;
      }
    //  console.log(temp);
      tab.push(temp);
      temp.place();
    })   
 });
 
 Grenade=function(x,y,d,h,id,f){
       this.x=x;this.y=y;this.d=d;this.h=h;this.id=id,this.f=f;
       this.time=0;
       
       this.p=document.createElement('div');
       SCREEN.appendChild(this.p);
       this.p.setAttribute('class', 'granat'); this.p.setAttribute('id', "granat_"+this.id);
       this.p.style.height=this.h+"px";
       this.p.style.width=this.d+"px";
       this.p.style.left="0px"; this.p.style.top=(HEIGTH-this.h)+"px";        
   }
  

    Grenade.prototype.naMiejsce=function(){
       this.y=this.f(this.x);
       this.p.style.left=10*this.x+"px";
       this.p.style.top=((HEIGTH-this.h)-10*this.y)+"px";        
    }
    
    
    Grenade.prototype.destr=function(){
    rmvChild(this.p);
        delete(this.x);delete(this.y);delete(this.d);delete(this.h);delete(this.id);delete(this.f);
    }

     var gr=new Grenade(0,0,200,50,1,function(x){return Math.ceil(25*Math.sin(Math.pow(Math.PI*x,.5 ))+30);
        });
        
  
    $('#alien').css({'width': '80px','height':'57px','position':'absolute','left': '0px','top': '0px',
        'background-image': 'url(images/alien.png)','background-repeat' : 'no-repeat','background-position' : '0px 0px'
        });
   
   alien.HEI=$('#alien').css('height').split('p')[0];
   alien.WID=$('#alien').css('width').split('p')[0];

  
gameLoop();
  
   
   function right(){
     var current=$('#alien').css('background-position').split('p')[0];
        
     var whereIsAlienY=parseInt($('#alien').css('top').split('p')[0]);
     var whereIsAlienX=parseInt($('#alien').css('left').split('p')[0]);
       
     for( var i=0,max=wall.length;i<max;i++ ){
      if(conflict(parseInt(wall[i].x),parseInt(wall[i].y),parseInt(wall[i].h),parseInt(wall[i].h),whereIsAlienX+15,whereIsAlienY,parseInt(alien.WID),parseInt(alien.HEI))){
          //console.log("Konflikt");
          return;
          } 
      }
      
     for( var i=0;i<jewels.length;i++ ){
      if(conflict(parseInt(jewels[i].x),parseInt(jewels[i].y),parseInt(jewels[i].h),parseInt(jewels[i].h),whereIsAlienX+15,whereIsAlienY,parseInt(alien.WID),parseInt(alien.HEI))){
       //   console.log("Mam jewel!");
          rmvChild(jewels[i].p); jewels.splice(i,1); alien.points+=10; $('div#points > div').text(alien.points);
        } 
     }
      
        
     var nnew=newFrame(current);
     $('#alien').css({'background-image': 'url(images/alien.png)','background-position': nnew+'px 0px', 'left': '+='+alien.stepLen});
   }
      
   function left(){
    var current=$('#alien').css('background-position').split('p')[0];
    var whereIsAlienY=parseInt($('#alien').css('top').split('p')[0]);
    var whereIsAlienX=parseInt($('#alien').css('left').split('p')[0]);
     
     for( var i=0;i<wall.length;i++ ){
      if(conflict(parseInt(wall[i].x),parseInt(wall[i].y),parseInt(wall[i].h),parseInt(wall[i].h),whereIsAlienX-15,whereIsAlienY,parseInt(alien.WID),parseInt(alien.HEI))){
         return;
      }  
     }
     
     for(var i=0;i<jewels.length;i++){
      if(conflict(parseInt(jewels[i].x),parseInt(jewels[i].y),parseInt(jewels[i].h),parseInt(jewels[i].h),whereIsAlienX-15,whereIsAlienY,parseInt(alien.WID),parseInt(alien.HEI))){
       console.log("Mam jewel!"); rmvChild(jewels[i].p); jewels.splice(i,1); alien.points+=10; $('div#points > div').text(alien.points);
      } 
     }
     var nnew=newFrame(current);
     $('#alien').css({'background-image': 'url(images/alien_l.png)','background-position': nnew+'px 0px', 'left': '-='+alien.stepLen});
   }
   
  function down(){
   var current=$('#alien').css('background-position').split('p')[0];
   var whereIsAlienY=parseInt($('#alien').css('top').split('p')[0]);
   var whereIsAlienX=parseInt($('#alien').css('left').split('p')[0]);
    for(var i=0;i<wall.length;i++){
     if(conflict(parseInt(wall[i].x),parseInt(wall[i].y),parseInt(wall[i].h),parseInt(wall[i].h),whereIsAlienX,whereIsAlienY+15,parseInt(alien.WID),parseInt(alien.HEI))){
       return;
     }
    }
    
    for(var i=0;i<jewels.length;i++){
     if(conflict(parseInt(jewels[i].x),parseInt(jewels[i].y),parseInt(jewels[i].h),parseInt(jewels[i].h),whereIsAlienX,whereIsAlienY+15,parseInt(alien.WID),parseInt(alien.HEI))){
     console.log("Mam jewel!");
     rmvChild(jewels[i].p); jewels.splice(i,1); alien.points+=10; $('div#points > div').text(alien.points);
     } 
    }  
    
    var nnew=newFrame(current);
    $('#alien').css({'background-position': nnew+'px 0px', 'top': '+='+alien.stepLen});
   }

  function up(){
   var current=$('#alien').css('background-position').split('p')[0];
   var whereIsAlienY=parseInt($('#alien').css('top').split('p')[0]);
   var whereIsAlienX=parseInt($('#alien').css('left').split('p')[0]);
   for(var i=0;i<wall.length;i++){
    if(conflict(parseInt(wall[i].x),parseInt(wall[i].y),parseInt(wall[i].h),parseInt(wall[i].h),whereIsAlienX,whereIsAlienY-15,parseInt(alien.WID),parseInt(alien.HEI))){
      return;
    }
   }
   
   
   
   var nnew=newFrame(current);
   $('#alien').css({'background-position': nnew+'px 0px', 'top': '-='+alien.stepLen});
 
  }
  
  function newFrame(current){
        var nnew;
        if(current==-400){
            nnew=0;
        } else
        {
          nnew=current-80;            
        }
    return nnew;
  }


   $('body').keydown(function(e){
     
    switch(e.keyCode){
        case 40: alien.direction.d=true;break;    
        case 39: alien.direction.p=true ;break;
        case 38: alien.direction.g=true;break;
        case 37: alien.direction.l=true;break;
    }
    e.preventDefault();
    });
   
    $('body').keyup(function(e){
        switch(e.keyCode){
        case 40: alien.direction.d=false; break;
        case 39: alien.direction.p=false; break;
        case 38: alien.direction.g=false; break;
        case 37: alien.direction.l=false; break;     
        }
    });

    
    
    
 function gameLoop(){
        //debug
   var time1 = (new Date).getTime();
   var difference=time1-time;
   clearTimeout(countSetTimeOut);
   
   if(gr){
          (gr.x)++; gr.naMiejsce();//  if there is a granade update the place
           
           if( outOfTheScreen(null,gr.p) ){
           gr.destr(); gr=null; delete gr;
            }
   }
   else{
       throwGrenade();
   }
   
   $('#pomoc').css('top','0px').html(difference+'___'+interval);
   time=time1;
   //var countSetTimeOut;
    var alienTop=$('#alien').css('top').split('p')[0];
    var alienLeft=$('#alien').css('left').split('p')[0];
    if( (alien.direction.d && alien.direction.g) || (alien.direction.p && alien.direction.l) ){ setTimeout(gameLoop,150); };
    if( alien.direction.d && alienTop<HEIGTH-alien.HEI ) {down();};
    if( alien.direction.p && alienLeft<=WIDTH-alien.WID ) {right();};
    if( alien.direction.g && alienTop>=alien.stepLen) {up();};
    if( alien.direction.l && alienLeft>=alien.stepLen ) {left();};
    if( alien.lives<=0 ){alert('Score:'+alien.points); return;}
     
     var whereIsAlienX=parseInt(alienLeft);
     var whereIsAlienY=parseInt(alienTop);
  
         
         
        var whereIsGrenadeX=gr && 10*gr.x;
        var dGrenadeX=gr && gr.d;
        var whereIsGrenadeY=gr && ((HEIGTH-gr.h)-10*gr.y);
        var dGrenadeY= gr && gr.h;
        
         if( gr && conflict(whereIsGrenadeX,whereIsGrenadeY,dGrenadeX,dGrenadeY,
         whereIsAlienX,whereIsAlienY,parseInt(alien.WID),parseInt(alien.HEI)) ){
             console.log(gr);
             document.getElementById("alien").innerHTML="<img src='images/dead_p.gif' />";
        decrLife(1); 
             
             setTimeout(function(){document.getElementById("alien").innerHTML="";},1900);
           
        }
   
   
   
   for( var i in bombList ){
        
        var whereIsBombX=bombList[i].h*bombList[i].x;  //parseInt(currBomb.style.left.split('p')[0]);
        var dBombX=bombList[i].d;
        var whereIsBombY=bombList[i].y;  //parseInt(currBomb.style.top.split('p')[0]);
        var dBombY=bombList[i].h;
 
        if( conflict(whereIsBombX,whereIsBombY,dBombX,dBombY,whereIsAlienX,whereIsAlienY,parseInt(alien.WID),parseInt(alien.HEI)) ){
            explosion(i); //alert('AAAA!!!!');
             document.getElementById("alien").innerHTML="<img src='images/dead_p.gif' />";
        decrLife(20); 
             
             setTimeout(function(){document.getElementById("alien").innerHTML="";},1900);
            continue;
        }
       // console.log(gr);
        
        
        var currBomb=bombList[i].p;

        if( whereIsBombY+10+dBombY>=HEIGTH ){
              explosion(i);continue;
        }
        (bombList[i]).y+=10;

        currBomb.style.top=bombList[i].y+"px";
 }

    throwBomb();
    countSetTimeOut=setTimeout(gameLoop, interval);
   }

    
    function throwBomb(){
        var randomNumber=Math.random()*100;
        if( randomNumber<3 ){
            var out=Math.floor((Math.random()*WIDTH)/20);
            for(var i in bombList){if(i.x==out && i.y==0){throwBomb(); return;}}
            if(out==$('#alien').css('left').split('p')[0] && $('#alien').css('top').split('p')[0]==0){throwBomb(); return;}
            bombList[bomb_id]=new Bomb(out, 0, bomb_id);
        } else return;
        
        bomb_id++;
    }
    
    function throwGrenade(){
        var randomNumber=Math.random()*100;
        var randomNumber2=Math.random();
//        alert(randomNumber2*20);
        if(randomNumber<3){

        gr=new Grenade(0,0,200,50,1,function(x){return Math.ceil(25*Math.sin(Math.pow(Math.PI*x,.2 ))+30);
        });}
        }
    


explosion = function(nr){
     if ( typeof explosion.explosionNumber == 'undefined' ) {
       
        explosion.explosionNumber = 0;
    }
    
               var us=bombList[nr].p;
               us.style.backgroundImage="none";
               us.style.top=us.style.top.split('p')[0]-14+"px";
               us.style.left=us.style.left.split('p')[0]-10+"px";
               us.innerHTML="<img src='images/wybuch2.gif' width='40' height='40' />";
               us.style.width="40px";
               us.style.height="40px";
               var bum=document.getElementById("bum"+(explosion.explosionNumber++%4));
                bum.play();
                setTimeout(function(){rmvChild(us)},1900);
                bombList[nr].destr();
                delete bombList[nr];

}

    decrLife=function(howMany){
        if(howMany==0) return;
        alien.lives-=1;
        var wid=$('div#life').css('width').split('p')[0]
        $('div#life').css('width', (wid-1)+"px");
         setTimeout(decrLife, 100, howMany-1);
        
    }

    function conflict(x1,y1,s1,w1,x2,y2,s2,w2){
        var A=x1+s1>x2;
        var B= x1<x2+s2;
        var C= y1+w1>y2;
        var D=y1<y2+w2;
        return A && B && C && D;
    }
    
    function outOfTheScreen(ajdi,ob){
        var p=ob || document.getElementById(ajdi);
        var hg=parseInt(p.style.height.split('p')[0]);
        var wid=parseInt(p.style.width.split('p')[0]);
        var X=parseInt(p.style.left.split('p')[0]);
        var Y=parseInt(p.style.top.split('p')[0]);
        var A=Y+hg>HEIGTH;
        var B=Y<0;
        var C=X<0;
       // var D=szer+X>WIDTH;
        var D=X>WIDTH;
        return A || B || C || D;
    }

    
});


pauza=function (millis)
{
var date = new Date();
var curDate = null;

do { curDate = new Date(); }
while(curDate-date < millis);
}

rmvChild=function(ch){
                
                ch.parentNode.removeChild(ch);
}


Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

