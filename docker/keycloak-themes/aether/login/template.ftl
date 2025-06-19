<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false showAnotherWayIfPresent=true>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" class="${properties.kcHtmlClass!}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="noindex, nofollow">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <#if properties.meta?has_content>
        <#list properties.meta?split(' ') as meta>
            <meta name="${meta?split('==')[0]}" content="${meta?split('==')[1]}"/>
        </#list>
    </#if>
    <title>${msg("loginTitle",(realm.displayName!''))}</title>
    <link rel="icon" href="${url.resourcesPath}/img/favicon.ico" />
    <#if properties.stylesCommon?has_content>
        <#list properties.stylesCommon?split(' ') as style>
            <link href="${url.resourcesCommonPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    <#if properties.styles?has_content>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    <#if properties.scripts?has_content>
        <#list properties.scripts?split(' ') as script>
            <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
        </#list>
    </#if>
    <#if scripts??>
        <#list scripts as script>
            <script src="${script}" type="text/javascript"></script>
        </#list>
    </#if>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
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
        
        * { box-sizing: border-box; }
        
        html, body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            background: var(--aether-bg-gradient) !important;
            color: var(--aether-light-gray) !important;
            margin: 0 !important;
            padding: 0 !important;
            min-height: 100vh !important;
            overflow-x: hidden;
        }
        
        body::before {
            content: '';
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: 
                radial-gradient(2px 2px at 20px 30px, var(--aether-light-gray), transparent),
                radial-gradient(2px 2px at 40px 70px, rgba(192, 192, 192, 0.8), transparent),
                radial-gradient(1px 1px at 90px 40px, rgba(192, 192, 192, 0.6), transparent),
                radial-gradient(1px 1px at 130px 80px, var(--aether-light-gray), transparent),
                radial-gradient(2px 2px at 160px 30px, rgba(192, 192, 192, 0.7), transparent);
            background-repeat: repeat;
            background-size: 200px 100px;
            opacity: 0.6;
            z-index: 1;
            animation: twinkle 3s ease-in-out infinite alternate;
        }
        
        @keyframes twinkle {
            0% { opacity: 0.4; }
            100% { opacity: 0.8; }
        }
        
        .login-pf {
            background: transparent !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-height: 100vh !important;
            padding: 2rem !important;
            position: relative;
            z-index: 2;
        }
        
        .card-pf {
            background: rgba(0, 0, 0, 0.8) !important;
            backdrop-filter: blur(20px) !important;
            border: 1px solid var(--aether-dark-gray) !important;
            border-radius: 20px !important;
            box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5) !important;
            max-width: 480px !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 auto !important;
            animation: fadeInUp 0.6s ease-out;
        }
        
        .card-pf-title {
            background: transparent !important;
            border: none !important;
            padding: 3rem 3rem 1rem 3rem !important;
            text-align: center !important;
            position: relative;
        }
        
        .card-pf-title::before {
            content: 'Æ';
            display: block;
            width: 80px; height: 80px;
            background: var(--aether-gradient);
            border-radius: 16px;
            font-size: 32px; font-weight: 900;
            color: var(--aether-black);
            line-height: 80px; text-align: center;
            margin: 0 auto 1.5rem auto;
            box-shadow: 0 8px 24px rgba(192, 192, 192, 0.2);
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
        }
        
        .card-pf-title h1, #kc-page-title {
            font-size: 2.5rem !important;
            font-weight: 800 !important;
            color: var(--aether-light-gray) !important;
            margin: 0 0 0.5rem 0 !important;
            text-shadow: 0 4px 16px rgba(192, 192, 192, 0.3) !important;
            font-family: 'Inter', sans-serif !important;
        }
        
        .card-pf-title h1::after, #kc-page-title::after {
            content: 'Эфирная коллаборация документов';
            display: block; font-size: 1rem; font-weight: 400;
            color: var(--aether-gray); margin-top: 0.5rem;
        }
        
        .card-pf-body {
            padding: 2rem 3rem 3rem 3rem !important;
            background: transparent !important;
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Улучшенная мобильная адаптация для template */
        @media only screen and (max-width: 768px) {
            .login-pf {
                padding: 1rem !important;
                min-height: 100vh !important;
            }

            .card-pf {
                max-width: 100% !important;
                border-radius: 16px !important;
            }

            .card-pf-title {
                padding: 2rem 2rem 1rem 2rem !important;
            }

            .card-pf-title::before {
                width: 60px !important;
                height: 60px !important;
                font-size: 28px !important;
                line-height: 60px !important;
                margin-bottom: 1rem !important;
            }

            .card-pf-title h1, #kc-page-title {
                font-size: 2rem !important;
            }

            .card-pf-title h1::after, #kc-page-title::after {
                font-size: 0.9rem !important;
            }

            .card-pf-body {
                padding: 1.5rem 2rem 2rem 2rem !important;
            }
        }

        @media only screen and (max-width: 480px) {
            .login-pf {
                padding: 0.5rem !important;
            }

            .card-pf {
                border-radius: 12px !important;
            }

            .card-pf-title {
                padding: 1.5rem 1.5rem 0.5rem 1.5rem !important;
            }

            .card-pf-title::before {
                width: 50px !important;
                height: 50px !important;
                font-size: 24px !important;
                line-height: 50px !important;
                margin-bottom: 0.75rem !important;
            }

            .card-pf-title h1, #kc-page-title {
                font-size: 1.75rem !important;
            }

            .card-pf-title h1::after, #kc-page-title::after {
                font-size: 0.8rem !important;
            }

            .card-pf-body {
                padding: 1rem 1.5rem 1.5rem 1.5rem !important;
            }
        }

        /* Улучшенная адаптация для альбомной ориентации */
        @media only screen and (max-height: 600px) and (orientation: landscape) {
            .login-pf {
                padding: 0.5rem !important;
            }

            .card-pf-title {
                padding: 1rem 2rem 0.5rem 2rem !important;
            }

            .card-pf-title::before {
                width: 40px !important;
                height: 40px !important;
                font-size: 20px !important;
                line-height: 40px !important;
                margin-bottom: 0.5rem !important;
            }

            .card-pf-title h1, #kc-page-title {
                font-size: 1.5rem !important;
                margin-bottom: 0.25rem !important;
            }

            .card-pf-title h1::after, #kc-page-title::after {
                font-size: 0.7rem !important;
                margin-top: 0.25rem !important;
            }

            .card-pf-body {
                padding: 1rem 2rem 1.5rem 2rem !important;
            }
        }
    </style>
