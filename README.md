# Vulturus Prueba 1

> Proyecto de Pasarela de Pagos con Node.js + Express + TypeScript

## metadata

| Campo | Valor |
|-------|-------|
| **Nombre** | Vulturus Prueba 1 |
| **Objetivo** | Integrar pasarela de pagos con modo sandbox |
| **Stack** | Node.js + Express + TypeScript + Stripe |
| **Versión** | 1.0.0 |
| **Estado** | En desarrollo |

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-------------|---------|
| Runtime | Node.js | 20.x |
| API | Express | 4.x |
| Lenguaje | TypeScript | 5.x |
| Pasarela | Stripe | latest |
| Testing | Jest + Supertest | latest |
| Deployment | Docker + K8s | latest |

## Getting Started

```bash
# Clonar el proyecto
git clone https://github.com/user/vulturus-prueba-1.git
cd vulturus-prueba-1

# Instalar dependencias
npm install

# Configurar variables
cp .env.example .env
# Editar .env con tus keys de Stripe sandbox

# Desarrollo
npm run dev

# Tests
npm test

# Build
npm run build
```

## Documentación del Proyecto

| Sección | Archivo |
|---------|---------|
| Requerimientos | /docs/requerimientos.md |
| Arquitectura | /docs/arquitectura.md |
| API Reference | /docs/api.md |
| Base de datos | /docs/database.md |
| Seguridad | /docs/seguridad.md |
| Testing | /docs/testing.md |
| Deployment | /docs/deployment.md |
| Operaciones | /docs/runbook.md |

## Checklist de inicio

- [ ] Configurar Stripe keys en .env
- [ ] Verificar npm install
- [ ] Correr npm run dev
- [ ] Correr pruebas localmente
- [ ] Configurar Docker
- [ ] Configurar CI/CD

---

*Vulturus Prueba 1 - Proyecto de Pasarela de Pagos*
*Creado: 2026-05-04*