window.addEventListener('DOMContentLoaded', () => {

    //Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.style.display = 'none';
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    hideTabContent();
    showTabContent();

    //Timer

    const deadline = '2024-01-01'; // создаем дедлайн

    function getTimeRemaining(endtime) {  // создаем функцию которая будет определять разницу между настоящим временем и дедлайном(endtime)
        const t = Date.parse(endtime) - Date.parse(new Date());
        let days, hours, minutes, seconds;
        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            minutes = Math.floor((t / (1000 * 60)) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }
        return {
            'total': t,
            days,
            hours,
            minutes,
            seconds
        };
    }

    function getZero(num) { // функция для добавления нуля перед однозначными числами в таймере
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) { // создаем функцию которая устанавливает часы на страницу прердаем в нее endtime and selector(который будем брать из HTML)
        const timer = document.querySelector(selector) //получаем элемент со страницы по сеектору
        const days = timer.querySelector('#days'), // получаем элементы по уникальному идентификатору
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds');
        updateClock(); // запускаем эту функцию здесь чтобы не было бага с секундным появлением изначального таймера при перезагрузке страницы
        const timerInterval = setInterval(updateClock, 1000) // создаем переменную в которую помещаем setInterval в аргумены которого кладем саму функцию, которая будет обновляться, и период повторения
            
        function updateClock() { // внутри создаем функцию, которая обновляет часы
            const t = getTimeRemaining(endtime); //в переменную t помещаем объект, получаемый из первой функции
            days.innerHTML = getZero(t.days); // размещаем полученный результат на странице сиспользованием функции getZero
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);
            if (t.total <= 0) { // условие остановки setInterval
                clearInterval(timerInterval);
            }  
        }
    }
    setClock('.timer', deadline); // запуск функции установки часов

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');
    // const modalCloseBtn = document.querySelector('[data-close]'); //удаляем элемент для реализации закрытия модальных окон для динамически созданных элементов
    
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => {
           // modal.classList.add('show'); // добавляем класс показа блока
            //document.body.style.overflow = 'hidden'; // отключаем возможность прокрутки страницы во время открытого модалього окна
            openModal(); // используем созданную функцию
        });
    });

    function modalClose() { // функция удаления класса и включеия прокрутки страницы
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    /*modalCloseBtn.addEventListener('click', (e) => { //удаляем элемент для реализации закрытия модальных окон для динамически созданных элементов
        modalClose();
    });*/

    modal.addEventListener('click', (e) => { // закрытие окна если кликнуть вне окна (кликнуть на подложку)
        if (e.target === modal || e.target.getAttribute('data-close') == '') { // modal родительский блок в котором есть модальное окно, соответственно если цель является сам блок а не окно, то мы возвращаемся на страницу
            modalClose(); // e.target.getAttribute('data-close') добавляем для закрытия динамически созданных элементов
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) { // есл нажать Esc и будет открыто модальное окно, то мы выйдем из окна и вернемся на страницу
            modalClose();
        }
    });

    const modalTimerId = setTimeout(openModal, 15000); //Появление модального окна через 15 секунд
    function openModal() {
        modal.classList.add('show'); 
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId); // исключение повторного открытия
    }

    function showModalByScroll() {
        if(window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) { // вместо scrollYу можно использовать pageYOffset для поддержки старых версий браузеров
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);
    
    
    // CLASS

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) { //используем Rest для добавления классов элементам
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.transfer = 27; // можно взять из стороннего сервера с курсами на сегодняшний день
            this.parent = document.querySelector(parentSelector);
            this.changeToUAH();// вызов метода конвертации
        }
        changeToUAH() {
            this.price = this.price * this.transfer;
        }
        render() {
            const element = document.createElement('div'); // создаем элемент и далее копируем в него верстку из HTML. Заменяем нужное аргументами
            if(this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element); // если класс не указан, то будет значение по default
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div> 
            `;
            this.parent.append(element); // размещение на странице
        }
    }

    // Использование AXIOS библиотеки для GET запроса

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
               new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    // Использование FETCH && ASYNC AWAIT for GET запроса    

    /*const getResource = async (url) => {  // создаем функцию для создания карточек. GET запрос с db.json для формирования внутренностей. Карточка создается на соновании класса MenuCard
        const menu = await fetch(url); // используем fetch
        if(!menu.ok) { // создаем ошибку в случае статуса 400 ... , 500 .... и т.п.
            throw new Error (`Could not fetch ${url}, status: ${menu.status}`)
        }
        return await menu.json();
    }

    getResource('http://localhost:3000/menu') // вызывем функцию и обрабатываем результат
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => { // деструктуризируем объект полуенный из db.json для передачи в качестве аргуметов
               new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });


    // => Использование функции для формирования карточек без использования классов

    /*getResource('http://localhost:3000/menu') 
        .then(data => createCard(data));
    
    function createCard(data) {
        data.forEach(({img, altimg, title, descr, price}) => {
            const element = document.createElement('div');
            element.classList.add('menu__item');
            element.innerHTML = `
                <img src=${img} alt=${altimg}>
                <h3 class="menu__item-subtitle">${title}</h3>
                <div class="menu__item-descr">${descr}</div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${price}</span> $/день</div>
                </div> 
            `;
            document.querySelector('.menu .container').append(element); 
        });
    }
    
    // Обычное создание карточек 

    /*new MenuCard( // создаем карточки используя JS. После создания удаляем карточки из HTML -> теперь все карточки (включая вновь созданные) будут созданы из одного класса (шаблона)
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container'
    ).render();

    new MenuCard( // создаем карточки используя JS. После создания удаляем карточки из HTML -> теперь все карточки (включая вновь созданные) будут созданы из одного класса (шаблона)
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        20,
        '.menu .container',
        'menu__item'
    ).render(); 

    new MenuCard( // создаем карточки используя JS. После создания удаляем карточки из HTML -> теперь все карточки (включая вновь созданные) будут созданы из одного класса (шаблона)
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        14,
        '.menu .container',
        'menu__item'
    ).render(); */

    //FORMS

    const forms = document.querySelectorAll('form'),
          message = {
            loading: "img/forms/spinner.svg",
            success: 'Спасибо! Скоро мы свяжемся с Вами',
            failure: 'Что-то не так'
          };
    forms.forEach(item => bindPostData(item));


    //Функция при использовании XMLHttpRequest

    /*function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img'); // добавление нового блока
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `
            form.insertAdjacentElement('afterend', statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');
           // request.setRequestHeader('Content-type', 'application/json'); // при использовании формата JSON
           const fromData = new FormData(form);
           //const object = {}; // для формата JSON
           //fromData.forEach(function(value, key) {
           // object[key] = value;
           //});
           //const json = JSON.stringify(object);
           request.send(fromData); // если формат JSON, то fromData меняем на json
           request.addEventListener('load', () => {
            if(request.status === 200) {
                console.log(request.response);
                showThanksModal(message.success);
                form.reset();
                statusMessage.remove();
            } else {
                showThanksModal(message.failure);
            }
           });
        });
    }*/

    //Функция при использовании Fetch API

    const postData = async (url, data) => { // создаем фунцию для POST запроса отправки формы
        const res = await fetch(url, {
           method: 'POST',
           headers: {
            'Content-type': 'application/json'
           },
           body: data 
        });

       if(!res.ok) { // создаем ошибку в случае статуса 400 ... , 500 .... и т.п.
            throw new Error (`Could not fetch ${url}, status: ${res.status}`)
        }
        
        return await res.json(); // возвращаем результат через метод json()
    }
    
    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img'); // добавление нового блока
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries())); // преобразуем formData в json формат

           postData('http://localhost:3000/requests', json) // вызываем функцию и обрабатываем результат
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                statusMessage.remove();
                form.reset();
            })
        })
    }
   

    function showThanksModal(message) { // создаем функцию показа благодарнсти для пользователя
        const prevModalDisplay = document.querySelector('.modal__dialog'); // получаем элемент модального окна с контентом для его использования, чтобы не создавать новую верстку
        prevModalDisplay.classList.add('hide'); // скрываем элемент с контентом чтобы на его месте создать новую обертку
        openModal();
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>    
            </div>
        `;
        modal.append(thanksModal); // добавляем на страницу новый элемент в блок modal
        setTimeout(() => {  // добавляем функционал автоматического закрытия окна благодарности с воозвращением обычной формы
            thanksModal.remove();
            prevModalDisplay.classList.add('show');
            prevModalDisplay.classList.remove('hide');
            modalClose();
        }, 3000);
    }

    // Slider

    const sliders = document.querySelectorAll('.offer__slide'),
          arrowLeft = document.querySelector('.offer__slider-prev'),
          arrowRight = document.querySelector('.offer__slider-next'),
          arrows = document.querySelector('.offer__slider-counter'),
          current = document.querySelector('#current'),
          total = document.querySelector('#total'),
          slidersWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidersWrapper).width;
          //block = 
    
    // Slider вариант 1. Простой
    /*let index = 1; // создаем индекс для переключения слайдов

    if(sliders.length < 10) { // условия добавления 0 в тотал
        total.textContent = `0${sliders.length}`;
    } else {
        total.textContent = sliders.length;
    }

    function showSlides (n) { // создаем функцию показа слайда и скрытия других слайдов с изменением счетчика слайдов
        if(n > sliders.length) {
            index = 1;
        }
        if(n < 1) {
            index = sliders.length;
        }

        sliders.forEach(item => item.classList.add('hide'));

        sliders[index - 1].classList.remove('hide');
        sliders[index - 1].classList.add('show');


        if(sliders.length < 10) {
            current.textContent = `0${index}`;
        } else {
            current.textContent = index;
        }

    }

    showSlides(index); // вызываем функцию

    function plusSlides(n) { // функция перелистывания слайда
        showSlides(index += n); // n придет из обработчиков события
    }

    arrows.addEventListener('click', (e) => {
        if(e.target == arrowRight) {
            plusSlides(1);
        } else if (e. target == arrowLeft) {
            plusSlides(-1);
        }
    }); */

    //Slider вариант 2

    // - назначение inline styles
    slidesField.style.width = 100 * sliders.length + '%'; // ширина = количеству слайдов * 100 %
    slidesField.style.display = 'flex'; // в одну линию используем flex
    slidesField.style.transition = '0.5s all'; // изменение с задержкой в пол секунды
    slidersWrapper.style.overflow = 'hidden'; // все что не попадает в диапазон wrapper будет скрыто, т.е. оставляем один слайд в окне, остальные не видны
    sliders.forEach(slide => slide.style.width = width); // ширина каждого стайда = ширине wrapper окна

    let slideIndex = 1, // индекс для пролистывания
        offset = 0; // индекс отсупа влево

    if(sliders.length < 10) { // условия добавления 0 в тотал
        total.textContent = `0${sliders.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = sliders.length;
        current.textContent = slideIndex;
    }
    
    arrows.addEventListener('click', (e) => { 
        if(e.target == arrowRight) { // движение вправо
            if(offset == +width.slice(0, width.length - 2) * (sliders.length - 1)) {  // если offset = ширине * конечный индекс в массиве
                offset = 0;
            } else {
                offset += +width.slice(0, width.length - 2); // увеличиваем на шинрину слайда
            }
            slidesField.style.transform = `translateX(-${offset}px)`; // двигаем слайд

            if(slideIndex == sliders.length) { // условия для счетчика слайдера
                slideIndex = 1;
            } else {
                slideIndex++;
            }

            if(sliders.length < 10) {
                current.textContent = `0${slideIndex}`; // условие для показа счетчика
            } else {
                current.textContent = slideIndex;
            }
        }
        if(e. target == arrowLeft) { // движение влево, тоже самое но наоборот
            if(offset == 0) {
                offset = +width.slice(0, width.length - 2) * (sliders.length - 1);
            } else {
                offset -= +width.slice(0, width.length - 2);
            }
            slidesField.style.transform = `translateX(-${offset}px)`;

            if(slideIndex == 1) {
                slideIndex = sliders.length;
            } else {
                slideIndex--;
            }

            if(sliders.length < 10) {
                current.textContent = `0${slideIndex}`;
            } else {
                current.textContent = slideIndex;
            }
        }

    });

});