export interface DeliverableFile {
  id: string;
  name: string;
  category: 'architecture' | 'database' | 'uml' | 'backend-php' | 'frontend' | 'api' | 'install-guide' | 'security';
  title: string;
  filename: string;
  language: string;
  content: string;
}

export const COMPLETE_DELIVERABLES: DeliverableFile[] = [
  {
    id: 'arch-doc',
    name: 'Architecture Système Globale',
    category: 'architecture',
    title: 'Vitech Scripts Enterprise 2026 - System Architecture Blueprint',
    filename: 'ARCHITECTURE_OVERVIEW.md',
    language: 'markdown',
    content: `# VITECH SCRIPTS ENTERPRISE 2026
## "The Future of Digital Development" - System Architecture Blueprint

### 1. High-Level Overview
Vitech Scripts is a high-concurrency, multi-tenant digital marketplace engineered with a clean Model-View-Controller (MVC) PHP 8.4 backend, MySQL 8 InnoDB transactional database, Redis caching layer, and a Pro Max responsive frontend (Bootstrap 5, SCSS, ES6 AJAX).

### 2. Core Subsystems & Components
1. **Core Gateway & Router**: Clean RESTful URL routing (\`/products/{slug}\`, \`/api/v1/*\`) with strict route middleware (AuthJWT, CSRF, RateLimiter, AdminGuard).
2. **Automated Code & ZIP Analyzer Engine**:
   - Deconstructs uploaded ZIP archives at runtime.
   - AST / Regex parser detecting PHP, Laravel, React, Node, Python, Flutter, C#, Java, Tailwind, Bootstrap.
   - Calculates total files, lines of code, dependencies (composer.json / package.json), complexity, security score (OWASP Top 10) & quality score.
3. **Protected Download Gateway with User Watermarking & Auto Copyright Injection**:
   - Direct file system paths are completely hidden.
   - Downloads are tokenized with temporary single-use signed tokens (\`GET /download/gateway?token=xyz\`).
   - Automatically injects the official copyright footer into all \`.html\`, \`.php\`, and \`.css\` files prior to stream packaging:
     \`<footer style="text-align:center; padding:20px; font-family:sans-serif;">Copyright © Vab & Idriss (Vitech Africa)</footer>\`
   - Watermarks purchaser metadata (User ID, Purchase Ref, Hash) in a secure metadata descriptor inside the archive.
4. **Mobile Money Payment Engine (Rwanda & Panafrican)**:
   - Primary: MTN Mobile Money Rwanda (MoMo Open API v2.1 with USSD Push STK).
   - Secondary: Airtel Money Rwanda & Pan-African.
   - Instant webhook reconciliation with HMAC-SHA256 signature verification and idempotency keys.
   - Real-time PDF Invoice generator (TCPDF/mPDF).
5. **Multi-Language Engine (Auto-Detect)**:
   - Browser header \`Accept-Language\` auto-detection with fallback.
   - Supported locales: FR (French), EN (English), ES (Spanish), AR (Arabic with auto RTL), PT (Portuguese), ZH (Mandarin).
   - Dynamic database key-value translation table with in-memory Redis cache.
6. **Queue-Based Newsletter & Automated Promo Engine**:
   - Background worker processing email dispatch in chunks.
   - Automatic triggers: On product creation/update/promo, automatically generates responsive HTML email template with CTA.`
  },

  {
    id: 'mysql-schema',
    name: 'Schéma de Base de Données MySQL 8',
    category: 'database',
    title: 'MySQL 8 Database Schema with Indexes & Foreign Keys',
    filename: 'vitech_scripts_schema.sql',
    language: 'sql',
    content: `-- ==========================================================
-- VITECH SCRIPTS ENTERPRISE 2026 - PRODUCTION MYSQL 8 SCHEMA
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==========================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS newsletter_queue;
DROP TABLE IF EXISTS newsletter_subscribers;
DROP TABLE IF EXISTS product_reviews;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_licenses;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS & ROLES
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('member', 'author', 'admin', 'superadmin') DEFAULT 'member',
    avatar_url VARCHAR(255) DEFAULT NULL,
    status ENUM('active', 'suspended', 'pending') DEFAULT 'active',
    country_code VARCHAR(5) DEFAULT 'RW',
    phone_number VARCHAR(30) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. CATEGORIES
CREATE TABLE categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    icon VARCHAR(50) DEFAULT 'code',
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. PRODUCTS & CODE ANALYSIS METADATA
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE,
    author_id BIGINT UNSIGNED NOT NULL,
    category_id INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    tagline VARCHAR(255) DEFAULT NULL,
    short_description TEXT NOT NULL,
    full_description LONGTEXT NOT NULL,
    price_usd DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    price_rwf INT UNSIGNED NOT NULL DEFAULT 0,
    product_type ENUM('free', 'one_time', 'subscription') DEFAULT 'one_time',
    preview_image VARCHAR(255) NOT NULL,
    screenshots JSON DEFAULT NULL,
    live_demo_url VARCHAR(255) DEFAULT NULL,
    video_demo_url VARCHAR(255) DEFAULT NULL,
    zip_file_path VARCHAR(255) NOT NULL,
    -- Automated Script Analysis Output
    detected_language VARCHAR(50) DEFAULT 'PHP',
    detected_framework VARCHAR(50) DEFAULT 'Laravel',
    version VARCHAR(20) DEFAULT 'v1.0.0',
    file_size_mb DECIMAL(8,2) DEFAULT 0.00,
    files_count INT UNSIGNED DEFAULT 0,
    lines_of_code INT UNSIGNED DEFAULT 0,
    dependencies_json JSON DEFAULT NULL,
    difficulty_level ENUM('Beginner', 'Intermediate', 'Advanced', 'Enterprise') DEFAULT 'Intermediate',
    security_score INT UNSIGNED DEFAULT 98,
    quality_score INT UNSIGNED DEFAULT 95,
    owasp_grade VARCHAR(20) DEFAULT 'Certified A+',
    -- Metrics
    downloads_count INT UNSIGNED DEFAULT 0,
    views_count INT UNSIGNED DEFAULT 0,
    likes_count INT UNSIGNED DEFAULT 0,
    dislikes_count INT UNSIGNED DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 5.00,
    is_published TINYINT(1) DEFAULT 1,
    is_popular TINYINT(1) DEFAULT 0,
    is_featured TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_product_slug (slug),
    INDEX idx_product_type (product_type),
    INDEX idx_scores (security_score, quality_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. LICENSES
CREATE TABLE product_licenses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    license_key VARCHAR(64) NOT NULL UNIQUE,
    product_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NOT NULL,
    max_downloads INT DEFAULT 5,
    used_downloads INT DEFAULT 0,
    allowed_domain VARCHAR(191) DEFAULT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_license_key (license_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ORDERS & TRANSACTIONS (MTN MoMo, Airtel Money, Stripe)
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_ref VARCHAR(36) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NOT NULL,
    total_amount_usd DECIMAL(10,2) NOT NULL,
    total_amount_rwf INT UNSIGNED NOT NULL,
    payment_method ENUM('mtn_momo', 'airtel_money', 'stripe', 'paypal', 'free') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(100) DEFAULT NULL,
    payer_phone VARCHAR(30) DEFAULT NULL,
    pdf_invoice_path VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_order_ref (order_ref),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. ORDER ITEMS
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    unit_price_usd DECIMAL(10,2) NOT NULL,
    unit_price_rwf INT UNSIGNED NOT NULL,
    license_id BIGINT UNSIGNED DEFAULT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (license_id) REFERENCES product_licenses(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. REVIEWS & COMMENTS
CREATE TABLE product_reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
    comment TEXT NOT NULL,
    developer_reply TEXT DEFAULT NULL,
    likes_count INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. NEWSLETTER SUBSCRIBERS & CAMPAIGNS
CREATE TABLE newsletter_subscribers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    topic VARCHAR(50) DEFAULT 'all',
    status ENUM('active', 'unsubscribed') DEFAULT 'active',
    ip_address VARCHAR(45) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. AUDIT & DOWNLOAD TRACKING LOGS
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED DEFAULT NULL,
    event_type VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT DEFAULT NULL,
    payload JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event (event_type, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  },

  {
    id: 'php-mvc-backend',
    name: 'Code Source Backend PHP 8.4 MVC',
    category: 'backend-php',
    title: 'PHP 8.4 MVC Core Router, Controllers & Copyright Injection Gateway',
    filename: 'src/Controllers/DownloadGatewayController.php',
    language: 'php',
    content: `<?php
declare(strict_types=1);

namespace Vitech\\Controllers;

use Vitech\\Models\\License;
use Vitech\\Models\\Product;
use Vitech\\Services\\ZipArchiver;
use Vitech\\Services\\SecurityService;

/**
 * Class DownloadGatewayController
 * Manages protected downloads, license validation, rate limits, 
 * user metadata watermarking, and automated Copyright Injection.
 */
class DownloadGatewayController
{
    private const COPYRIGHT_FOOTER = '<footer style="text-align:center; padding:20px; font-family:sans-serif;">Copyright © Vab & Idriss (Vitech Africa)</footer>';

    public function handleDownload(string $licenseKey, string $token): void
    {
        // 1. Verify CSRF / JWT Single-Use Download Token
        if (!SecurityService::verifyDownloadToken($token, $licenseKey)) {
            http_response_code(403);
            die(json_encode(['error' => 'Invalid or expired download token.']));
        }

        // 2. Validate License & Quota
        $license = License::findByKey($licenseKey);
        if (!$license || !$license->isActive()) {
            http_response_code(401);
            die(json_encode(['error' => 'License is inactive or invalid.']));
        }

        if ($license->used_downloads >= $license->max_downloads) {
            http_response_code(429);
            die(json_encode(['error' => 'Download quota exceeded (max ' . $license->max_downloads . ').']));
        }

        $product = Product::findById($license->product_id);
        if (!$product || !file_exists($product->zip_file_path)) {
            http_response_code(404);
            die(json_encode(['error' => 'Source code archive not found.']));
        }

        // 3. Process Archive: Inject Watermark & Copyright Footer
        $processedZipPath = $this->prepareArchiveWithCopyright(
            $product->zip_file_path, 
            $license, 
            $product
        );

        // 4. Increment License Download Counter
        $license->incrementDownloadCount();

        // 5. Stream Securely to Browser
        $cleanFileName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $product->title) . '-v' . $product->version . '.zip';
        
        header('Content-Type: application/zip');
        header('Content-Disposition: attachment; filename="' . $cleanFileName . '"');
        header('Content-Length: ' . filesize($processedZipPath));
        header('Cache-Control: no-cache, must-revalidate');
        header('Pragma: no-cache');
        
        readfile($processedZipPath);
        
        // Clean up temporary processed archive
        @unlink($processedZipPath);
        exit;
    }

    /**
     * Injects copyright footer into .html, .php, .css files and watermarks metadata.
     */
    private function prepareArchiveWithCopyright(string $sourceZip, License $license, Product $product): string
    {
        $tempDir = sys_get_temp_dir() . '/vitech_' . bin2hex(random_bytes(8));
        mkdir($tempDir, 0755, true);

        $zip = new \\ZipArchive();
        if ($zip->open($sourceZip) === true) {
            $zip->extractTo($tempDir);
            $zip->close();
        }

        // Traverse files and inject copyright into .html, .php, .css
        $iterator = new \\RecursiveIteratorIterator(new \\RecursiveDirectoryIterator($tempDir));
        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $ext = strtolower($file->getExtension());
                if (in_array($ext, ['html', 'php', 'css'], true)) {
                    $content = file_get_contents($file->getPathname());
                    
                    if ($ext === 'html' || $ext === 'php') {
                        if (str_contains($content, '</body>')) {
                            $content = str_replace('</body>', self::COPYRIGHT_FOOTER . "\n</body>", $content);
                        } else {
                            $content .= "\n" . self::COPYRIGHT_FOOTER;
                        }
                    } elseif ($ext === 'css') {
                        $content .= "\n/* Copyright © Vab & Idriss (Vitech Africa) */\n";
                    }
                    
                    file_put_contents($file->getPathname(), $content);
                }
            }
        }

        // Inject Purchaser Watermark
        $watermarkInfo = [
            'license_key' => $license->license_key,
            'purchaser_id' => $license->user_id,
            'generated_at' => date('c'),
            'vendor' => 'Vitech Africa LTD (Kigali, Rwanda)',
            'founders' => 'Vab & Idriss'
        ];
        file_put_contents($tempDir . '/.vitech_license_metadata.json', json_encode($watermarkInfo, JSON_PRETTY_PRINT));

        // Re-pack Zip
        $outZip = sys_get_temp_dir() . '/vitech_delivery_' . bin2hex(random_bytes(8)) . '.zip';
        ZipArchiver::zipDirectory($tempDir, $outZip);

        // Delete temp unzipped folder
        self::deleteTree($tempDir);

        return $outZip;
    }

    private static function deleteTree(string $dir): void
    {
        $files = array_diff(scandir($dir) ?: [], ['.', '..']);
        foreach ($files as $file) {
            (is_dir("$dir/$file")) ? self::deleteTree("$dir/$file") : unlink("$dir/$file");
        }
        rmdir($dir);
    }
}`
  },

  {
    id: 'momo-gateway-php',
    name: 'Passerelle Mobile Money Rwanda (MTN & Airtel)',
    category: 'backend-php',
    title: 'PHP 8.4 MTN MoMo & Airtel Money Instant Payment Handler',
    filename: 'src/Services/MoMoPaymentService.php',
    language: 'php',
    content: `<?php
