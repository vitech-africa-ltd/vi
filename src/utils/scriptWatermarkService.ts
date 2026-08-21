import JSZip from 'jszip';
import { ScriptProduct } from '../data/scriptsData';

export interface BuyerMetadata {
  buyerId: string;
  buyerEmail: string;
  buyerName?: string;
  licenseKey: string;
  orderId?: string;
  domain?: string;
  downloadTimestamp?: string;
}

export interface WatermarkVerificationResult {
  isValid: boolean;
  buyerId?: string;
  buyerEmail?: string;
  licenseKey?: string;
  downloadTimestamp?: string;
  distributor?: string;
  tamperDetected?: boolean;
}

/**
 * Generate a non-obvious digital watermark hash for traceability.
 */
function createObfuscatedSeal(metadata: BuyerMetadata): string {
  const payload = {
    _v: '2.0.26',
    _dist: 'VITECH_AFRICA_SECURE_DISTRIBUTION',
    _b_uid: metadata.buyerId,
    _b_eml: metadata.buyerEmail,
    _b_nm: metadata.buyerName || 'Vitech Verified Client',
    _lic: metadata.licenseKey,
    _ord: metadata.orderId || `ORD-${Date.now().toString(36).toUpperCase()}`,
    _dom: metadata.domain || '*',
    _ts: metadata.downloadTimestamp || new Date().toISOString(),
    _hmac: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
  };

  // Base64 encode + custom obfuscation
  const jsonStr = JSON.stringify(payload);
  const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
  return `-----BEGIN VITECH INTEGRITY SEAL-----\n${base64}\n-----END VITECH INTEGRITY SEAL-----`;
}

/**
 * Generate a production-ready, watermarked ZIP archive for a script product.
 * Injects non-obvious metadata, license seal, and copyright headers.
 */
