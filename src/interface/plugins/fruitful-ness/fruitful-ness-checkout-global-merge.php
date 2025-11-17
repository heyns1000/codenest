<?php
/**
 * Plugin Name: VaultMesh Global Checkout Portal
 * Description: The definitive, single-file commerce portal for the FAA.zone™ ecosystem. Renders the BareCart™ Vortex, calculates the 15% Care Split, and generates the Atomic Key for irreversible Ledger anchoring.
 * Version: 1.0
 * Author: VaultMesh Sovereign Node
 */

if (!defined('ABSPATH')) exit;

// --- CONFIGURATION CONSTANTS (Root of the Collapse Protocol) ---
const ROOT_KEY = "0f19bb22-ad64-45d2-abc9-ad5686a978dc";
const LOCK_TIMESTAMP_MS = 1730013441000;
const COLLAPSE_INTERVAL_MS = 900;
const CARE_RATE = 0.15; // 15%
const PAYPAL_BUTTON_ID = "K65YZZXSGZ7U"; // Live Hosted Button ID
const TOTAL_BRANDS = 7344; 
const ORIGINAL_PLACEHOLDERS = 1164; 

// --- AUDIT DATA INJECTION (Source: Comprehensive Audit V5) ---
$AUDIT_DATA = [
    'OVERVIEW' => [
        'TOTAL_BRANDS' => '13,713',
        'TARGET' => '9,000',
        'ACHIEVEMENT' => '152.4%',
        'VERDICT' => 'PRODUCTION READY',
    ],
    'SYSTEMS' => [
        ['System 1: FAA™ LICENSING', '7,344', '✅ Fully Operational'],
        ['System 2: HSOMNI9000 REPOSITORY', '6,219', '✅ Verified'],
        ['System 3: SEEDWAVE VERIFIED BRANDS', '150', '⭐ NEWLY CREATED'],
    ],
    'QUALITY' => [
        'VALIDATED' => ['Validated Brand Names', '84.1%', 'B+'],
        ['Placeholder Names', '15.9%', '⚠️ Needs Cleanup'],
        ['Missing Critical Fields', '0%', 'A+'],
    ],
    'TIER_BREAKDOWN' => [
        ['Sovereign', '440', '20,138.16 ECR', '20.14%'],
        ['Dynastic', '1,202', '10,910.51 ECR', '19.71%'],
        ['Operational', '1,098', '6,553.71 ECR', '15.63%'],
        ['Market', '4,604', '3,351.61 ECR', '7.86%'],
    ],
    'FINANCIAL' => [
        'AVG_FEE' => '6,073.26 ECR',
        'AVG_ROYALTY' => '11.70%',
    ]
];

// --- JS TRANSLATIONS (Defined once in PHP) ---
$JS_TRANSLATIONS = [
    'en' => [ "Sovereign" => "FAA Sovereign License", "lang_name" => "English", "protocol_failure" => "Error: Protocol failure (AI Node)", "expand_query" => "Expand Query" ],
    'af' => [ "Sovereign" => "FAA Soewereine Lisensie", "lang_name" => "Afrikaans", "protocol_failure" => "Fout: Protokol het gefaal (AI Node)", "expand_query" => "Brei Navraag Uit" ],
    'zh' => [ "Sovereign" => "FAA 主权许可", "lang_name" => "中文 (简体)", "protocol_failure" => "错误: 协议失败 (AI 节点)", "expand_query" => "展开查询" ],
    'zu' => [ "Sovereign" => "Ilayisense ye-FAA Enobukhosi", "lang_name" => "isiZulu", "protocol_failure" => "Iphutha: Ukwehluleka kwephrothokholi (AI Node)", "expand_query" => "Yandisa Umbuzo" ],
    'xh' => [ "Sovereign" => "Ilayisenisi ye-FAA Enobukhosi", "lang_name" => "isiXhosa", "protocol_failure" => "Impazamo: Ukusilela kweprotocol (AI Node)", "expand_query" => "Yandisa Umbuzo" ],
    'sw' => [ "Sovereign" => "Leseni ya FAA ya Enoboshi", "lang_name" => "Kiswahili", "protocol_failure" => "Hitifalu: Itifaki imeshindwa (AI Node)", "expand_query" => "Panua Hoja" ],
    'ar' => [ "Sovereign" => "ترخيص FAA السيادي", "lang_name" => "العربية", "protocol_failure" => "خطأ: فشل في البروتوكول (AI Node)", "expand_query" => "توسيع الاستعلام" ],
    'es' => [ "Sovereign" => "Licencia Soberana FAA", "lang_name" => "Español", "protocol_failure" => "Error: Fallo de protocolo (AI Node)", "expand_query" => "Ampliar Consulta" ],
    'fr' => [ "Sovereign" => "Licence Souveraine FAA", "lang_name" => "Français", "protocol_failure" => "Erreur: Échec du protocole (AI Node)", "expand_query" => "Développer Requête" ],
    'de' => [ "Sovereign" => "FAA Souveräne Lizenz", "lang_name" => "Deutsch", "protocol_failure" => "Fehler: Protokollfehler (AI Node)", "expand_query" => "Abfrage Erweitern" ],
    'pt' => [ "Sovereign" => "Licença Soberana FAA", "lang_name" => "Português", "protocol_failure" => "Erro: Falha no protocolo (AI Node)", "expand_query" => "Expandir Consulta" ],
    'ru' => [ "Sovereign" => "Суверенная лицензия FAA", "lang_name" => "Русский", "protocol_failure" => "Ошибка: Сбой протокола (AI Node)", "expand_query" => "Расширить Запрос" ],
    'ja' => [ "Sovereign" => "FAA主権ライセンス", "lang_name" => "日本語", "protocol_failure" => "エラー: プロトコル障害 (AI Node)", "expand_query" => "クエリを拡張" ],
    'ko' => [ "Sovereign" => "FAA 주권 라이선스", "lang_name" => "한국어", "protocol_failure" => " 오류: 프로토콜 실패 (AI Node)", "expand_query" => "쿼리 확장" ],
];