declare(strict_types=1);

namespace Vitech\\Services;

use GuzzleHttp\\Client;

/**
 * Handles instant MTN Mobile Money Rwanda API v2.1 & Airtel Money transactions.
 */
class MoMoPaymentService
{
    private Client $httpClient;
    private string $baseUrl;
    private string $subscriptionKey;
    private string $apiUser;
    private string $apiKey;

    public function __construct()
    {
        $this->httpClient = new Client();
        $this->baseUrl = $_ENV['MOMO_BASE_URL'] ?? 'https://sandbox.momodeveloper.mtn.com';
        $this->subscriptionKey = $_ENV['MOMO_SUBSCRIPTION_KEY'] ?? '';
        $this->apiUser = $_ENV['MOMO_API_USER'] ?? '';
        $this->apiKey = $_ENV['MOMO_API_KEY'] ?? '';
    }

    /**
     * Initiates USSD Push to customer phone in Rwanda (25078XXXXXXX)
     */
    public function requestToPay(string $phone, int $amountRwf, string $referenceId): array
    {
        $accessToken = $this->getBearerToken();
        $cleanPhone = preg_replace('/[^0-9]/', '', $phone);

        $response = $this->httpClient->post($this->baseUrl . '/collection/v1_0/requesttopay', [
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
                'X-Reference-Id' => $referenceId,
                'X-Target-Environment' => $_ENV['MOMO_TARGET_ENV'] ?? 'sandbox',
                'Ocp-Apim-Subscription-Key' => $this->subscriptionKey,
                'Content-Type' => 'application/json'
            ],
            'json' => [
                'amount' => (string)$amountRwf,
                'currency' => 'RWF',
                'externalId' => $referenceId,
                'payer' => [
                    'partyIdType' => 'MSISDN',
                    'partyId' => $cleanPhone
                ],
                'payerMessage' => 'Achat Vitech Scripts',
                'payeeNote' => 'Vitech Africa Ltd'
            ]
        ]);

