window.addEventListener('load', () => {
    const overlay        = document.getElementById('overlay');
    const catContainer   = document.getElementById('cat-container');
    const catSpeech      = document.getElementById('cat-speech');
    const hintBtn        = document.getElementById('hint-btn');
    const nextBtn        = document.getElementById('next-btn');
    const choiceBox      = document.getElementById('choice-box');
    const sceneContainer = document.getElementById('scene-container');
  
    const passwordModal  = document.getElementById('password-modal');
    const modalText      = document.getElementById('modal-text');
    const modalInput     = document.getElementById('modal-input');
    const modalOk        = document.getElementById('modal-ok');
    const modalCancel    = document.getElementById('modal-cancel');
  
    // состояния
    let cablePicked            = false;
    let wifiPicked             = false;
    let pcCableConnected       = false;
    let pcWifiConnected        = false;
    let cableToRouterConnected = false;
    let wifiRouterViewed       = false; // ИСПРАВЛЕНИЕ: опечатка
    let wifiConnectedCorrect   = false;
    let wifiConnectedWrong     = false;
  
    // данные сети (игрок сам разбирается, котёнок не даёт пароль)
    const wifiPassword = "xYz1234abcd";
    const correctSSID  = "Home_Network";
    const fakeSSID     = "Home_Netw0rk";
  
    // вступление
    let dialogueIndex = 0;
    const dialogues = [
      "Привет! Помоги пожалуйста подключить интернет.",
      "Сам не справлюсь, у меня же лапки.",
      "Я видел как Вася положил что-то для компьютера в ящик.",
      "Думаю тебе это поможет."
    ];
  
    // фон
    function setSceneBackground(path) {
      sceneContainer.style.backgroundImage = `url('${path}')`;
    }
  
    // меню действий
    function setChoices(choices) {
      choiceBox.innerHTML = ""; // Очищаем предыдущие кнопки
      choices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn'; // Сохраняем класс choice-btn для стилизации
        btn.textContent = c.text;
        btn.onclick = () => {
          choiceBox.classList.remove('show'); // Скрываем поле выбора после клика
          c.action();
        };
        choiceBox.appendChild(btn);
      });
      choiceBox.classList.remove('hidden'); // Убираем hidden
      requestAnimationFrame(() => choiceBox.classList.add('show')); // Показываем с анимацией
    }
  
    // сброс игры
    function resetGame() {
        // сбрасываем все флаги
        cablePicked             = false;
        wifiPicked              = false;
        pcCableConnected        = false;
        pcWifiConnected         = false;
        cableToRouterConnected  = false;
        wifiRouterViewed        = false; 
        wifiConnectedCorrect    = false;
        wifiConnectedWrong      = false;
        dialogueIndex           = 0; // Сбрасываем индекс диалога

        // прячем оверлей (финалок и интро)
        overlay.style.opacity = '0';

        // сбрасываем текст котёнка на первый диалог
        catSpeech.textContent = dialogues[0];

        // показываем кнопку «Далее»
        nextBtn.style.display = 'block';
        
        // ПРЯЧЕМ МЕНЮ ВЫБОРА (ИСПРАВЛЕНИЕ БАГА)
        choiceBox.classList.remove('show');
        choiceBox.classList.add('hidden'); 

        // прячем модалку пароля
        passwordModal.classList.remove('show');

        // возвращаем начальный фон
        setSceneBackground("assets/img/game_bg_start.png");

        // показываем котёнка
        catContainer.classList.add('show');
    }
  
    // главная сцена
    function showMainScene() {
      setSceneBackground("assets/img/game_bg_start.png");
      catContainer.classList.add('show');
      // Теперь showMainScene() будет вызываться только после диалогов или напрямую,
      // и она должна устанавливать выбор, а не полагаться на "Далее" для первого выбора.
      setChoices([
        { text: "Ящик стола", action: openDrawer },
        { text: "Системный блок", action: openPC },
        { text: "Монитор", action: openMonitor },
        { text: "Роутер", action: openRouter }
      ]);
    }
  
    // ящик
    function openDrawer() {
      if (!cablePicked && !wifiPicked) {
        setSceneBackground("assets/img/desk.png");
      }
      else if (!cablePicked && wifiPicked) {
        setSceneBackground("assets/img/eth_desk.png");
      }
      else if (cablePicked && !wifiPicked){
        setSceneBackground("assets/img/wifi_desk.png");
      }
      else {
        setSceneBackground("assets/img/clear_desk.png")
      }

      catContainer.classList.remove("show");
      // choiceBox.classList.remove("show"); // Удалено, так как setChoices уже это делает

      const actions = [{text: "Назад", action: showMainScene}];
      if (!cablePicked) actions.push({text: "Кабель", action: pickCable});
      if (!wifiPicked) actions.push({text: "WiFi-модуль", action: pickWifi});

      setTimeout(() => setChoices(actions), 200);

    }
    function pickCable() {
      cablePicked = true;
      catSpeech.textContent = "Вы подобрали кабель.";
      openDrawer();
    }
    function pickWifi() {
      wifiPicked = true;
      catSpeech.textContent = "Вы подобрали Wi-Fi модуль.";
      openDrawer();
    }
  
    // системник
    function openPC() {
      if (pcCableConnected) setSceneBackground("assets/img/pc_eth.png");
      else if (pcWifiConnected) setSceneBackground("assets/img/pc_wifi_module.png");
      else setSceneBackground("assets/img/pc.png");
  
      catContainer.classList.remove('show');
      const actions = [{ text: "Назад", action: showMainScene }];
      if (cablePicked && !pcCableConnected && !pcWifiConnected)
        actions.push({ text: "Подключить кабель", action: connectCable });
      if (wifiPicked && !pcWifiConnected && !pcCableConnected)
        actions.push({ text: "Подключить Wi-Fi модуль", action: connectWifi });
      setChoices(actions);
    }
    function connectCable() {
      pcCableConnected = true;
      setSceneBackground("assets/img/pc_eth.png");
      catSpeech.textContent = "Кабель подключён к системному блоку.";
      setTimeout(openPC,300);
    }
    function connectWifi() {
      pcWifiConnected = true;
      setSceneBackground("assets/img/pc_wifi_module.png");
      catSpeech.textContent = "Wi-Fi модуль подключён к системному блоку.";
      setTimeout(openPC,300);
    }
  
    // роутер
    function openRouter() {
      setSceneBackground(cableToRouterConnected ? "assets/img/router_connected.png" : "assets/img/router.png");
      catContainer.classList.remove('show');
      const actions = [{ text: "Назад", action: showMainScene }];
      if (pcCableConnected && !cableToRouterConnected)
        actions.push({ text: "Подключить кабель к роутеру", action: connectCableToRouter });
      if (pcWifiConnected && !wifiRouterViewed)
        actions.push({ text: "Посмотреть под роутер", action: viewRouterInfo });
      setChoices(actions);
    }
    function connectCableToRouter() {
      cableToRouterConnected = true;
      setSceneBackground("assets/img/router_connected.png"); 
      catSpeech.textContent = "Кабель подключён к роутеру.";
      setTimeout(()=>{
        setChoices([
          { text: "Проверить монитор", action: openMonitor },
          { text: "Назад", action: showMainScene }
        ]);
      },300);
    }
    function viewRouterInfo() {
      wifiRouterViewed = true;
      setSceneBackground("assets/img/router_info.png");
      catSpeech.textContent = "Жаль я не знаю английский...";
      setChoices([{ text: "Назад", action: openRouter }]);
    }
  
    // монитор
    function openMonitor() {
      // кабель
      if (pcCableConnected && cableToRouterConnected) {
        setSceneBackground("assets/img/monitor_complete.png");
        endGame(true,"Ура! Спасибо что подключил мне интернет!!! Я кстати слышал, что проводная связь стабильнее и безопаснее.");
        return;
      }
      // Wi-Fi успех
      if (wifiConnectedCorrect) {
        setSceneBackground("assets/img/monitor_complete.png");
        endGame(true,"Отлично! Я заметил там сеть злоумышленника с похожим названием. Не представляю что могло бы быть если бы мы подключились к ней.");
        return;
      }
      // Wi-Fi провал
      if (wifiConnectedWrong) {
        setSceneBackground("assets/img/monitor_hack.png");
        endGame(false,"О нет! Компьютер взломали через поддельную WiFi сеть. В будущем надо быть внимательнее и выбирать проверенные WiFi сети.");
        return;
      }
      // если модуль есть — меню сетей
      if (pcWifiConnected && !wifiConnectedCorrect && !wifiConnectedWrong) {
        setSceneBackground("assets/img/monitor_start.png");
        catSpeech.textContent = "Выберите сеть:";
        setChoices([
          { text: `${correctSSID} (пароль)`, action: ()=>showPasswordPrompt(correctSSID) },
          { text: `${fakeSSID} (без пароля)`, action: chooseWrongWifi },
          { text: "Назад", action: showMainScene }
        ]);
        return;
      }
      // иначе нет интернета
      setSceneBackground("assets/img/monitor_start.png");
      catSpeech.textContent = "Нет подключения к интернету.";
      setChoices([{ text: "Назад", action: showMainScene }]);
    }
  
