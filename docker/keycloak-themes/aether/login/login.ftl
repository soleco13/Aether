<#import "template.ftl" as layout>

<@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password') displayInfo=realm.password && realm.registrationAllowed; section>
  <#if section = "header">
    ${msg("doLogIn")}
  <#elseif section = "form">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      
      /* Скрываем полосы прокрутки */
      ::-webkit-scrollbar {
        display: none;
      }
      
      html, body {
        scrollbar-width: none;
        -ms-overflow-style: none;
        overflow-x: hidden;
      }
      
      :root {
        --aether-black: #000000;
        --aether-dark-gray: #404040;
        --aether-gray: #808080;
        --aether-light-gray: #c0c0c0;
        --aether-white: #ffffff;
        --aether-gradient: linear-gradient(135deg, #c0c0c0 0%, #808080 100%);
        --aether-gradient-hover: linear-gradient(135deg, #d4d4d8 0%, #a1a1aa 100%);
        --aether-bg-gradient: linear-gradient(135deg, #404040 0%, #000000 100%);
      }
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      html, body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        background: var(--aether-bg-gradient) !important;
        color: var(--aether-light-gray) !important;
        height: 100vh;
        width: 100vw;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden;
      }
      
      /* Звездный фон */
      body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-image: 
          radial-gradient(2px 2px at 20px 30px, #ffffff, transparent),
          radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
          radial-gradient(1px 1px at 90px 40px, #ffffff, transparent),
          radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
          radial-gradient(2px 2px at 160px 30px, #ffffff, transparent);
        background-repeat: repeat;
        background-size: 200px 100px;
        animation: sparkle 4s linear infinite;
      }
      
      @keyframes sparkle {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      
      /* Основной контейнер */
      .login-pf-page {
        background: transparent !important;
        height: 100vh !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        position: relative;
        z-index: 2;
      }
      
      .login-pf {
        background: transparent !important;
        box-shadow: none !important;
        border: none !important;
      }
      
      .card-pf {
        background: rgba(64, 64, 64, 0.3) !important;
        backdrop-filter: blur(20px) !important;
        border: 1px solid rgba(192, 192, 192, 0.2) !important;
        border-radius: 16px !important;
        padding: 40px !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8) !important;
        width: 400px !important;
        max-width: 90vw !important;
      }
      
      /* Логотип */
      .login-pf-brand {
        text-align: center !important;
        margin-bottom: 30px !important;
      }
      
      .login-pf-brand img {
        display: none !important;
      }
      
      .login-pf-brand::after {
        content: 'Æ';
        font-size: 60px !important;
        font-weight: 900 !important;
        background: var(--aether-gradient) !important;
        -webkit-background-clip: text !important;
        background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        display: block !important;
        animation: float 3s ease-in-out infinite !important;
        margin-bottom: 15px !important;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      /* Заголовок */
      #kc-page-title, .instruction {
        color: var(--aether-light-gray) !important;
        font-size: 28px !important;
        font-weight: 600 !important;
        text-align: center !important;
        margin-bottom: 10px !important;
      }
      
      .instruction {
        font-size: 16px !important;
        font-weight: 400 !important;
        opacity: 0.8 !important;
        margin-bottom: 30px !important;
      }
      

      
      /* Форма */
      .form-group {
        margin-bottom: 20px !important;
      }
      
      label {
        color: var(--aether-light-gray) !important;
        font-weight: 500 !important;
        margin-bottom: 8px !important;
        display: block !important;
      }
      
      input[type="text"], 
      input[type="email"], 
      input[type="password"] {
        width: 100% !important;
        padding: 12px 16px !important;
        background: rgba(64, 64, 64, 0.5) !important;
        border: 1px solid rgba(192, 192, 192, 0.3) !important;
        border-radius: 8px !important;
        color: var(--aether-white) !important;
        font-size: 16px !important;
        transition: all 0.3s ease !important;
        backdrop-filter: blur(10px) !important;
      }
      
      input[type="text"]:focus, 
      input[type="email"]:focus, 
      input[type="password"]:focus {
        outline: none !important;
        border-color: var(--aether-light-gray) !important;
        background: rgba(64, 64, 64, 0.7) !important;
        box-shadow: 0 0 0 3px rgba(192, 192, 192, 0.1) !important;
      }
      
      input::placeholder {
        color: rgba(192, 192, 192, 0.6) !important;
      }
      
      /* Checkbox */
      .checkbox {
        margin: 20px 0 !important;
      }
      
      .checkbox label {
        display: flex !important;
        align-items: center !important;
        font-size: 14px !important;
        cursor: pointer !important;
      }
      
      .checkbox input[type="checkbox"] {
        margin-right: 8px !important;
        width: auto !important;
        accent-color: var(--aether-light-gray) !important;
      }
      
      /* Кнопки */
      .btn-primary, 
      input[type="submit"] {
        width: 100% !important;
        padding: 14px !important;
        background: var(--aether-gradient) !important;
        border: none !important;
        border-radius: 8px !important;
        color: var(--aether-black) !important;
        font-weight: 600 !important;
        font-size: 16px !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        margin-bottom: 15px !important;
      }
      
      .btn-primary:hover, 
      input[type="submit"]:hover {
        background: var(--aether-gradient-hover) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 10px 20px rgba(192, 192, 192, 0.2) !important;
      }
      
      /* Ссылки */
      .form-actions a, 
      a {
        color: var(--aether-light-gray) !important;
        text-decoration: none !important;
        font-size: 14px !important;
        transition: color 0.3s ease !important;
      }
      
      .form-actions a:hover, 
      a:hover {
        color: var(--aether-white) !important;
      }
      
      /* Кнопка регистрации */
      .register-link {
        width: 100% !important;
        padding: 12px !important;
        background: transparent !important;
        border: 1px solid rgba(192, 192, 192, 0.3) !important;
        border-radius: 8px !important;
        color: var(--aether-light-gray) !important;
        font-weight: 500 !important;
        font-size: 16px !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        text-align: center !important;
        display: block !important;
        text-decoration: none !important;
        margin-top: 15px !important;
      }
      
      .register-link:hover {
        background: rgba(192, 192, 192, 0.1) !important;
        border-color: var(--aether-light-gray) !important;
        color: var(--aether-white) !important;
      }
      
      /* Контейнер регистрации */
      #kc-registration, #kc-registration-container {
        margin-top: 20px !important;
        text-align: center !important;
      }
      
      #kc-registration span {
        color: var(--aether-gray) !important;
        font-size: 14px !important;
      }
      
      #kc-registration a {
        color: var(--aether-light-gray) !important;
        font-weight: 500 !important;
        margin-left: 5px !important;
      }
      
      #kc-registration a:hover {
        color: var(--aether-white) !important;
      }
      
      /* Сообщения об ошибках */
      .alert-error, 
      .pf-m-danger {
        background: rgba(220, 38, 38, 0.2) !important;
        border: 1px solid rgba(220, 38, 38, 0.3) !important;
        color: #fca5a5 !important;
        padding: 12px !important;
        border-radius: 8px !important;
        margin-bottom: 20px !important;
        backdrop-filter: blur(10px) !important;
      }
      
      /* Скрытие ненужных элементов */
      .login-pf-header {
        display: none !important;
      }
      
      /* Убеждаемся что регистрация видна */
      #kc-registration,
      #kc-registration-container,
      .register-link {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }

      /* Мобильная адаптация */
      @media only screen and (max-width: 768px) {
        /* Убираем overflow для мобильных */
        html, body {
          overflow: auto !important;
          height: auto !important;
          min-height: 100vh !important;
        }

        body::before {
          position: absolute !important;
          height: 100% !important;
        }

        .login-pf-page {
          height: auto !important;
          min-height: 100vh !important;
          padding: 20px 16px !important;
        }

        .card-pf {
          width: 100% !important;
          max-width: 100% !important;
          padding: 24px !important;
          margin: 0 !important;
          border-radius: 12px !important;
        }

        .login-pf-brand::after {
          font-size: 48px !important;
          margin-bottom: 12px !important;
        }

        #kc-page-title, .instruction {
          font-size: 24px !important;
          margin-bottom: 8px !important;
        }

        .instruction {
          font-size: 14px !important;
          margin-bottom: 24px !important;
        }

        /* Улучшаем поля ввода для мобильных */
        input[type="text"], 
        input[type="email"], 
        input[type="password"] {
          padding: 16px !important;
          font-size: 16px !important;
          border-radius: 12px !important;
          -webkit-appearance: none !important;
          appearance: none !important;
        }

        /* Увеличиваем размер кнопок */
        .btn-primary, 
        input[type="submit"] {
          padding: 16px !important;
          font-size: 17px !important;
          border-radius: 12px !important;
          margin-bottom: 20px !important;
          min-height: 48px !important;
        }

        .register-link {
          padding: 14px !important;
          font-size: 16px !important;
          border-radius: 12px !important;
          margin-top: 16px !important;
          min-height: 48px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        /* Улучшаем чекбокс */
        .checkbox {
          margin: 16px 0 !important;
        }

        .checkbox input[type="checkbox"] {
          transform: scale(1.2) !important;
          margin-right: 12px !important;
        }

        .checkbox label {
          font-size: 15px !important;
        }

        /* Оптимизируем текст и ссылки */
        .form-actions a, a {
          font-size: 15px !important;
          padding: 8px !important;
          display: inline-block !important;
        }

        #kc-registration span {
          font-size: 15px !important;
        }

        #kc-registration a {
          font-size: 15px !important;
          padding: 4px 8px !important;
        }

        /* Убираем hover эффекты на мобильных */
        .btn-primary:hover, 
        input[type="submit"]:hover,
        .register-link:hover {
          transform: none !important;
        }
      }

      /* Маленькие экраны (телефоны в портретной ориентации) */
      @media only screen and (max-width: 480px) {
        .login-pf-page {
          padding: 16px 12px !important;
        }

        .card-pf {
          padding: 20px !important;
          border-radius: 8px !important;
        }

        .login-pf-brand::after {
          font-size: 40px !important;
        }

        #kc-page-title, .instruction {
          font-size: 20px !important;
        }

        .instruction {
          font-size: 13px !important;
        }

        input[type="text"], 
        input[type="email"], 
        input[type="password"] {
          padding: 14px !important;
          font-size: 16px !important;
        }

        .form-group {
          margin-bottom: 16px !important;
        }
      }

      /* Альбомная ориентация на мобильных */
      @media only screen and (max-height: 600px) and (orientation: landscape) {
        .login-pf-page {
          padding: 12px 16px !important;
        }

        .card-pf {
          padding: 16px !important;
        }

        .login-pf-brand::after {
          font-size: 32px !important;
          margin-bottom: 8px !important;
        }

        #kc-page-title {
          font-size: 18px !important;
          margin-bottom: 4px !important;
        }

        .instruction {
          font-size: 12px !important;
          margin-bottom: 16px !important;
        }

        .form-group {
          margin-bottom: 12px !important;
        }

        input[type="text"], 
        input[type="email"], 
        input[type="password"] {
          padding: 12px !important;
        }

        .btn-primary, 
        input[type="submit"],
        .register-link {
          padding: 12px !important;
          min-height: 40px !important;
        }
      }
    </style>

    <div id="kc-form">
      <div id="kc-form-wrapper">
        <#if realm.password && social.providers??>
          <div id="kc-social-providers" class="col-md-12">
            <ul>
              <#list social.providers as p>
                <li><a id="social-${p.alias}" class="btn btn-primary" href="${p.loginUrl}">${p.displayName!}</a></li>
              </#list>
            </ul>
          </div>
        </#if>
        
        <#if realm.password>
          <form id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
            <div class="form-group">
              <label for="username" class="control-label">${msg("usernameOrEmail")}</label>
              <input tabindex="1" id="username" class="form-control" name="username" value="${(login.username!'')}" type="text" autofocus autocomplete="off" aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"/>
            </div>

            <div class="form-group">
              <label for="password" class="control-label">${msg("password")}</label>
              <input tabindex="2" id="password" class="form-control" name="password" type="password" autocomplete="off" aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"/>
            </div>

            <div class="form-group login-pf-settings">
              <div id="kc-form-options">
                <#if realm.rememberMe && !usernameEditDisabled??>
                  <div class="checkbox">
                    <label>
                      <#if login.rememberMe??>
                        <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox" checked> ${msg("rememberMe")}
                      <#else>
                        <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox"> ${msg("rememberMe")}
                      </#if>
                    </label>
                  </div>
                </#if>
              </div>
            </div>

            <div id="kc-form-buttons" class="form-group">
              <input type="hidden" id="id-hidden-input" name="credentialId" <#if auth.selectedCredential?has_content>value="${auth.selectedCredential}"</#if>/>
              <input tabindex="4" class="btn btn-primary btn-block btn-lg" name="login" id="kc-login" type="submit" value="${msg("doLogIn")}"/>
            </div>
          </form>
          
          <#if realm.registrationAllowed>
            <div id="kc-registration">
              <a href="${url.registrationUrl}" class="register-link">
                Создать аккаунт
              </a>
            </div>
          </#if>
        </#if>
      </div>
    </div>
  <#elseif section = "info">
    <#if realm.password && realm.registrationAllowed>
      <div id="kc-registration-container">
        <div id="kc-registration">
          <span>Нет аккаунта? <a tabindex="6" href="${url.registrationUrl}">Создать аккаунт</a></span>
        </div>
      </div>
    </#if>
  </#if>

</@layout.registrationLayout> 