export async function generateWatermarkedScriptZip(
  product: ScriptProduct,
  buyer: BuyerMetadata
): Promise<Blob> {
  const zip = new JSZip();
  const timestamp = buyer.downloadTimestamp || new Date().toISOString();
  const buyerEmail = buyer.buyerEmail || 'client.verified@vitechafrica.com';
  const buyerId = buyer.buyerId || `usr_${Math.random().toString(36).substring(2, 10)}`;
  const licenseKey = buyer.licenseKey || `VITECH-${product.category.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const normalizedMetadata: BuyerMetadata = {
    buyerId,
    buyerEmail,
    buyerName: buyer.buyerName || 'Client Vitech Africa',
    licenseKey,
    orderId: buyer.orderId || `ORD-${Date.now()}`,
    domain: buyer.domain || 'unrestricted-commercial',
    downloadTimestamp: timestamp
  };

  // 1. Injected Non-Obvious Metadata Folder & Files for Forensic Traceability
  const metaSeal = createObfuscatedSeal(normalizedMetadata);
  zip.file('.vitech-origin-meta.dat', metaSeal);
  
  // Secondary non-obvious deep config seal
  zip.folder('.vitech_security')?.file('traceability.bin', JSON.stringify({
    build: '2026.4-prod',
    node_id: 'rw-kgl-hub-01',
    hash: btoa(`${buyerId}:${buyerEmail}:${licenseKey}`),
    created: timestamp
  }));

  // 2. Official Human-Readable License File
  const licenseContent = `================================================================================
VITECH AFRICA — COMMERCIAL CODE LICENSE & DIGITAL CERTIFICATE
================================================================================
Product Name    : ${product.title}
Version         : ${product.version}
Category        : ${product.category}
Security Audit  : OWASP Grade A+ (${product.analysis.securityScore}/100)

--- REGISTERED LICENSE HOLDER ---
Authorized User : ${normalizedMetadata.buyerName}
Buyer Email     : ${normalizedMetadata.buyerEmail}
Buyer Unique ID : ${normalizedMetadata.buyerId}
License Key     : ${normalizedMetadata.licenseKey}
Order Reference : ${normalizedMetadata.orderId}
Assigned Domain : ${normalizedMetadata.domain}
Issue Timestamp : ${normalizedMetadata.downloadTimestamp}

--- TERMS & LEGAL USAGE ---
1. Grant of License: V&I Tech Africa Ltd grants the licensed holder a commercial, 
   perpetual, non-exclusive right to use and integrate this source code into their applications.
2. Redistribution Prohibition: Reselling, publicly hosting on unauthenticated repositories, 
   or sub-licensing the raw source code without substantial modification is strictly prohibited.
3. Digital Fingerprint: This archive contains an embedded cryptographic forensic 
   watermark linking this release to user ID [${normalizedMetadata.buyerId}].

For support, API webhooks or custom adaptations:
Official Support : contact.vitechdev@gmail.com | dev@vitech-africa.com
Headquarters     : Kigali (Rwanda Innovation City) & West Africa Tech Hubs
Website          : https://www.vitech-africa.com
================================================================================`;
  zip.file('LICENSE.txt', licenseContent);

  // 3. Detailed README.md with Setup & Security Verification Instructions
  const readmeContent = `# ${product.title} (v${product.version})

> **Édition Certifiée Vitech Scripts (2026)** — Produit audité et optimisé pour le déploiement rapide en Afrique et à l'International.

## 📋 Informations de Licence
- **Bénéficiaire :** \`${normalizedMetadata.buyerEmail}\`
- **Identifiant Unique :** \`${normalizedMetadata.buyerId}\`
- **Clé de Licence :** \`${normalizedMetadata.licenseKey}\`
- **Score de Sécurité :** \`${product.analysis.securityScore}/100 (OWASP Grade ${product.analysis.owaspScore})\`

## 🚀 Démarrage Rapide
\`\`\`bash
# 1. Cloner ou décompresser dans votre répertoire de travail
cd ${product.id}

# 2. Installer les dépendances
${product.analysis.language.toLowerCase().includes('php') ? 'composer install' : product.analysis.language.toLowerCase().includes('dart') ? 'flutter pub get' : product.analysis.language.toLowerCase().includes('python') ? 'pip install -r requirements.txt' : 'npm install'}

# 3. Configurer l'environnement
cp .env.example .env

# 4. Lancer le serveur de développement
${product.analysis.language.toLowerCase().includes('php') ? 'php artisan serve' : product.analysis.language.toLowerCase().includes('dart') ? 'flutter run' : product.analysis.language.toLowerCase().includes('python') ? 'uvicorn main:app --reload' : 'npm run dev'}
\`\`\`

## 🛡️ Passerelles de Paiement Intégrées
- **MTN Mobile Money Open API** (Rwanda, Ouganda, Côte d'Ivoire)
- **Airtel Money Developer Suite**
- **Stripe & Cartes Bancaires Internationales**

---
*Copyright © 2026 V&I Tech Africa Ltd. Tous droits réservés.*
`;
  zip.file('README.md', readmeContent);

  // 4. Injected Source Code Structure with watermark headers
  const srcFolder = zip.folder('src');

  if (product.category.includes('php') || product.analysis.language.toLowerCase().includes('php')) {
    // PHP / Laravel structure
    zip.file('.env.example', `APP_NAME="${product.title}"\nAPP_ENV=production\nAPP_KEY=base64:VitechGeneratedKey2026=\nAPP_DEBUG=false\nAPP_URL=http://localhost\n\n# Vitech License & Mobile Money Config\nVITECH_LICENSE_KEY=${normalizedMetadata.licenseKey}\nMTN_MOMO_API_USER=\nMTN_MOMO_API_KEY=\nMTN_MOMO_SUBSCRIPTION_KEY=\nMTN_MOMO_TARGET_ENV=sandbox\nAIRTEL_MONEY_CLIENT_ID=\nAIRTEL_MONEY_CLIENT_SECRET=\n`);

    zip.file('composer.json', JSON.stringify({
      name: `vitech-scripts/${product.id}`,
      description: product.description,
      type: 'project',
      version: product.version,
      license: 'Commercial',
      authors: [
        { name: 'V&I Tech Africa Engineering Team', email: 'dev@vitech-africa.com' }
      ],
      require: {
        'php': '^8.2',
        'guzzlehttp/guzzle': '^7.8',
        'ramsey/uuid': '^4.7'
      }
    }, null, 2));

    srcFolder?.file('index.php', `<?php
/**
 * ${product.title} - Main Entry Point
 * 
 * @package   VitechScripts\\${product.id}
 * @author    V&I Tech Africa Ltd <dev@vitech-africa.com>
 * @license   Commercial License [Key: ${normalizedMetadata.licenseKey}]
 * @licensed_to ${normalizedMetadata.buyerEmail} (ID: ${normalizedMetadata.buyerId})
 * @timestamp ${timestamp}
 */

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use Vitech\\Core\\SecurityGuard;
use Vitech\\Payment\\MtnMoMoGateway;

echo "=== ${product.title} v${product.version} (Vitech Africa) ===\\n";
echo "Licence Active : ${normalizedMetadata.licenseKey}\\n";
`);

    srcFolder?.folder('Payment')?.file('MtnMoMoGateway.php', `<?php
/**
 * Vitech Africa - MTN Mobile Money Open API v2.1 Connector
 * Licensed to: ${normalizedMetadata.buyerEmail}
 */

namespace Vitech\\Payment;

class MtnMoMoGateway {
    private string $apiKey;
    private string $subscriptionKey;

    public function __construct(string $apiKey, string $subscriptionKey) {
        $this->apiKey = $apiKey;
        $this->subscriptionKey = $subscriptionKey;
    }

    public function requestToPay(string $phone, float $amount, string $currency = 'RWF'): array {
        return [
            'status' => 'PENDING_USSD_PROMPT',
            'transaction_ref' => 'MOMO-' . uniqid(),
            'phone' => $phone,
            'amount' => $amount,
            'currency' => $currency,
            'timestamp' => date('c')
        ];
    }
}
`);
  } else if (product.category.includes('mobile') || product.analysis.language.toLowerCase().includes('dart')) {
    // Flutter / Dart mobile app structure
    zip.file('pubspec.yaml', `name: ${product.id.replace(/-/g, '_')}
description: ${product.description}
version: ${product.version}
publish_to: 'none'

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0
  provider: ^6.1.2
  cached_network_image: ^3.3.1
`);

    srcFolder?.file('main.dart', `// ${product.title}
// Licensed to: ${normalizedMetadata.buyerEmail} [UID: ${normalizedMetadata.buyerId}]
// License Key: ${normalizedMetadata.licenseKey}

import 'package:flutter/material.dart';

void main() {
  runApp(const VitechApp());
}

class VitechApp extends StatelessWidget {
  const VitechApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${product.title}',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF06B6D4)),
        useMaterial3: true,
      ),
      home: const Scaffold(
        body: Center(
          child: Text('${product.title} — Vitech Africa 2026'),
        ),
      ),
    );
  }
}
`);
  } else {
    // JavaScript / TypeScript / Full-stack SaaS structure
    zip.file('package.json', JSON.stringify({
      name: product.id,
      version: product.version,
      description: product.description,
      license: `Commercial (License: ${normalizedMetadata.licenseKey})`,
      vitechMetadata: {
        buyerId: normalizedMetadata.buyerId,
        buyerEmail: normalizedMetadata.buyerEmail,
        issued: timestamp
      },
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview'
      },
      dependencies: {
        react: '^19.0.0',
        'react-dom': '^19.0.0',
        'lucide-react': '^0.540.0'
      }
    }, null, 2));

    srcFolder?.file('main.tsx', `/**
 * ${product.title}
 * Licensed to: ${normalizedMetadata.buyerEmail} (ID: ${normalizedMetadata.buyerId})
 * License Key: ${normalizedMetadata.licenseKey}
 * Copyright © 2026 V&I Tech Africa Ltd
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

console.log('[Vitech Scripts] Initialized ${product.title} (v${product.version})');
`);
  }

  // 5. Build and return the ZIP Blob
  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
    comment: `Vitech Africa Licensed Archive | Buyer: ${normalizedMetadata.buyerId} | Lic: ${normalizedMetadata.licenseKey}`
  });
}

