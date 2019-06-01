window.addEventListener("load", program_code, false);

function program_code() {
    var ctx = main_frame.getContext("2d");
    var width = main_frame.width;
    var height = main_frame.height;

// -------------------------------------- ПЕРЕМЕЩЕНИЕ ОСЕЙ ТУДА, ГДЕ ИМ МЕСТО ---------------------------------------------------------------------------------------

        ctx.translate(0,height);
        ctx.scale(1,-1);

// ------------------------------------------------------ ЗАДАНИЕ ПЕРЕМЕННЫХ --------------------------------------------------------------------------------------

    const display_part = 24;    //коэффициент для определения единицы масштаба

    var scale = width/display_part;     // единица масштаба для отрисовки  
    
    var map = {     // бесполезный объект, содержащий начальное положение и скорость движения карты
        x : 600 ,         
        vx : 5
    }; 

    var bottom  = { height : 1/8*display_part };    // уовень пола. Сюда он будет записываться после переопределения

    //---------------------- ЦВЕТОВЫЕ СХЕМЫ --------------------------------------------------------------------------------------------

    var setThemeTeormech = {    // синий монохром
        ground : '#003399' ,
        floor  : '#1959d1' ,
        spike  : '#00538a' ,
        step   : '#120a8f' ,
        background : 'RoyalBlue'
    };

    var setThemeUssr = {    // красно желтая тема
        ground : '#980002' ,
        floor  : '#cc0605' ,
        spike  : '#ffd700' ,
        step   : '#8b0000' ,
        background : 'FireBrick'
    };

    var setThemeGreen = {   // зеленый монохром
        ground : '#009900' ,
        floor  : '#008000' ,
        spike  : '#008000' ,
        step   : '#09ab3f' ,
        background : 'ForestGreen'
    };

    var setThemeMaterial = {    // Mateial dark в унисон с ws
        ground : '#3b5998' ,
        floor  : '#6161ad' ,
        spike  : '#fa0000' ,
        step   : '#A9E9AA' ,
        background : 'DarkSlateGrey'
    };

    var setTheme = setThemeTeormech;    // базовая тема - теормех

    var cube = new Image();
    var palisade = new Image();
    var deathEffect = new Image();

    cube.src = "images/theor_mech_logo.png";
    palisade.src = "images/palisade.png";
    deathEffect.src = "images/jouDied.jpg";

    var player = {
        object : 'player',  // ключ - имя объекта

         x : 4 ,    y : 3 ,     // координаты
        vx : 0.1 , vy : 0.2,   // скорости
                   ay : 0.08 ,  // ускорение

        rise : false,   // флаг подъема
        fall : false,   // флаг спуска
        jumpCondition : false,  // флаг прыжка

  //    jumpHeight : 6 + bottom.height, // высота прыжка - не уверен, почему без нее все ок
        jumpTimer : 0   // таймер для перерасчета скорости в прыжке
    };

    let timerID;    // таймер для вызова requestnimationframe
    let K;
    var setThemeIndex = 0;  // левый счетчик

// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------- И СКАЗАЛ БОГ "ДА БУДЕТ КАРТА" --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    var setObject = [

        // каждый объект данного массива - какой либо структурный элемент карты, один из следующих типов :
        // floor - пол, основной структурный элемент, позволяющий возводить платформы и столбы - параметры - координаты сектора, с которого начинается отрисовка, длина, высота блока
        // step - маленькая ступенька-опора - параметры - координаты сектора базирования
        // spike - шип, треугольник, играющий роль основного препятствия - параметры - координаты сектора базирования
        // spikeM - тот же треугольник, но меньше - параметры - координаты сектора базирования
        // palisade - заготовка под дальнейшее оформление - параметры - координаты сектора базирования

        { object : 'ground' , x : 0 , y : 0 , length : width, h : 0},
        { object : 'spike' , x : 8 , y : 0 },
        { object : 'spikeM' , x : 17 , y : 0 },
        { object : 'spike' , x : 18 , y : 0 },
        { object : 'spike' , x : 25 , y : 0 },
        { object : 'spike' , x : 26 , y : 0 },

        { object : 'floor' , x : 27 , y : 0 , length : 1, h : 1 },
        { object : 'phantom' , x : 29 , y : 1 },
        { object : 'floor' , x : 31 , y : 0 , length : 1, h : 2 },
        { object : 'phantom' , x : 33 , y : 2 },
        { object : 'floor' , x : 35 , y : 0 , length : 1, h : 3 },
        { object : 'phantom' , x : 37 , y : 3 },

        { object : 'spike' , x : 46 , y : 0 },

        { object : 'floor' , x : 48 , y : 0 , length : 9, h : 1 },

        { object : 'phantom' , x : 58 , y : 1 },

        { object : 'spike' , x : 57 , y : 0 },
        { object : 'spike' , x : 58 , y : 0 },

        { object : 'floor' , x : 59 , y : 0 , length : 9, h : 1 },

        { object : 'spike' , x : 63 , y : 1 },

        { object : 'phantom' , x : 69 , y : 1 },

        { object : 'palisade' , x : 68 , y : 0 , length : 2 },

        { object : 'floor' , x : 70 , y : 0 , length : 9, h : 2 },

        { object : 'phantom' , x : 80 , y : 2 },

        { object : 'palisade' , x : 79 , y : 0 , length : 1 },
        { object : 'palisade' , x : 80 , y : 0 , length : 2 },
        { object : 'palisade' , x : 82 , y : 0 , length : 2 },
        { object : 'palisade' , x : 84 , y : 0 , length : 2 },
        { object : 'palisade' , x : 86 , y : 0 , length : 2 },
        { object : 'palisade' , x : 88 , y : 0 , length : 2 },
        { object : 'palisade' , x : 90 , y : 0 , length : 2 },
        { object : 'palisade' , x : 92 , y : 0 , length : 2 },
        { object : 'palisade' , x : 94 , y : 0 , length : 2 },
        { object : 'palisade' , x : 96 , y : 0 , length : 2 },

        { object : 'step' , x : 82 , y : 2 },
        { object : 'phantom' , x : 84 , y : 2 },
        { object : 'step' , x : 86 , y : 3.5 },
        { object : 'phantom' , x : 88 , y : 3.4 },
        { object : 'step' , x : 90 , y : 5 },
        { object : 'phantom' , x : 92 , y : 5 },
        { object : 'step' , x : 94 , y : 6.5 },
        { object : 'phantom' , x : 96 , y : 6.5 },

        { object : 'floor' , x : 96 , y : 0 , length : 19, h : 5 },

        { object : 'spikeM' , x : 101 , y : 5 },
        { object : 'spikeM' , x : 102 , y : 5 },
        { object : 'step' , x : 102 , y : 6 },
        { object : 'spikeM' , x : 103 , y : 5 },
        { object : 'step' , x : 103 , y : 6 },
        { object : 'phantom' , x : 105 , y : 6 },

        { object : 'spikeM' , x : 110 , y : 5 },
        { object : 'step' , x : 110 , y : 6 },
        { object : 'spikeM' , x : 111 , y : 5 },
        { object : 'step' , x : 111 , y : 6 },
       // { object : 'spikeM' , x : 112 , y : 5 },
        { object : 'phantom' , x : 113 , y : 6 },

        { object : 'floor' , x : 115 , y : 0 , length : 10, h : 4 },
        { object : 'phantom' , x : 116 , y : 5 },

        { object : 'floor' , x : 125 , y : 0 , length : 4, h : 5 },

        { object : 'spike' , x : 128 , y : 5 },

        { object : 'floor' , x : 129 , y : 0 , length : 4, h : 4 },

        { object : 'spike' , x : 129 , y : 4 },
        { object : 'phantom' , x : 130 , y : 6 },

        { object : 'floor' , x : 133 , y : 0 , length : 4, h : 4 },

        { object : 'palisade' , x : 137 , y : 0 , length : 1 },
        { object : 'palisade' , x : 138 , y : 0 , length : 2 },
        { object : 'palisade' , x : 140 , y : 0 , length : 2 },
        { object : 'palisade' , x : 142 , y : 0 , length : 2 },
        { object : 'palisade' , x : 144 , y : 0 , length : 2 },
        { object : 'palisade' , x : 146 , y : 0 , length : 2 },
        { object : 'palisade' , x : 148 , y : 0 , length : 2 },
        { object : 'palisade' , x : 150 , y : 0 , length : 2 },
        { object : 'palisade' , x : 152 , y : 0 , length : 2 },
        { object : 'palisade' , x : 154 , y : 0 , length : 2 },
        { object : 'palisade' , x : 156 , y : 0 , length : 2 },
        { object : 'palisade' , x : 158 , y : 0 , length : 2 },
        { object : 'palisade' , x : 160 , y : 0 , length : 2 },
        { object : 'palisade' , x : 162 , y : 0 , length : 2 },
        { object : 'palisade' , x : 164 , y : 0 , length : 2 },
        { object : 'palisade' , x : 166 , y : 0 , length : 2 },
        { object : 'palisade' , x : 168 , y : 0 , length : 2 },
        { object : 'palisade' , x : 170 , y : 0 , length : 2 },
        { object : 'palisade' , x : 172 , y : 0 , length : 2 },
        { object : 'palisade' , x : 174 , y : 0 , length : 2 },
        { object : 'palisade' , x : 176 , y : 0 , length : 2 },

        { object : 'step' , x : 139 , y : 4 },
        { object : 'step' , x : 140 , y : 4 },
        { object : 'step' , x : 141 , y : 4 },
        { object : 'step' , x : 142 , y : 4 },
        { object : 'spike' , x : 142 , y : 4 },
        { object : 'phantom' , x : 144 , y : 4 },

        { object : 'step' , x : 144 , y : 3 },
        { object : 'step' , x : 145 , y : 3 },
        { object : 'step' , x : 146 , y : 3 },
        { object : 'step' , x : 147 , y : 3 },
        { object : 'step' , x : 148 , y : 3 },
        { object : 'step' , x : 149 , y : 3 },
        { object : 'step' , x : 150 , y : 3 },
        { object : 'spike' , x : 150 , y : 3},

        { object : 'phantom' , x : 152 , y : 3 },

        { object : 'step' , x : 152 , y : 2 },
        { object : 'step' , x : 153 , y : 2 },
        { object : 'step' , x : 154 , y : 2 },
        { object : 'step' , x : 155 , y : 2 },
        { object : 'step' , x : 156 , y : 2 },
        { object : 'phantom' , x : 158 , y : 2 },

        { object : 'step' , x : 160 , y : 3 },
        { object : 'phantom' , x : 162 , y : 3 },
        { object : 'step' , x : 163.5 , y : 4.5 },
        { object : 'phantom' , x : 165.5 , y : 4.5 },
        { object : 'step' , x : 167.5 , y : 6 },
        { object : 'phantom' , x : 169.5 , y : 6 },
        { object : 'step' , x : 171 , y : 7.5 },
        { object : 'phantom' , x : 173 , y : 7.5 },
        { object : 'step' , x : 174 , y : 9 },
        { object : 'phantom' , x : 175.5 , y : 9 },
        { object : 'step' , x : 176 , y : 9 },

        { object : 'spike' , x : 176 , y : 9 },

        { object : 'floor' , x : 173 , y : 4 , length : 4, h : 1 },
        { object : 'floor' , x : 177 , y : 0 , length : 8, h : 5 },
        { object : 'phantom' , x : 186 , y : 5 },

        { object : 'spikeM' , x : 200 , y : 0 },

        { object : 'floor' , x : 201 , y : 0 , length : 1, h : 1 },
        { object : 'phantom' , x : 203 , y : 1 },

        { object : 'palisade' , x : 202 , y : 0 , length : 3 },

        { object : 'floor' , x : 205 , y : 0 , length : 1, h : 2 },
        { object : 'phantom' , x : 207 , y : 2 },

        { object : 'palisade' , x : 206 , y : 0 , length : 3 },

        { object : 'floor' , x : 209 , y : 0 , length : 1, h : 3 },
        { object : 'spike' , x : 210 , y : 2 },
        { object : 'floor' , x : 210 , y : 0 , length : 1, h : 2 },
        { object : 'spike' , x : 211 , y : 2 },
        { object : 'phantom' , x : 211 , y : 3 },
        { object : 'floor' , x : 211 , y : 0 , length : 1, h : 2 },
        { object : 'spike' , x : 212 , y : 2 },
        { object : 'floor' , x : 212 , y : 0 , length : 1, h : 2 },
        { object : 'spike' , x : 213 , y : 2 },
        { object : 'floor' , x : 213 , y : 0 , length : 1, h : 2 },
        { object : 'floor' , x : 214 , y : 0 , length : 1, h : 3 },
        { object : 'phantom' , x : 216 , y : 3 },

        { object : 'palisade' , x : 215 , y : 0 , length : 2 },

        { object : 'floor' , x : 217 , y : 0 , length : 1, h : 2 },
        { object : 'phantom' , x : 219 , y : 2 },

        { object : 'palisade' , x : 218 , y : 0 , length : 2 },

        { object : 'floor' , x : 220 , y : 0 , length : 1 , h : 1 },
        { object : 'phantom' , x : 222 , y : 1 },

        { object : 'spikeM' , x : 221 , y : 0 },
        { object : 'phantom' , x : 1000 , y : 2 },
        ];

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------  
// ----------------------------------------------------------------- БЛОК ДЛЯ ОТРИСОВКИ ЭЛЕМЕНТОВ КАРТЫ --------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------

        function setGround(x, y, length, h, setTheme) {  // днище
            ctx.beginPath();
                ctx. fillStyle = setTheme.ground;
                ctx.fillRect(x*scale, y*scale, length*scale, (h+3)*scale);
            ctx.fill();
        }

        function setPhantom(x, y) {     // костыль
            ctx.beginPath();
                ctx.fillStyle= setTheme.background;//setTheme.background;

                // нужен, чтобы пофиксить баги переопределения высоты. Отрисовывается в тон фона, за счет чего абсолютно невидим
                
                ctx.fillRect(x*scale + map.x, (display_part*1/8+y)*scale, scale, scale);
            ctx.fill();
        }

        function setFloor(x , y, length, h, setTheme) {   // пол (тупо прямоугольный блок)
            ctx.beginPath();
                ctx.fillStyle=setTheme.floor;

                // x,y - координаты левого нижнего угла - определяют сектор, с которого начнется отрисовка
                // length, h - длина и ширина блока - определяет количество занимаемых секторов
                // х расчитывается с поправкой на передвижение, у - с поправкой на существование пола
                
                ctx.fillRect(x*scale + map.x, (display_part*1/8+y)*scale, length*scale, h*scale);
            ctx.fill();
        }

        function setPalisade(x , y, length) {   // кристаллики
            ctx.drawImage(palisade, x*scale + map.x,(3+ y)*scale, length*scale, scale/2);            
        }

        function setStep (x, y, setTheme) {   // ступенька (маленький блок на половину сектора)
            ctx.beginPath();
            ctx.fillStyle=setTheme.step;

                // х,у - определяют сектор, в котором отрисуется ступенька
                // х расчитывается с поправкой на передвижение, у - с поправкой на существование пола и особенностей отрисовки

                ctx.fillRect(x*scale + map.x, (y+display_part*1/8)*scale - scale/2, scale, scale/2);
            ctx.fill();
        }

        function setSpike(x,y, setTheme) {    // шип (треугольничек)
            ctx.beginPath();
            ctx.fillStyle=setTheme.spike;

                // шип рисуется по принципу многоугольника
                // х и у определяют сектор, в котором отрисуется шип
                // далее просто отрисовывается равнобедренный треугольник в заданном секторе

                ctx.lineTo( x*scale  + map.x, (y+display_part*1/8)*scale );
                ctx.lineTo( (x+0.5)*scale + map.x, (y+display_part*1/8 +1)*scale );
                ctx.lineTo( (x+1)*scale + map.x, (y+display_part*1/8)*scale );
            ctx.closePath();
            ctx.fill();
        }

        function setSpikeM(x, y, setTheme) {    // минишип (треугольничек)
            ctx.beginPath();
            ctx.fillStyle="#0000ff";

                // шип рисуется по принципу многоугольника
                // х и у определяют сектор, в котором отрисуется шип
                // далее просто отрисовывается равнобедренный треугольник в заданном секторе

                ctx.lineTo( x*scale  + map.x, (y+display_part*1/8)*scale );
                ctx.lineTo( (x+0.5)*scale + map.x, (y+display_part*1/8+0.5)*scale );
                ctx.lineTo( (x+1)*scale + map.x, (y+display_part*1/8)*scale );
            ctx.closePath();
            ctx.fill();
        }

    // --------------------  ОТРИСОВКА КАРТЫ ------------------------------------------------------------------------

        function drawMap() {
            ctx.clearRect(0,0,width,height);    // первичная очистка

            // отрисовка блоков

            for ( var i = 0; i < setObject.length; i++ ) {
                if (setObject[i].object == 'ground') {
                    setGround(setObject[i].x, setObject[i].y, setObject[i].length, setObject[i].h, setTheme);
                    continue;                    
                } 

                if (setObject[i].object == 'phantom') {
                    setPhantom(setObject[i].x, setObject[i].y);
                }

                if (setObject[i].object == 'floor') {
                    setFloor(setObject[i].x , setObject[i].y , setObject[i].length , setObject[i].h, setTheme);
                    continue;                    
                }
                    
                if (setObject[i].object == 'palisade') {
                    setPalisade(setObject[i].x , setObject[i].y , setObject[i].length);
                    continue;
                }

                else if (setObject[i].object == 'step') {
                    setStep(setObject[i].x , setObject[i].y, setTheme);
                    continue;
                } 

                else if (setObject[i].object == 'spike') {
                    setSpike(setObject[i].x , setObject[i].y, setTheme);
                }
                    
                else if (setObject[i].object == 'spikeM') {
                    setSpikeM(setObject[i].x , setObject[i].y, setTheme);
                }
                    
            }
        }

