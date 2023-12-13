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
          modal = document.querySelector('.modal'),
          modalCloseBtn = document.querySelector('[data-close]');
    
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

    modalCloseBtn.addEventListener('click', (e) => {
        modalClose();
    });

    modal.addEventListener('click', (e) => { // закрытие окна если кликнуть вне окна (кликнуть на подложку)
        if (e.target === modal) { // modal родительский блок в котором есть модальное окно, соответственно если цель является сам блок а не окно, то мы возвращаемся на страницу
            modalClose();
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

    new MenuCard( // создаем карточки используя JS. После создания удаляем карточки из HTML -> теперь все карточки (включая вновь созданные) будут созданы из одного класса (шаблона)
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
    ).render(); 

});