function showPasswordPrompt(ssid) {
  modalText.textContent = `Введите пароль для сети ${ssid}:`;
  modalInput.value = "";
  document.getElementById('modal-error').classList.add('hidden');
  document.getElementById('modal-error').textContent = "";
  passwordModal.classList.add('show');
  modalInput.focus();
}

modalOk.onclick = () => {
  const pass = modalInput.value;
  const errorBox = document.getElementById('modal-error');

  if (pass === wifiPassword) {
    wifiConnectedCorrect = true;
    wifiConnectedWrong = false;
    passwordModal.classList.remove('show');
    setTimeout(openMonitor, 300);
  } else {
    errorBox.textContent = "Неверный пароль. Попробуйте ещё раз.";
    errorBox.classList.remove('hidden');
    modalInput.focus();
  }
};

    modalCancel.onclick = () => {
      passwordModal.classList.remove('show');
      openMonitor();
    };
  
    function chooseWrongWifi(){
      wifiConnectedWrong = true;
      catSpeech.textContent = "Подключился к сети злоумышленника.";
      setTimeout(openMonitor,300);
    }
  
    // финал
    function endGame(good,message) {
      overlay.style.opacity = '1';
      catContainer.classList.add('show');
      catSpeech.textContent = message;
      if (good) setTimeout(()=>setSceneBackground("assets/img/game_bg_complete.png"),600);
      
      // ИСПРАВЛЕНИЕ: кнопка "Сыграть снова" теперь вызывает только resetGame()
      // А дальше пользователь нажимает "Далее" для повторного прохождения интро
      setTimeout(()=>{
        setChoices([
          { text:"Сыграть снова", action:()=>{
              resetGame(); // Сброс состояния игры
              // После resetGame(), catSpeech.textContent уже dialogues[0],
              // и nextBtn.style.display='block'. Пользователь нажмет "Далее".
          }}
        ]);
      },600);
    }
  

    
    // подсказка
    hintBtn.addEventListener('click',()=>{
      if(!cablePicked&&!wifiPicked) {
        catSpeech.textContent="Подсказка: загляни в ящик.";
      }
      else if(pcCableConnected&&!cableToRouterConnected) {
        catSpeech.textContent="Подсказка: кажется в роутере был подходящий разъём.";
      }
      else {
        catSpeech.textContent="Подсказка: проверь монитор или роутер.";
      }
      catContainer.classList.add('show');
    });
  
    // «Далее» (вступление)
    nextBtn.addEventListener('click',()=>{
      dialogueIndex++;
      if(dialogueIndex < dialogues.length) { // Если еще есть диалоги
        catSpeech.textContent=dialogues[dialogueIndex];
      } else { // Диалоги закончились, показываем основные действия
        nextBtn.style.display='none'; // Прячем кнопку "Далее"
        showMainScene(); // Показываем основные действия
      }
    });
  
    // старт игры при загрузке
    resetGame(); // Изначально сбрасываем игру, чтобы начать с первого диалога
    setTimeout(()=>{
      overlay.style.opacity='1';
      catContainer.classList.add('show');
      catSpeech.textContent=dialogues[0]; // Убеждаемся, что первый диалог установлен
      setTimeout(()=>overlay.style.opacity='0',900);
    },300);
});