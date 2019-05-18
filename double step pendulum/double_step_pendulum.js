
window.addEventListener("load", program_code, false);

function program_code() 

{
    var ctx       = pendulum.getContext("2d"); // на контексте происходит рисование
    var ctx_graph = XY_monitoring.getContext("2d");
        
    var width  = pendulum.width;
    var height = pendulum.height;

    var width_graph  = XY_monitoring.width;
    var height_graph = XY_monitoring.height;

    // перенесем систему координат в новую точку
    ctx.translate(width/2 , height/10);
    ctx_graph.translate(10 , height_graph/2);
    ctx_graph.scale(1 , -1);  // для построения графика удобнее использовать привысную ориентацию осей координат
    
    // задаем константу g
    const g = 9.80665;

    //------------------ НАЧАЛЬНЫЕ ПАРАМЕТРЫ ПАНЕЛИ УПРАВЛЕНИЯ -----------------------------------------------------------------------

    number_input_length.value  = 200;    // начальное положение ползунка длины
    number_input_m1.value      = 10;         // начальное положение ползунка массы верхнего груза
    number_input_m2.value      = 10;         // начальное положение ползунка массы нижнего груза
    number_input_start_1.value = 0;     // начальное положение ползунка первой обобщенной координаты
    number_input_start_2.value = 0.2;   // начальное положение ползунка второй обобщенной координаты

    // -------------- ПЕРЕМЕННЫЕ ДЛЯ РАСЧЕТА ------------------------------------------------------------------------------------

    var fps       = 60;                       // количество кадров отрисовки в секунду
    var t         = 0;                        // счетчик времени
    var time_step = 0.1;                      // шаг перерасчета положений
    var Q1        = 0 , Q2     = 0;           // обобщенные координаты (в данном случае - углы отклонения от вертикали) 
    var Q1_at_0   = 0, Q2_at_0 = Math.PI/6;   // начальное положение
    var l         = 200;                      // длина маятников
    var m1        = 10  , m2   = 10;          // массы грузиков на концах маятника
    
    var pendulum_parts = {   // координаты грузиков в декартовой СК 

        pendulum_1 : { x1 : l * Math.sin(Q1_at_0) , 
                       y1 : l * Math.cos(Q1_at_0) },

        pendulum_2 : { x2 : l * ( Math.sin(Q1_at_0) + Math.sin(Q2_at_0) ) ,
                       y2 : l * ( Math.cos(Q1_at_0) + Math.cos(Q2_at_0) ) }
    };

    // -----------------------  ПРОЧИЕ ПАРАМЕТРЫ ДЛЯ УПРАВЛЕНИЯ МОДЕЛИРОВАНИЕМ ------------------------------------------------------------------

    var timer_static, timer_dynamic;    // таймеры для запусков и отмены функций

    var coords_Q1 = [Q1_at_0];  // массивы координат для отрисовки графиков
    var coords_Q2 = [Q2_at_0];  

    //----------------------------------------------------------------------------------------------------------------------------\\
    /// ----------------------------------------------- РАСЧЕТ ПОЛОЖЕНИЯ ГРУЗОВ ------------------------------------------------ \\\
    //----------------------------------------------------------------------------------------------------------------------------\\

    function mechanics() {  

        var C1 = 0, C2 = 0 , w1 = 0, w2 = 0, M = m2/m1;                         // задаем необходимые для расчета дополнительные параметры

        w1 = Math.sqrt( g/l )*Math.sqrt(1 + M + Math.sqrt( (1+M)*M ));    // циклическая частота первого маятника 
        w2 = Math.sqrt( g/l )*Math.sqrt(1 + M - Math.sqrt( (1+M)*M ));    // циклическая частота второго маятника
        
        C1 = 0.5*Q1_at_0 - Math.sqrt( M/(1 + M) )*Q2_at_0;              
        C2 = 0.5*Q1_at_0 + Math.sqrt( M/(1 + M) )*Q2_at_0;

        Q1 = C1*Math.cos( w1*t ) + C2*Math.cos( w2*t );                                     // обобщенная координата первого маятника
        Q2 = Math.sqrt( (1 + M)/M )*(-C1*Math.cos( w1*t ) + C2*Math.cos( w2*t ) );       // обобщенная координата второго маятника

        //пересчитываем координаты

        pendulum_parts.pendulum_1.x1 = l*Math.sin(Q1);
        pendulum_parts.pendulum_1.y1 = l*Math.cos(Q1);
        
        pendulum_parts.pendulum_2.x2 = l*( Math.sin(Q1) + Math.sin(Q2) );
        pendulum_parts.pendulum_2.y2 = l*( Math.cos(Q1) + Math.cos(Q2) );   
    }

    //--------------------------------------------------------------------------------------------------------------------------------------------\\
    /// ---------------------------------------------------------------- ОТРИСОВКА -------------------------------------------------------------- \\\
    //--------------------------------------------------------------------------------------------------------------------------------------------\\

    function draw() {   // перерисовка маятника

		ctx.clearRect(-width/2, -height/10, width, height); // очистка окна   
        
        // рисуем опору

        ctx.beginPath();            
            ctx.fillStyle="#000000";    // черный цвет
            ctx.fillRect(-50,-5,100,5);
            ctx.arc(pendulum_parts.pendulum_1.x1, pendulum_parts.pendulum_1.y1,10,0,Math.PI*2);
            ctx.arc(pendulum_parts.pendulum_2.x2, pendulum_parts.pendulum_2.y2,10,0,Math.PI*2);
        ctx.fill();

        // рисуем первую линию

        ctx.beginPath(); 
            ctx.strokeStyle="#ff0000";      // красный цвет
            ctx.moveTo(0,0);
            ctx.lineTo(pendulum_parts.pendulum_1.x1, pendulum_parts.pendulum_1.y1);
        ctx.stroke();
        
        // рисуем вторую линию

        ctx.beginPath();
            ctx.strokeStyle="#0000ff";      // синий цвет
            ctx.moveTo(pendulum_parts.pendulum_1.x1, pendulum_parts.pendulum_1.y1);
            ctx.lineTo(pendulum_parts.pendulum_2.x2, pendulum_parts.pendulum_2.y2);
        ctx.stroke();
    }

    //----------------------------------------------------------------------------------------------------------------------------------

    function draw_graph() { // здесь будем график чертить

        // рисуем оси координат
        ctx_graph.beginPath();
            ctx_graph.strokeStyle="#000000";
            ctx_graph.moveTo(-10,0);
            ctx_graph.lineTo(width_graph,0);
        ctx_graph.stroke();

        ctx_graph.beginPath();
            ctx_graph.strokeStyle="#000000";
            ctx_graph.moveTo(0,-height_graph/2);
            ctx_graph.lineTo(0,height_graph/2);
        ctx_graph.stroke();

        // рисование графика будет происходить по следующему принципу :
        // массив координат содержит два значения - координату на предыдущем и на текущем шаге
        // поскольку шаг достаточно мал - для рисования графика будем использовать прямые, соединяющие предыдущую координату с актуальной

        // график верхнего маятника
        ctx_graph.beginPath();
            ctx_graph.strokeStyle="#ff0000";
            ctx_graph.lineTo(10*(t - time_step),50*coords_Q1[0]);
            ctx_graph.lineTo(10*t,50*coords_Q1[1]);
        ctx_graph.stroke();
        
        // график нижнего маятника
        ctx_graph.beginPath();
            ctx_graph.strokeStyle="#0000ff";
            ctx_graph.lineTo(10*(t - time_step),50*coords_Q2[0]);
            ctx_graph.lineTo(10*t,50*coords_Q2[1]);
        ctx_graph.stroke();
    }

// ----------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------- ПУЛЬТ УПРАВЛЕНИЯ ------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------

    function app_control_panel() {

        // при передвижении ползунка или изменении значения ячейки рядом с ним происходит следующее :
        // А - значения на ползунке и в окне выравниваются
        // Б - изменяется соответствующий параметр модели
        // дальнейшие функции обрабатывают каждый ползунок
        // из-за некорректной работы изменение значений в ползунках заблокировано
 
        slider_input_length.oninput = function() {
            number_input_length.value = slider_input_length.value;
            l = slider_input_length.value;
        };

        slider_input_m1.oninput = function() {
            number_input_m1.value = slider_input_m1.value;
            m1 = slider_input_m1.value;
        };

        slider_input_m2.oninput = function() {
            number_input_m2.value = slider_input_m2.value;
            m2 = slider_input_m2.value;
        };

        slider_input_start_1.oninput = function() {
            number_input_start_1.value = slider_input_start_1.value;
            Q1_at_0 = Math.PI*slider_input_start_1.value;
        };

        slider_input_start_2.oninput = function() {
            number_input_start_2.value = slider_input_start_2.value;
            Q2_at_0 = 0.5*Math.PI*slider_input_start_2.value;
        };

        // в firefox при перезагрузке страницы ползунки не сбрасываются, поэтому это надо сделать вручную
        // событие onbeforeunload - это событие, страбатывающее перед закрытием страницы, однако работает и при перезагрузке

        window.onbeforeunload = function() {
            slider_input_length.value = 200;
            slider_input_m1.value = 10;
            slider_input_m2.value = 10;
            slider_input_start_1.value = 0;
            slider_input_start_2.value = 0.2;
        }
    }

    //--------------------------------------------------------------------------------------------------------------
    // ------------------ ДОПОЛНИТЕЛЬНЫЙ РАЗДЕЛ УПРАВЛЕНИЯ ---------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------

    function setup() {  // из этой функции происходит вызов всех остальных функций, необходимых для отрисовки кадров

        t = t + time_step;  // таймер для перерасчета положения системы

        // после вызова функции расчета добавим в конец массивов значения координат
        // это делается вне функции расчета для корректности работы модели при нажатии кнопок управения
        // пояснение - позже

        mechanics();
        coords_Q1.push(Q1);
        coords_Q2.push(Q2);

        draw();
        
        // после отрисовки текущего и предыдущего положения можно удалить предыдущие координаты
        // таким образом, в массивах координат всегда будет по два необходимых для рисования значения
        
        draw_graph();
        coords_Q1.shift();
        coords_Q2.shift();        

      //  app_control_panel();
    }

    function first_frame_draw() {

        // поскольку запуск setup влечет за собой изменения таймера, изначально будет вызвана эта функция
        // благодаря этому можно будет посмотреть на состояние системы до запуска моделирования
        ctx_graph.clearRect(0,height_graph/2,width_graph,height_graph);

        mechanics();
        draw();
        draw_graph();

        app_control_panel();
    }

    // запуск вышеописанной функции 60 раз в секунду, чтобы видеть изменения в реальном времени
    timer_static = setInterval(first_frame_draw,1000/fps);

    // теперь разберем отдельно нажатия на кнопки запуска и остановки моделирования 

    var key = 0;                        // сферический ключ в вакууме 

    start_button.onclick = function() { // функция по нажатию на кнопку запуска

        // если на нее кликать несколько раз, то все ее тело так же будет исполнено повторно, что приведет к очень веселым последствиям
        // для невозможности повторного вызова я ввожу этот ключ :
        // если он ненулевой, то повторного вызова не произойдет
        if (key == 0) {

            // заблокируем изменение параметров системы, пока она в движении или на паузе
            document.getElementById("slider_input_length").setAttribute("disabled","disabled");
            document.getElementById("slider_input_m1").setAttribute("disabled","disabled");
            document.getElementById("slider_input_m2").setAttribute("disabled","disabled");
            document.getElementById("slider_input_start_1").setAttribute("disabled","disabled");
            document.getElementById("slider_input_start_2").setAttribute("disabled","disabled");
            
            clearInterval(timer_static); // сброс функции, которая отрисовывает начальное положение
            timer_dynamic = setInterval(setup,1000/fps); // запуск функции, управляющей всеми частями программы, 60 раз в секунду
            key++; 
        }
    }

    stop_button.onclick = function() {  // функция по нажатию кнопки остановки

        // работает ровно наоборот - запускается только при ненулевом значении ключа и возвращает его к нулю
        if (key > 0) {
            clearInterval(timer_dynamic);   // сброс функции, запускающей setup
           key = 0;
        }
    }

    reset_button.onclick = function() { // функция по нажатию кнопки сброса

        // необходимо вернуть все параметры системы к начальным
        // разблокируем управление параметрами
        document.getElementById("slider_input_length").removeAttribute("disabled");
        document.getElementById("slider_input_m1").removeAttribute("disabled");
        document.getElementById("slider_input_m2").removeAttribute("disabled");
        document.getElementById("slider_input_start_1").removeAttribute("disabled");
        document.getElementById("slider_input_start_2").removeAttribute("disabled");

        // случай, если сброс нажат из паузы
        if (key == 0)   timer_static = setInterval(first_frame_draw,1000/fps);

        // случай, если сброс нажат в движении
        else if (key > 0) {
            clearInterval(timer_dynamic);
            timer_static = setInterval(first_frame_draw,1000/fps);
            key = 0;
        }

        // очистка окна графика и сброс параметров модели
        t = 0;
        ctx_graph.clearRect(0,-height_graph/2,width_graph,height_graph);
        coords_Q1=[Q1_at_0];
        coords_Q2=[Q2_at_0];
    }
}