</head>

<body class="${properties.kcBodyClass!}">
    <div class="login-pf">
        <div class="login-pf-page">
            <div class="card-pf">

                <header class="card-pf-title">
                    <h1 id="kc-page-title">Aether</h1>
                </header>

                <div class="card-pf-body">
                    <div id="kc-content">
                        <div id="kc-content-wrapper">

                            <#-- App-initiated actions should not see warning messages about the need to complete the action -->
                            <#-- during login.                                                                               -->
                            <#if displayMessage && message?has_content && (message.type != 'warning' || !isAppInitiatedAction??)>
                                <div class="alert alert-${message.type}">
                                    <#if message.type = 'error'><span class="kc-feedback-text">${kcSanitize(message.summary)?no_esc}</span></#if>
                                    <#if message.type = 'success'><span class="kc-feedback-text">${kcSanitize(message.summary)?no_esc}</span></#if>
                                    <#if message.type = 'warning'><span class="kc-feedback-text">${kcSanitize(message.summary)?no_esc}</span></#if>
                                    <#if message.type = 'info'><span class="kc-feedback-text">${kcSanitize(message.summary)?no_esc}</span></#if>
                                </div>
                            </#if>

                            <#nested "form">

                            <#if auth?has_content && auth.showTryAnotherWayLink() && showAnotherWayIfPresent>
                                <form id="kc-select-try-another-way-form" action="${url.loginAction}" method="post">
                                    <div class="form-group">
                                        <input type="hidden" name="tryAnotherWay" value="on"/>
                                        <a href="#" id="try-another-way" onclick="document.forms['kc-select-try-another-way-form'].submit();return false;">${msg("doTryAnotherWay")}</a>
                                    </div>
                                </form>
                            </#if>

                            <#nested "socialProviders">

                            <#if displayInfo>
                                <#nested "info">
                            </#if>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</body>
</html>
</#macro> 