// Автоскрытие UI элементов
(function() {
  const headerTriggerDistance = 50;
  const panelTriggerDistance = 150; // Увеличенная зона для левой панели
  const panelHideDistance = 350;    // Буферная зона - панель скрывается только при удалении дальше

  function initAutoHide() {
    const body = document.body;
    
    // Добавляем основной класс - по умолчанию UI скрыт
    body.classList.add('ui-auto-hide');

    function handleMouseMove(event) {
      const { clientX, clientY } = event;

      // Проверяем близость к верхней части экрана для header
      if (clientY <= headerTriggerDistance) {
        body.classList.add('mouse-near-top');
      } else {
        body.classList.remove('mouse-near-top');
      }

      // Логика для левой панели с буферной зоной
      const isNearLeft = clientX <= panelTriggerDistance;
      const isFarFromLeft = clientX >= panelHideDistance;
      
      if (isNearLeft) {
        body.classList.add('mouse-near-left');
      } else if (isFarFromLeft) {
        body.classList.remove('mouse-near-left');
      }
      // В промежуточной зоне (150px-350px) состояние не меняется
    }

    // Добавляем CSS классы к соответствующим элементам
    function addAutoHideClasses() {
      // Header
      const header = document.querySelector('.--docs--header');
      if (header) {
        header.classList.add('auto-hide-header');
      }

      // Left panel desktop
      const leftPanelDesktop = document.querySelector('.--docs--left-panel-desktop');
      if (leftPanelDesktop) {
        leftPanelDesktop.classList.add('auto-hide-panel');
      }

      // Main content
      const mainLayout = document.querySelector('#main-layout');
      if (mainLayout) {
        mainLayout.classList.add('auto-hide-main');
      }
    }

    // Добавляем обработчики
    document.addEventListener('mousemove', handleMouseMove);
    
    // Добавляем классы после загрузки DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addAutoHideClasses);
    } else {
      addAutoHideClasses();
    }

    // Переproверяем классы при изменениях в DOM
    const observer = new MutationObserver(addAutoHideClasses);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Инициализация при загрузке страницы
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoHide);
  } else {
    initAutoHide();
  }
})(); 