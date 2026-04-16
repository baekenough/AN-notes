[한국어](README.md) | [English](README.en.md) | [Español](README.es.md)

---

# AI Native Notes

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![License](https://img.shields.io/badge/License-MIT-green)

Una guía comunitaria para usar herramientas de codificación con IA correctamente

**Sitio en vivo**: https://annotes.baekenough.com

![AI Native Notes Screenshot](docs/screenshot.png)

---

## ¿Qué es AI Native Notes?

AI Native Notes está inspirado en PyCon. Así como PyCon es un espacio de encuentro para la comunidad Python, AI Native Notes es una colección de guías prácticas para cualquier persona que quiera usar las herramientas de codificación con IA de manera efectiva.

Claude Code, GPT Codex, Gemini CLI — encuentra consejos del mundo real para cada herramienta en un solo lugar. Creado no solo para desarrolladores, sino para todos los que quieran aprovechar las herramientas de IA en su trabajo.

---

## Herramientas Disponibles

| Herramienta | Consejos | Estado |
|-------------|----------|--------|
| Claude Code (Anthropic) | 14 | Activo |
| GPT Codex (OpenAI) | 21 | Activo |
| Gemini CLI (Google) | 14 | Activo |

---

## Características Principales

- **49 consejos prácticos** — cada uno con nivel de dificultad, tiempo de lectura y conexiones entre herramientas
- **3 idiomas** — coreano, inglés, español (chino y japonés planificados)
- **Conexiones entre herramientas** — los consejos enlazan a guías relacionadas en otras herramientas
- **What's New** — destacados de las funciones más importantes por herramienta
- **Detección de idioma del navegador** — enrutamiento automático por idioma
- **Tema oscuro** — tipografía Geist
- **Diseño responsive mobile-first** — desde Z Flip 6 hasta tablets de 11"

---

## Primeros Pasos

### Requisitos Previos

- Node.js 22 o superior
- npm

### Instalación y Ejecución

```bash
git clone https://github.com/baekenough/AN-notes.git
cd AN-notes
npm install
npm run dev
```

Abre http://localhost:3000 en tu navegador.

### Estructura del Contenido

```
content/
  {locale}/         # ko | en | es
    {tool}/         # claude-code | gpt-codex | gemini-cli
      {slug}.mdx
```

---

## Agregar Contenido

Para agregar un nuevo consejo, crea un archivo MDX para cada idioma con el siguiente frontmatter:

```yaml
---
title: "Título del consejo"
description: "Resumen en una línea"
tool: claude-code          # claude-code | gpt-codex | gemini-cli
difficulty: beginner       # beginner | intermediate | advanced
readingTime: 5             # minutos
tags: [claude, workflow]
relatedTips:
  - tool: gpt-codex
    slug: agents-md
connections:
  - tool: gemini-cli
    slug: getting-started
    reason: "Enfoque similar de archivo de configuración"
---
```

---

## Despliegue

Despliegue en producción con Docker:

```bash
# Construir la imagen
docker build -t ai-native-notes .

# Ejecutar el contenedor
docker run -p 3000:3000 ai-native-notes
```

HTTPS se gestiona mediante Cloudflare Tunnel.

---

## Contribuir

Los nuevos consejos, mejoras de traducción y correcciones de errores son bienvenidos.

1. Haz un fork de este repositorio
2. Crea una rama: `feature/nombre-de-tu-consejo`
3. Confirma tus cambios: `feat: add new tip for claude-code`
4. Abre un Pull Request

Para sugerencias de consejos o comentarios, abre un issue.

---

## Licencia

[MIT](LICENSE) — Copyright (c) 2026 baekenough

---

## Enlaces

- Sitio en vivo: https://annotes.baekenough.com
- GitHub: https://github.com/baekenough/AN-notes