// --- ENTRY POINT: Bypasses WordPress Theme ---
add_action('init', function() use ($AUDIT_DATA, $JS_TRANSLATIONS) {
    // Defines the exact, final URL slug for the checkout.
    $target_slug = '/Fruitful_ness_checkout_global_merge';
    $request_uri = isset($_SERVER['REQUEST_URI']) ? esc_url_raw(wp_unslash($_SERVER['REQUEST_URI'])) : '';

    if (strpos($request_uri, $target_slug) !== false) {
        define('WP_USE_THEMES', false);
        ob_start();
        status_header(200);
        header('Content-Type: text/html; charset=utf-8');
        
        // Encode translations once and inject into global JS scope
        $js_translations_json = json_encode($JS_TRANSLATIONS);
        ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VaultMesh Global Payment Portal</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    
    <!-- FIX: Inject Global JS Variable Safely - Resolves SyntaxError by using standard window property -->
    <script>
        // This is the definitive fix for the recurring SyntaxError: Identifier 'LITE_TRANSLATIONS' has already been declared.
        // We define it as a safe global property that can be safely overwritten or accessed, not a constant declaration.
        window.LITE_TRANSLATIONS = <?php echo $js_translations_json; ?>;
    </script>

    <style>
        /* CSS Variables for theming (MineNest/Fruitful Primary) */
        :root {
            --text-color-dark: #f5f5f7;
            --bg-color-dark: #121212; /* Deep Black for true dark mode */
            --card-bg-dark: #1e1e1e; /* Darker grey for card */
            --border-color-dark: #3a3a3e;
            --primary-color: #0071e3; /* Fruitful primary blue */
            --minenest-color: #D2691E; /* Chocolate (Darker Gradient Base) */
            --minenest-accent-color: #E97451; /* Burnt Sienna (Lighter Gradient End) */
            --amber-accent: #FFB800; /* Sovereign Amber */
            --care-green: #10b981; /* Gorilla Comb Green Accent */
            --muted-text-dark: #a0a0a5;
            --paypal-blue: #0070BA;
            --payfast-teal: #00A69D; /* Payfast primary color */
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color-dark);
            color: var(--text-color-dark);
            min-height: 100vh;
        }
        .font-mono { font-family: 'Roboto Mono', monospace; }
        
        /* Card & Accent Colors */
        .card-bg { background-color: var(--card-bg-dark); }
        .accent-color { color: var(--amber-accent); } /* Sovereign Amber */
        
        /* FIX: Ensure input field contrast is high */
        .input-field { @apply bg-[#0f0f0f] text-white p-3 rounded-lg border border-[#444] focus:ring-amber-500 focus:border-amber-500 transition duration-150; }
        .btn-primary { @apply bg-amber-600 text-[#1a1a1a] font-bold py-3 rounded-lg hover:bg-amber-500 transition shadow-lg; }

        /* Financial Lock Card Border Glow */
        .lock-card {
            border: 1px solid var(--amber-accent);
            box-shadow: 0 0 15px rgba(255, 184, 0, 0.3);
        }
        /* Care Split Green Accent Box */
        .care-split { 
            background-color: #0c0c0c; 
            border: 1px solid var(--care-green); 
            color: var(--care-green); 
        }

        /* Header Hero - MineNest/Fruitful Gradient */
        .portal-hero {
            text-align: center;
            padding: 50px 20px;
            /* Using the rich brown/orange gradient aligned with MineNest */
            background: linear-gradient(135deg, var(--minenest-color) 0%, var(--minenest-accent-color) 100%);
            color: white;
            box-shadow: 0 10px 30px rgba(210, 105, 30, 0.4);
            margin-bottom: 30px;
            border-radius: 12px;
        }
        .portal-hero h1 { font-size: 3rem; font-weight: 900; line-height: 1.1; text-shadow: 2px 2px 5px rgba(0,0,0,0.4); }
        .portal-hero p { font-size: 1.5rem; margin-top: 10px; color: rgba(255, 255, 255, 0.8); }

        /* AI Help Section Styling */
        .ai-help-section h3 i {
             color: #9370DB; /* MindLift Purple Accent for the icon */
        }
        .checkout-action-button {
            background-color: var(--primary-color);
        }