        return [
            'status' => $response->getStatusCode() === 202 ? 'PENDING_PUSH' : 'FAILED',
            'referenceId' => $referenceId
        ];
    }

    private function getBearerToken(): string
    {
        $auth = base64_encode($this->apiUser . ':' . $this->apiKey);
        $res = $this->httpClient->post($this->baseUrl . '/collection/token/', [
            'headers' => [
                'Authorization' => 'Basic ' . $auth,
                'Ocp-Apim-Subscription-Key' => $this->subscriptionKey
            ]
        ]);

        $data = json_decode((string)$res->getBody(), true);
        return $data['access_token'] ?? '';
    }
}`
  },

  {
    id: 'rest-api-spec',
    name: 'Spécification API REST v1',
    category: 'api',
    title: 'RESTful API Endpoints & JWT Authentication Specification',
    filename: 'REST_API_DOCUMENTATION.md',
    language: 'markdown',
    content: `# VITECH SCRIPTS REST API v1.0

Base URL: \`https://scripts.vitechafrica.com/api/v1\`

### 1. Authentication Endpoints
- **POST** \`/auth/login\` : Authenticate with email/password → Returns JWT Bearer token & user profile.
- **POST** \`/auth/register\` : Create new account.
- **POST** \`/auth/refresh\` : Refresh active JWT token.

### 2. Products & Catalog Endpoints
- **GET** \`/products\` : Query catalog with filters (category, language, framework, price range, query, sort).
- **GET** \`/products/{slug}\` : Get full product details, automated code analysis report, reviews, changelog.
- **POST** \`/products/{id}/like\` : Toggle like / dislike.
- **POST** \`/products/{id}/reviews\` : Submit rating and comment (Verified purchasers only).

### 3. Payment & Mobile Money Endpoints
- **POST** \`/payments/momo/initiate\` : Start MTN MoMo / Airtel Money payment in Rwanda.
- **POST** \`/payments/momo/webhook\` : Webhook callback from MTN / Airtel (HMAC SHA256 validated).
- **POST** \`/payments/stripe/create-session\` : International credit card checkout.

### 4. License & Download Gateway Endpoints
- **POST** \`/licenses/verify\` : Verify license key validity for domain activation.
- **POST** \`/licenses/request-download-token\` : Generates a single-use signed download token.
- **GET** \`/downloads/gateway\` : Protected stream delivering watermarked archive with injected Copyright footer.`
  },

  {
    id: 'install-guide',
    name: 'Guide d\'Installation Production',
    category: 'install-guide',
    title: 'Step-by-Step Server Requirements & Production Deployment Guide',
    filename: 'INSTALLATION_MANUAL.md',
    language: 'markdown',
    content: `# GUIDE D'INSTALLATION PRODUCTION VITECH SCRIPTS (PHP 8.4 / MySQL 8)

### 1. Prérequis Serveur
- **Système d'exploitation** : Ubuntu 22.04 LTS / 24.04 LTS ou Cloud Host (cPanel, AWS, DigitalOcean, Hetzner).
- **PHP** : PHP 8.2 ou PHP 8.4+ avec extensions : \`pdo_mysql\`, \`curl\`, \`mbstring\`, \`openssl\`, \`zip\`, \`gd\`, \`bcmath\`.
- **Base de données** : MySQL 8.0+ ou MariaDB 10.11+.
- **Serveur Web** : Nginx ou Apache 2.4 avec \`mod_rewrite\`.
- **Gestionnaires** : Composer v2+ & Node.js 20+ (pour SCSS build).

### 2. Déploiement étape par étape
\`\`\`bash
# 1. Cloner ou uploader l'archive
git clone https://github.com/vitech-africa/vitech-scripts.git /var/www/vitech-scripts
cd /var/www/vitech-scripts

# 2. Installer les dépendances PHP
composer install --no-dev --optimize-autoloader

# 3. Configurer l'environnement
cp .env.example .env
nano .env

# 4. Importer la base de données
mysql -u root -p vitech_scripts_db < sql/vitech_scripts_schema.sql

# 5. Configurer les permissions d'écriture
chmod -R 775 storage/ uploads/ temp/
chown -R www-data:www-data /var/www/vitech-scripts
\`\`\`

### 3. Configuration Nginx Recommandée
\`\`\`nginx
server {
    listen 80;
    server_name scripts.vitechafrica.com;
    root /var/www/vitech-scripts/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
    }

    location ~ /\. {
        deny all;
    }
}
\`\`\``
  },

  {
    id: 'security-audit-doc',
    name: 'Checklist d\'Audit de Sécurité',
    category: 'security',
    title: 'OWASP Top 10 Security Audit Checklist & Hardening Guide',
    filename: 'SECURITY_AUDIT_CHECKLIST.md',
    language: 'markdown',
    content: `# CHECKLIST D'AUDIT DE SÉCURITÉ VITECH SCRIPTS

### 1. Protection contre les Injections SQL
- [x] Toutes les requêtes PDO utilisent des requêtes préparées avec typage strict des paramètres.
- [x] Aucun \`$query = "SELECT ... " . $_GET['id']\` dans tout le codebase.

### 2. Protection contre les Failles XSS
- [x] Tout contenu utilisateur dynamique est échappé via \`htmlspecialchars($var, ENT_QUOTES | ENT_HTML5, 'UTF-8')\`.
- [x] Headers HTTP Content-Security-Policy (CSP) stricts.

### 3. CSRF & Validation de Requêtes
- [x] Jeton CSRF généré par session et injecté dans chaque formulaire POST/PUT/DELETE.
- [x] Validation de l'idempotence des requêtes sur les webhooks de paiement.

### 4. Authentification & Mot de Passe
- [x] Hachage des mots de passe avec \`password_hash($pwd, PASSWORD_BCRYPT, ['cost' => 12])\`.
- [x] Tokens JWT signés en HS256 / RS256 avec date d'expiration courte (1 heure) et Refresh Token sécurisé.

### 5. Passerelle de Téléchargement & Protection du Code Source
- [x] Aucun accès direct aux dossiers contenant les fichiers ZIP (en dehors de public_html).
- [x] Téléchargement protégé par jeton signé à usage unique.
- [x] Injection automatique de la mention de droit d'auteur : \`Copyright © Vab & Idriss (Vitech Africa)\`.
- [x] Tatouage numérique (Watermark) de l'acheteur dans les métadonnées de l'archive.`
  }
];