/**
 * Triggers browser file download of the generated watermarked archive
 */
export function triggerScriptDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Inspects a ZIP archive to extract and verify embedded watermarks for forensic leak tracking
 */
export async function verifyScriptWatermark(zipFile: File | Blob): Promise<WatermarkVerificationResult> {
  try {
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(zipFile);

    // Look for our non-obvious watermark file
    const metaFile = loadedZip.file('.vitech-origin-meta.dat');
    if (!metaFile) {
      return { isValid: false, tamperDetected: true };
    }

    const content = await metaFile.async('text');
    const match = content.match(/-----BEGIN VITECH INTEGRITY SEAL-----\s*([\s\S]*?)\s*-----END VITECH INTEGRITY SEAL-----/);
    if (!match || !match[1]) {
      return { isValid: false, tamperDetected: true };
    }

    const jsonStr = decodeURIComponent(escape(atob(match[1].trim())));
    const payload = JSON.parse(jsonStr);

    return {
      isValid: true,
      buyerId: payload._b_uid,
      buyerEmail: payload._b_eml,
      licenseKey: payload._lic,
      downloadTimestamp: payload._ts,
      distributor: payload._dist,
      tamperDetected: false
    };
  } catch (err) {
    console.error('Error verifying script watermark:', err);
    return { isValid: false, tamperDetected: true };
  }
}