// ---------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------ АНИМИРОВАНИЕ КУБИКА И ПРЫЖОК ---------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------

        function drawPlayer () {

        // очистка производится при отрисовке карты - тут чистить ничего не надо
            ctx.drawImage(cube, player.x*scale, player.y*scale, scale,scale);
        }

        function animationPlayer() {
            // да, просто двигается фон
            // нет, я ничего не забыл 
            map.x -= map.vx;
            
            drawMap();
            drawPlayer();
        }

        function distructAnimation() {
            for (let k = 0; k < 8; k++) {
                ctx.drawImage(deathEffect, payer.x*scale + 0.5*scale, player.y  );
            }
        }

        var playerJump = function() {

            // основная функция прыжка
            // в начале прыжка ставим флаг, который сигнализирует, что кубик в прыжке

            player.jumpCondition = true;    
            player.jumpTimer += 0.1;                     

            // далее объявляем два флага - один отвечает за побъем, второй за спуск
            // пока активен флаг подъема\спуска и отключен другой - работает соответствующая активному флагу фаза прыжка

            if ( player.rise === true && player.fall === false ) {
                player.y += player.vy - player.ay*player.jumpTimer*player.jumpTimer;
                map.x -= map.vx/6;
            }

            else if ( player.fall === true && player.rise === false) {
                player.y -= player.vy - player.ay*player.jumpTimer*player.jumpTimer;
                map.x -= map.vx/6;
            }

            else {};
            
            // при достижении максимальной высоты прыжка флаги меняют знак
            // вроде без этого работать не должно, но чет нифига
            // if ( player.y >= player.jumpHeight) {
            //     player.rise = false;
            //     player.fall = true;
            //     player.jumpTimer = 0;
            // }
            // else {};

            timerID = requestAnimationFrame(playerJump);
            
            // когда кубик достигнет пола - обнулим все флаги, тем самым остановив прыжок
            // заодно отзовем requestanimationframe          

            if (player.y <= bottom.height) {
                player.y = bottom.height;
                player.rise = false;
                player.fall = false;
                player.jumpCondition = false;
                player.jumpTimer = 0;
                cancelAnimationFrame(timerID);
            }          
        }

