window.addEventListener("load", program_code, false);

function program_code() {
    var ctx = main_frame.getContext("2d");
    var width = main_frame.width;
    var height = main_frame.height;

// -------------------------------------- ПЕРЕМЕЩЕНИЕ ОСЕЙ ТУДА, ГДЕ ИМ МЕСТО ---------------------------------------------------------------------------------------------------------------

        ctx.translate(0,height);
        ctx.scale(1,-1);

// ------------------------------------------------------ ЗАДАНИЕ ПЕРЕМЕННЫХ ----------------------------------------------------------------------------------------------------------------

    const display_part = 24; //коэффициент для определения единицы масштаба

    var scale = width/display_part; // единица масштаба для отрисовки  
    var coords = {x : 0, x_shift : 0 }; 
    
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------- И СКАЗАЛ БОГ "ДА БУДЕТ КАРТА" ------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var setObject = [
    
            // каждый объект данного массива - какой либо структурный элемент карты, один из следующих типов :
            // floor - пол, основной структурный элемент, позволяющий возводить платформы и столбы - параметры - координаты сектора, с которого начинается отрисовка, длина, высота блока
            // step - маленькая ступенька-опора - параметры - координаты сектора базирования
            // spike - шип, треугольник, играющий роль основного препятствия - параметры - координаты сектора базирования
            // spikeM - тот же треугольник, но меньше - параметры - координаты сектора базирования
            // palisade - заготовка под дальнейшее оформление - параметры - координаты сектора базирования

            { object : 'spike'    , x : 8  , y : 0 },
            { object : 'spikeM'   , x : 17 , y : 0 },
        	{ object : 'spike'    , x : 18 , y : 0 },
	    	{ object : 'spike'    , x : 25 , y : 0 },
	    	{ object : 'spike'    , x : 26 , y : 0 },
        
        	{ object : 'floor'    , x : 27 , y : 0 , length : 1, h : 1 },
        	{ object : 'floor'    , x : 29 , y : 0 , length : 1, h : 2 },
        	{ object : 'floor'    , x : 31 , y : 0 , length : 1, h : 3 },
               
        	{ object : 'spike'    , x : 40 , y : 0 },
        	{ object : 'spike'    , x : 41 , y : 0 },
               
        	{ object : 'floor'    , x : 48 , y : 0 , length : 9, h : 1 },
           
        	{ object : 'spike'    , x : 57 , y : 0 },
        	{ object : 'spike'    , x : 58 , y : 0 },
        
        	{ object : 'floor'    , x : 59 , y : 0 , length : 9, h : 1 },
        
        	{ object : 'spike'    , x : 63 , y : 1 },
        
        	{ object : 'palisade' , x : 68 , y : 0 , length : 2 },
        
        	{ object : 'floor'    , x : 70 , y : 0 , length : 9, h : 2 },
        
        	{ object : 'spike'    , x : 74 , y : 2 },
            
        	{ object : 'palisade' , x : 79 , y : 0 , length : 19 },
        
        	{ object : 'step'     , x : 81 , y : 2 },
        	{ object : 'step'     , x : 84 , y : 3 },
        	{ object : 'step'     , x : 87 , y : 4 },
        	{ object : 'step'     , x : 90 , y : 5 },
        	{ object : 'step'     , x : 93 , y : 6 },
            
        	{ object : 'floor'    , x : 96 , y : 4 , length : 2, h : 1 },
        	{ object : 'floor'    , x : 98 , y : 0 , length : 17, h : 5 },
        
        	{ object : 'spikeM'   , x : 101 , y : 5 },
        	{ object : 'spikeM'   , x : 102 , y : 5 },
        
        	{ object : 'step'     , x : 102 , y : 6 },
        
        	{ object : 'spikeM'   , x : 103 , y : 5 },
        
        	{ object : 'step'     , x : 103 , y : 6 },
        
        	{ object : 'spikeM'   , x : 104, y : 5 },    
        	{ object : 'spikeM'   , x : 108 , y : 5 },
        	{ object : 'spikeM'   , x : 109 , y : 5 },
        
        	{ object : 'step'     , x : 109 , y : 6 },
        
        	{ object : 'spikeM'   , x : 110 , y : 5 },
        
        	{ object : 'step'     , x : 110 , y : 6 },
        
        	{ object : 'spikeM'   , x : 111, y : 5 },
            
        	{ object : 'floor'    , x : 115 , y : 0 , length : 10, h : 4 },
           
        	{ object : 'spike'    , x : 118 , y : 5 },
        	{ object : 'spike'    , x : 119 , y : 5 },
        	{ object : 'spike'    , x : 120 , y : 5 },
        	{ object : 'spike'    , x : 121 , y : 5 },
               
        	{ object : 'floor'    , x : 125 , y : 0 , length : 4, h : 5 },
           
        	{ object : 'spike'    , x : 128 , y : 5 },
           
        	{ object : 'floor'    , x : 129 , y : 0 , length : 4, h : 4 },
           
        	{ object : 'spike'    , x : 129 , y : 4 },
           
        	{ object : 'floor'    , x : 133 , y : 3 , length : 4, h : 1 },
            
        	{ object : 'palisade' , x : 133 , y : 0 , length : 44 },
        
        	{ object : 'step'     , x : 139 , y : 4 },
        	{ object : 'step'     , x : 140 , y : 4 },
        	{ object : 'step'     , x : 141 , y : 4 },
        	{ object : 'step'     , x : 142 , y : 4 },
           
        	{ object : 'spike'    , x : 142 , y : 4 },
               
        	{ object : 'step'     , x : 144 , y : 3 },
        	{ object : 'step'     , x : 145 , y : 3 },
        	{ object : 'step'     , x : 146 , y : 3 },
        	{ object : 'step'     , x : 147 , y : 3 },
        	{ object : 'step'     , x : 148 , y : 3 },
        	{ object : 'step'     , x : 149 , y : 3 },
        	{ object : 'step'     , x : 150 , y : 3 },
           
        	{ object : 'spike'    , x : 150 , y : 3 },
               
        	{ object : 'step'     , x : 152 , y : 2 },
        	{ object : 'step'     , x : 153 , y : 2 },
        	{ object : 'step'     , x : 154 , y : 2 },
        	{ object : 'step'     , x : 155 , y : 2 },
        	{ object : 'step'     , x : 156 , y : 2 },
                
        	{ object : 'step'     , x : 159 , y : 3 },
        	{ object : 'step'     , x : 162 , y : 4 },
        	{ object : 'step'     , x : 165 , y : 5 },
        	{ object : 'step'     , x : 168 , y : 6 },
        	{ object : 'step'     , x : 171 , y : 7 },
        	{ object : 'step'     , x : 174 , y : 8 },
           
        	{ object : 'spike'    , x : 174 , y : 8 },
            
        	{ object : 'floor'    , x : 173 , y : 4 , length : 4, h : 1 },
        	{ object : 'floor'    , x : 177 , y : 0 , length : 8, h : 5 },
        	{ object : 'floor'    , x : 177 , y : 7 , length : 8, h : 3 },
            
        //------------------- СМЕНА ГРАВИТАЦИИ ------------------------------------------
    
            // теперь к вышеперечисленным объектам добавляются новые
            // Rspike - интвертированный шип - тот же треугольник, но перевернутый
            // RspikeM - аналогично предыдущему - уменьшенный Rspike 

        	{ object : 'palisade' , x : 185 , y : 0 , length : 7 },
            
        	{ object : 'Rspike'   , x : 193 , y : 10 },    
        	{ object : 'Rspike'   , x : 197 , y : 10 },
        	{ object : 'Rspike'   , x : 198 , y : 10 },
        	{ object : 'Rspike'   , x : 204 , y : 10 },
        
        	{ object : 'floor'    , x : 208 , y : 8 , length : 1, h : 1 },
        
        	{ object : 'Rspike'   , x : 208 , y : 8 },
        	{ object : 'Rspike'   , x : 212 , y : 10 },    
        	{ object : 'Rspike'   , x : 220 , y : 10 },
        
        	{ object : 'floor'    , x : 224 , y : 8 , length : 1, h : 1 },
        
        	{ object : 'Rspike'   , x : 224 , y : 8 },
        	{ object : 'Rspike'   , x : 228 , y : 10 },
        
        	{ object : 'floor'    , x : 229 , y : 9 , length : 1, h : 1 },
        
        	{ object : 'Rspike'   , x : 230 , y : 10 },
        	{ object : 'Rspike'   , x : 231 , y : 10 },
        	{ object : 'Rspike'   , x : 232 , y : 10 },    
        	{ object : 'Rspike'   , x : 237 , y : 10 },
        
        	{ object : 'spike'    , x : 237 , y : 6 },
        
        	{ object : 'floor'    , x : 237 , y : 5 , length : 1, h : 1 },
        
        	{ object : 'Rspike'   , x : 238 , y : 10 },
        	{ object : 'spike'    , x : 238 , y : 6 },
        
        	{ object : 'floor'    , x : 238 , y : 5 , length : 1, h : 1 },    
        	{ object : 'floor'    , x : 244 , y : 9 , length : 1, h : 1 },
        
        	{ object : 'step'     , x : 244 , y : 9 },
        
        	{ object : 'spike'    , x : 244 , y : 6 },
        
        	{ object : 'floor'    , x : 244 , y : 5 , length : 1, h : 1 },    
        	{ object : 'floor'    , x : 247 , y : 9 , length : 1, h : 1 },
        
        	{ object : 'step'     , x : 247 , y : 9 },
        
        	{ object : 'spike'    , x : 247 , y : 6 },
        
        	{ object : 'floor'    , x : 247 , y : 5 , length : 1, h : 1 },
            
        	{ object : 'RspikeM'  , x : 251 , y : 10 },
        	{ object : 'RspikeM'  , x : 252 , y : 10 },
            
        	{ object : 'floor'    , x : 256 , y : 9 , length : 5, h : 1 },
        	{ object : 'floor'    , x : 256 , y : 0 , length : 5, h : 7 },
            
        // ------------- ОБРАТНАЯ СМЕНА ГРАВИТАЦИИ -------------------------------------
            
        	{ object : 'spikeM'   , x : 269 , y : 0 },
        
        	{ object : 'floor'    , x : 270 , y : 0 , length : 1, h : 1 },
        	{ object : 'floor'    , x : 270 , y : 4 , length : 1, h : 2 },
        
        	{ object : 'RspikeM'  , x : 270 , y : 4 },
        
        	{ object : 'palisade' , x : 271 , y : 0 , length : 1 },
        
        	{ object : 'floor'    , x : 272 , y : 0 , length : 1, h : 2 },
        
        	{ object : 'palisade' , x : 273 , y : 0 , length : 1 },
        
        	{ object : 'floor'    , x : 274 , y : 0 , length : 1, h : 3 },
        
        	{ object : 'spike'    , x : 275 , y : 2 },
        
        	{ object : 'floor'    , x : 275 , y : 0 , length : 1, h : 2 },
        	{ object : 'floor'    , x : 276 , y : 0 , length : 1, h : 3 },
        
        	{ object : 'palisade' , x : 277 , y : 0 , length : 1 },
        
        	{ object : 'floor'    , x : 278 , y : 0 , length : 1, h : 2 },
        	{ object : 'floor'    , x : 278 , y : 5 , length : 1, h : 1 },
        
        	{ object : 'RspikeM'  , x : 278 , y : 5 },
        
        	{ object : 'palisade' , x : 279 , y : 0 , length : 1 },
        
        	{ object : 'floor'    , x : 280 , y : 0 , length : 1 , h : 1 },
        	{ object : 'floor'    , x : 280 , y : 4 , length : 1 , h : 2 },
        
        	{ object : 'RspikeM'  , x : 280 , y : 4 },
        
        	{ object : 'spikeM'   , x : 281 , y : 0 },
    ];

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //  var drawPart = [];      // здесь будем хранить данные для отрисовки видимой части (возможно и не понадобится)

    var player = {
        object : 'player',  // ключ - имя объекта

        x : 2 , y : 0 ,     // координаты
        vx : 0.1, vy : 0,   // скорости
        ay : 1,             // ускорение

        r : scale           // размеры кубика
    };

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------  
// ----------------------------------------------------------------- БЛОК ДЛЯ ОТРИСОВКИ ЭЛЕМЕНТОВ КАРТЫ -------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        function setFloor(x , y, length, h) {   // пол (тупо прямоугольный блок)
            ctx.beginPath();
                ctx.fillStyle="#0000ff";

                // x,y - координаты левого нижнего угла - определяют сектор, с которого начнется отрисовка
                // length, h - длина и ширина блока - определяет количество занимаемых секторов
                // х расчитывается с поправкой на передвижение, у - с поправкой на существование пола
                
                ctx.fillRect(x*scale + coords.x, (display_part*1/8+y)*scale, length*scale, h*scale);
            ctx.fill();
        }

        function setPalisade(x , y, length) {   // кристаллики
            ctx.beginPath();
                ctx.fillStyle="#00ffff";

                // x,y - координаты левого нижнего угла - определяют сектор, с которого начнется отрисовка
                // length, h - длина и ширина блока - определяет количество занимаемых секторов
                // х расчитывается с поправкой на передвижение, у - с поправкой на существование пола
                
                ctx.fillRect(x*scale + coords.x, (display_part*1/8+y)*scale, length*scale, scale/2);
            ctx.fill();
        }

        function setStep (x, y) {   // ступенька (маленький блок на половину сектора)
            ctx.beginPath();
            ctx.fillStyle="#ff0000";

                // х,у - определяют сектор, в котором отрисуется ступенька
                // х расчитывается с поправкой на передвижение, у - с поправкой на существование пола и особенностей отрисовки

                ctx.fillRect(x*scale + coords.x, (y+display_part*1/8)*scale - scale/2, scale, scale/2);
            ctx.fill();
        }

        function setSpike(x,y) {    // шип (треугольничек)
            
            ctx.beginPath();
            ctx.fillStyle="#00ff00";

                // шип рисуется по принципу многоугольника
                // х и у определяют сектор, в котором отрисуется шип
                // далее просто отрисовывается равнобедренный треугольник в заданном секторе

                ctx.lineTo( x*scale  + coords.x, (y+display_part*1/8)*scale );
                ctx.lineTo( (x+0.5)*scale + coords.x, (y+display_part*1/8 +1)*scale );
                ctx.lineTo( (x+1)*scale + coords.x, (y+display_part*1/8)*scale );
            ctx.closePath();
            ctx.fill();
        }

        function reverseSetSpike(x,y) {    // перевернутый шип (треугольничек)
            
            ctx.beginPath();
            ctx.fillStyle="#00ff00";

                // шип рисуется по принципу многоугольника
                // х и у определяют сектор, в котором отрисуется шип
                // далее просто отрисовывается равнобедренный треугольник в заданном секторе

                ctx.lineTo( x*scale  + coords.x, (y+display_part*1/8)*scale );
                ctx.lineTo( (x+0.5)*scale + coords.x, (y+display_part*1/8 -1)*scale );
                ctx.lineTo( (x+1)*scale + coords.x, (y+display_part*1/8)*scale );
            ctx.closePath();
            ctx.fill();
        }

        function setSpikeM(x,y) {    // минишип (треугольничек)
            
            ctx.beginPath();
            ctx.fillStyle="#ff0f9f";

                // шип рисуется по принципу многоугольника
                // х и у определяют сектор, в котором отрисуется шип
                // далее просто отрисовывается равнобедренный треугольник в заданном секторе

                ctx.lineTo( x*scale  + coords.x, (y+display_part*1/8)*scale );
                ctx.lineTo( (x+0.5)*scale + coords.x, (y+display_part*1/8+0.5)*scale );
                ctx.lineTo( (x+1)*scale + coords.x, (y+display_part*1/8)*scale );
            ctx.closePath();
            ctx.fill();
        }

        function reverseSetSpikeM(x,y) {    // перевернутый минишип (треугольничек)
            
            ctx.beginPath();
            ctx.fillStyle="#ff0f9f";

                // шип рисуется по принципу многоугольника
                // х и у определяют сектор, в котором отрисуется шип
                // далее просто отрисовывается равнобедренный треугольник в заданном секторе

                ctx.lineTo( x*scale  + coords.x, (y+display_part*1/8)*scale );
                ctx.lineTo( (x+0.5)*scale + coords.x, (y+display_part*1/8-0.5)*scale );
                ctx.lineTo( (x+1)*scale + coords.x, (y+display_part*1/8)*scale );
            ctx.closePath();
            ctx.fill();
        }

        // --------------------  ОТРИСОВКА КАРТЫ ------------------------------------------------------------------------

        function drawMap() {

            ctx.clearRect(0,0,width,height);    // первичная очистка       

            // отрисовка сетки

            for (var i = 0; i < display_part + Math.floor(Math.abs(coords.x_shift)/display_part); i++) {
                ctx.beginPath();
                    ctx.lineTo(i*scale + coords.x , 0);
                    ctx.lineTo(i*scale + coords.x , height);
                ctx.stroke();
            }

            for (var j = 0; j < display_part*9/16; j++) {
                
                ctx.beginPath();
                    ctx.lineTo(0 , j*scale);
                    ctx.lineTo(width, j*scale);
                ctx.stroke();
            }

            // отрисовка блоков

                for ( var i = 0; i < setObject.length; i++ ) {
                    if (setObject[i].object == 'floor') {
                        setFloor(setObject[i].x , setObject[i].y , setObject[i].length , setObject[i].h);
                        continue;
                    }
                    
                    if (setObject[i].object == 'palisade') {
                        setPalisade(setObject[i].x , setObject[i].y , setObject[i].length , setObject[i].h);
                        continue;
                    }

                    else if (setObject[i].object == 'step') {
                        setStep(setObject[i].x , setObject[i].y);
                        continue;
                    } 

                    else if (setObject[i].object == 'spike') {
                        setSpike(setObject[i].x , setObject[i].y);
                    }
                    
                    else if (setObject[i].object == 'Rspike') {
                        reverseSetSpike(setObject[i].x , setObject[i].y);
                    }
                    
                    else if (setObject[i].object == 'spikeM') {
                        setSpikeM(setObject[i].x , setObject[i].y);
                    }
                    
                    else if (setObject[i].object == 'RspikeM') {
                        reverseSetSpikeM(setObject[i].x , setObject[i].y);
                    }
                }

            // отрисовка абсолютного пола, потолка и стенки - границы карты
            ctx.beginPath();
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, width, 1/8*display_part*scale);    // пол
                ctx.fillRect(0 + coords.x,2*scale,scale, 14*scale); // стенка
                ctx.fillRect(0, 13*scale, width, scale);
            ctx.fill();
        }

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------- РЕАКЦИЯ НА ПЕРЕДВИЖЕНИЕ ---------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        main_frame.onmousedown = function(e) {  // функция запускается по нажатию ЛКМ
            var m = mouse_coords(e);    // получаем координаты курсора
            
            coords.x_shift = m.x - coords.x_shift;  // начальное смещение - необходимо для адекватного перетаскивания канваса курсором
            main_frame.onmousemove = mapMove;   // при движении запускается функция передвижения
        }

        main_frame.onmouseup = function(e) {    // функция запускается при отпускании ЛКМ
            var m = mouse_coords(e);    // получаем координаты курсора
            
            coords.x_shift = m.x - coords.x_shift;  // перерасчитываем смещение
            main_frame.onmousemove = null;      // блочим функцию перемещения
        }

        function mapMove(e) {   // функция движения курсора
            var m = mouse_coords(e);    // получаем координаты курсора

            coords.x = m.x - coords.x_shift;    // рассчет поправки координат объектов с учетом смещения
            drawMap();  // отрисовка всего необходимого
        }

        function mouse_coords(e) {  // функция, которая вытаскивает координаты мыши
            var m = {}; // создание массива для координат
            var rect = main_frame.getBoundingClientRect();  // позиционирование относительно страницы (вроде)
            
            m.x = e.clientX - rect.left;        // расчет координаты с поправкой на отступ
            m.y = e.clientY - rect.top + height;    // расчет координаты с поправкой на отступ и смещением, т.к. СК сдвинута

            return m;
        }	

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------- ВСПОМОГАТЕЛЬНАЯ ЧАСТЬ КАРТЫ ----------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        function drawMap() {
            ctx.clearRect(0,0,width,height);    // первичная очистка       

            // отрисовка сетки
            // такое ограничение сверху стоит для динамического добавления линий сетки (пограничное значение, чтобы отрисовка обгоняла анимацию)
            for (var i = 0; i < display_part + Math.abs(coords.x/32); i++) {    // вертикальные линии
                ctx.beginPath();
                    ctx.lineTo(i*scale + coords.x , 0);
                    ctx.lineTo(i*scale + coords.x , height);
                ctx.stroke();
            }

            for (var j = 0; j < display_part*9/16; j++) {   // горизонтальные линии
                ctx.beginPath();
                    ctx.lineTo(0 , j*scale);
                    ctx.lineTo(width, j*scale);
                ctx.stroke();
            }

            // отрисовка абсолютного пола, потолка и стенки - границы карты

            ctx.beginPath();
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, width, 1/8*display_part*scale);    // пол
                ctx.fillRect(0 + coords.x, 1/8*display_part*scale, scale, 14*scale); // стенка
                ctx.fillRect(0, 13*scale, width, scale);    // потолок
            ctx.fill();
        }

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------- АНИМИРОВАНИЕ КУБИКА --------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        function drawPlayer () {

        // очистка производится при отрисовке карты - тут чистить ничего не надо
            
            ctx.beginPath();
                ctx.fillStyle="#0000ff";
                ctx.fillRect(player.x*scale, (player.y + 1/8*display_part)*scale, player.r, player.r);
            ctx.fill();

        }

        var animationPlayer = function() {  // анонимно задается для удобства вызова requestAnimationFrame

            // пока кубик не доедет до середины карты - двигается он сам ,  как доедет - двигается фон
            
            if (player.x*scale < display_part/2*scale)  player.x += player.vx;
            else if (player.x*scale >= display_part/2*scale)    coords.x -= 4;

            drawMap();
            drawPlayer();

            // преимущество requestAnimationFrame над setInterval в том, что такой вызов синхронизируется со всеми остальными отрисовками
            // таким образом снижается нагрузка на процессор, однако может проседать частота кадров
            // в таком случае придется дополнить код альтернативным вызовом 

            requestAnimationFrame(animationPlayer);
        }

        function keyDownScript(e) { // функция по нажатию клавиши

            // основное игровое действие - прыжок - будем осуществлять на пробел
            // пауза пока не предусматривается

            if (e.keyCode == 32) {
        //        y = 
            }
        }

        addEventListener ("keydown", keyDownScript);    // ожидаем события нажатия клавиши
        drawMap();
        animationPlayer();

}



