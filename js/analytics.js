[file name]: analytics.js
[file content begin]
// analytics.js - الإصدار المبسط لألعاب وأقسام Poaro Zone
(function() {
    'use strict';
    
    console.log('🎮 Poaro Zone Simplified Analytics Loading...');
    
    // إعدادات التتبع
    const GA_MEASUREMENT_ID = 'G-CFFCLPXRDH';
    let analyticsInitialized = false;

    // تهيئة gtag
    function initializeGtag() {
        if (typeof gtag === 'undefined') {
            window.dataLayer = window.dataLayer || [];
            window.gtag = function() {
                dataLayer.push(arguments);
            };
            gtag('js', new Date());
            gtag('config', GA_MEASUREMENT_ID);
        }
        analyticsInitialized = true;
    }

    // تحديد نوع القسم
    function getSectionType() {
        const path = window.location.pathname.toLowerCase();
        
        if (path === '/' || path.includes('index.html')) return 'home';
        if (path.includes('/ps5/')) return 'ps5';
        if (path.includes('/ps4/')) return 'ps4';
        if (path.includes('/ps3/')) return 'ps3';
        if (path.includes('/psp/')) return 'psp';
        if (path.includes('/arabic-games/')) return 'arabic_games';
        if (path.includes('/tutorials/')) return 'tutorials';
        if (path.includes('game.html')) return 'game_details';
        
        return 'other';
    }

    // استخراج اسم اللعبة فقط
    function getGameName() {
        const urlParams = new URLSearchParams(window.location.search);
        let gameName = 'unknown_game';

        try {
            // من معلمات URL
            const nameFromUrl = urlParams.get('name') || urlParams.get('game') || urlParams.get('post');
            if (nameFromUrl) {
                gameName = decodeURIComponent(nameFromUrl).trim();
            }

            // من post و type
            if ((!nameFromUrl || gameName === 'unknown_game') && urlParams.get('post') && urlParams.get('type')) {
                const postIndex = parseInt(urlParams.get('post'));
                const postType = urlParams.get('type');
                
                if (window[postType] && Array.isArray(window[postType]) && window[postType][postIndex]) {
                    const gameData = window[postType][postIndex];
                    gameName = gameData.name || gameData.game || gameData.post_title || 'unknown_game';
                }
            }

            // من DOM
            if (gameName === 'unknown_game') {
                const selectors = ['.game-title', '.post-title', '#gameTitle', '#postTitle', 'h1'];
                for (let selector of selectors) {
                    const element = document.querySelector(selector);
                    if (element && element.textContent && isValidName(element.textContent)) {
                        gameName = element.textContent.trim().substring(0, 100);
                        break;
                    }
                }
            }

        } catch (error) {
            console.warn('Error extracting game name:', error);
        }

        return gameName;
    }

    // التحقق من صحة الاسم
    function isValidName(name) {
        if (!name || typeof name !== 'string') return false;
        
        const invalidTerms = [
            'poaro zone', 'جار التحميل', 'تفاصيل', 
            'الصفحة الرئيسية', 'ابحث', '...', 'لا توجد'
        ];
        
        const cleanName = name.trim().toLowerCase();
        return (
            cleanName.length > 2 &&
            !invalidTerms.some(term => cleanName.includes(term))
        );
    }

    // تتبع إحصائية الألعاب الأكثر زيارة
    function trackGameView() {
        if (!analyticsInitialized) return;

        const gameName = getGameName();
        const sectionType = getSectionType();

        if (gameName !== 'unknown_game') {
            // تتبع كل لعبة باسمها مع قسمها
            gtag('event', 'game_view', {
                'game_name': gameName,
                'game_section': sectionType,
                'page_location': window.location.href
            });
            
            console.log('🎮 Game View Tracked:', gameName, 'in', sectionType);
        }
    }

    // تتبع إحصائية الأقسام الأكثر زيارة
    function trackSectionView() {
        if (!analyticsInitialized) return;

        const sectionType = getSectionType();

        // تتبع كل قسم
        gtag('event', 'section_view', {
            'section_name': sectionType,
            'page_location': window.location.href,
            'page_title': document.title
        });
        
        console.log('📊 Section View Tracked:', sectionType);
    }

    // بدء التتبع
    function startTracking() {
        initializeGtag();
        
        // تتبع إحصائية الأقسام (دائماً)
        trackSectionView();
        
        // تتبع إحصائية الألعاب (فقط إذا كانت صفحة لعبة)
        if (getSectionType() === 'game_details' || getGameName() !== 'unknown_game') {
            trackGameView();
        }
        
        console.log('✅ Simplified Analytics Activated - Only Games & Sections Tracking');
    }

    // التهيئة عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startTracking);
    } else {
        startTracking();
    }

})();
[file content end]