// ---------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------- ОПРЕДЕЛЕНИЕ ВЫСОТЫ И СТОЛКНОВЕНИЯ -----------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------

        function bottomLevel() {

            //необходимо каждый такт определять уровень пола
            bottom.height = setObject[0].h +3;  // базовый уровень - уровень земли

            for (let k = 1; k < setObject.length; k++) {    

                // проверяются все элементы. Высота оказавшихся рядом с кубиком - новая высота пола
                if  (Math.abs(setObject[k].x*scale - player.x*scale - scale + map.x) <= 5) {
                    if (setObject[k].object == 'floor') {
                        bottom.height = setObject[k].h+3;
                    }
                } 

                else {  // и опять выставление дефолтной высоты. на всякий случай
                    bottom.height = setObject[0].h +3;
                }
            }
        }

        function horizontalCollision() {
            for (let k = 1; k < setObject.length; k++ ) {
                if (setObject[k].object == 'floor' && setObject[k].x*scale - player.x*scale - scale + map.x <= 5 && 
                    setObject[k].x*scale - player.x*scale - scale + map.x >= -scale*setObject[k].length && (player.y-3)*scale <= setObject[k].h*scale + 20 ) {

                     bottom.height = setObject[k].h+3;
                }

                if (setObject[k].object == 'step' && setObject[k].x*scale - player.x*scale - scale + map.x <= 5 &&
                    setObject[k].x*scale - player.x*scale - scale + map.x >= -scale && (player.y-3)*scale <= setObject[k].y*scale + 20 ) {

                    bottom.height = setObject[k].y+3;
                }

                if (setObject[k].object == 'spike' && setObject[k].x*scale - player.x*scale - scale + map.x <= 5 &&
                    setObject[k].x*scale - player.x*scale - scale + map.x >= -scale - 10 && (player.y-3)*scale <= setObject[k].y*scale) {
                    
                    distruct();
                }
                
                if (setObject[k].object == 'spikeM' && setObject[k].x*scale - player.x*scale - scale + map.x <= 5 &&
                    setObject[k].x*scale - player.x*scale - scale + map.x >= -scale - 10 && (player.y-3)*scale <= setObject[k].y*scale/2) {
                    
                    distruct();
                }

                if (setObject[k].object == 'palisade'  && setObject[k].x*scale - player.x*scale - scale + map.x <= 5 && 
                setObject[k].x*scale - player.x*scale - scale + map.x >= -scale*setObject[k].length && (player.y-3)*scale <= setObject[k].h*scale + 20 ) {
                    
                    distruct();
                }
            }
        }
        
        function verticalCollision() {
            for ( let k = 1; k < setObject.length; k++ ) {
                if (setObject[k].object == 'floor' && setObject[k].x*scale - player.x*scale - scale + map.x <= 5 &&
                    setObject[k].x*scale - player.x*scale - scale + map.x >= 0 && (player.y-3)*scale <= setObject[k].h*scale -5 ) {
                    
                    player.x = setObject[k].x + map.x/scale - 1;
                    player.y = 3;
                    distruct();
                }

                if (setObject[k].object == 'phantom' && setObject[k].x*scale - player.x*scale - scale + map.x <= 5 &&
                    setObject[k].x*scale - player.x*scale - scale + map.x >= 0 && (player.y-3) <= setObject[k].y) { 
                
                    playerFall();
                    playerJump();
                }

                if ( setObject[k].object == 'step' && setObject[k].x*scale - player.x*scale - scale + map.x <= 5 &&
                    setObject[k].x*scale - player.x*scale - scale + map.x >= 0 && (player.y-3)*scale <= setObject[k].y*scale -5) {
                      
                    player.x = setObject[k].x + map.x/scale - 1;
                    distruct();
                }

                if (setObject[k].object == 'spike' && Math.abs(setObject[k].x*scale - player.x*scale - scale + map.x) <= 5 &&
                    (player.y-3)*scale <= setObject[k].y*scale) {
                    
                    player.x = setObject[k].x + map.x/scale -1;
                    distruct();
                }
             
                if (setObject[k].object == 'spikeM' && Math.abs(setObject[k].x*scale - player.x*scale - scale + map.x) <= 5 &&
                    (player.y-3)*scale <= setObject[k].y*scale/2) {
                
                    player.x = setObject[k].x + map.x/scale -1;
                    distruct();
                }
            }
        }

// ---------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------

        function distruct() {   

            // самоуничтожение после столкновения

            map.x = 600;
            bottom.height = 1/8*display_part;
            playerFall();
        }

        function playerFall() {

            // падение после соскальзывания с блока ( да, очередной костыль ) 

            player.jumpTimer += 0.1;

            if ( player.y > bottom.height )    player.y -= player.ay*player.jumpTimer*player.jumpTimer;

            K = requestAnimationFrame(playerFall);

            if (player.y <= bottom.height) {
                player.y = bottom.height;
                cancelAnimationFrame(K);
            }
        }
    
        function keyDownScript(e) { // функция по нажатию клавиши

            // пауза не предусматривается ( - мы за хардкорь - )
            // основное игровое действие - прыжок - будем осуществлять на пробел
            // порверяем нажатие пробела и текущее состояние кубика - если он еще в прыжке - вызова не произойдет

            if (e.keyCode == 32 && player.jumpCondition == false) {
                player.rise = true;
                playerJump();
            }
            
            // ctrl (кейкод 17) отвечает за смену цветовой гаммы
            // по ее нажатию гамма автоматически меняется по кругу из четырех пресетов

            else if (e.keyCode == 17) {
                setThemeIndex++;

                switch (setThemeIndex) {    // каруселька цветовых схем
                    case 0 : 
                        main_frame.removeAttribute("style");
                        main_frame.setAttribute("style", "background :RoyalBlue;");
                        setTheme = setThemeTeormech;
                        break;
                        
                    case 1 : 
                        main_frame.removeAttribute("style");
                        main_frame.setAttribute("style", "background : FireBrick;");
                        setTheme = setThemeUssr;
                        break;

                    case 2 : 
                        main_frame.removeAttribute("style");
                        main_frame.setAttribute("style", "background : ForestGreen;");
                        setTheme = setThemeGreen;
                        break;

                    case 3 : 
                        main_frame.removeAttribute("style");
                        main_frame.setAttribute("style", "background : DarkSlateGrey;");
                        setTheme = setThemeMaterial;
                        break;

                    default :   // замыкает карусельку и возвращает начальное значение
                        setThemeIndex = 0;
                        main_frame.removeAttribute("style");
                        main_frame.setAttribute("style", "background :RoyalBlue;");
                        setTheme = setThemeTeormech;                        
                }
            }
        }

        var gameLoop = function() {

            // главный игровой цикл - в нем происходит вызов всех жизненно важных функций

            addEventListener ("keydown", keyDownScript);    // ожидаем события нажатия клавиши

            bottomLevel();          // перманентное определение высоты пола
            horizontalCollision();  // просчет столкновений по горизонтали
            verticalCollision();    // просчет столкновений по вертикали
            animationPlayer();      // основная анимация

            // преимущество requestAnimationFrame над setInterval в том, что такой вызов синхронизируется со всеми остальными отрисовками
            // таким образом снижается нагрузка на процессор, однако может проседать частота кадров
            // в таком случае придется дополнить код альтернативным вызовом ( или нет?) 

            // расчитываем, на каком месте игра должна закончиться
            if (-map.x <= 230*scale ) requestAnimationFrame(gameLoop); 
            else return alert('you win!');  
        }

        // первичный вызов необходимых функций
        drawMap();
        gameLoop();
}



