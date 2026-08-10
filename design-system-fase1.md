# Plan: FASE 1 — Design System N'Tandinho Transportes S.A.

## 🎯 Objective
Establish the global Design System for N'Tandinho Transportes S.A. based on the official reference image without altering existing page layouts, database schemas, authentication, or business logic.

## 🎨 Global Tokens Architecture
- **Primary Accent**: Golden Yellow (`#F6A823`)
- **Primary Hover**: Golden Yellow Dark (`#D08500`)
- **Primary Soft**: `rgba(246, 168, 35, 0.15)`
- **Navy Structural**: `#0B132B`
- **Navy Dark**: `#070D1F`
- **Navy Secondary**: `#111D33`
- **Blue**: `#16223B`
- **Blue Support**: `#1E3A8A`
- **Semantics**:
  - Success: `#16A34A`
  - Warning: `#F59E0B`
  - Danger: `#EF4444`
  - Info: `#0EA5E9`

## 🌗 Dual-Theme Specifications

### 1. Dark Mode (`html.dark`)
- `background`: `#0B132B`
- `surface`: `#111D33`
- `surface-hover`: `#16223B`
- `border`: `#1C2A48`
- `text-primary`: `#FFFFFF`
- `text-secondary`: `#94A3B8`
- `text-muted`: `#64748B`

### 2. Light Mode (`:root`)
- `background`: `#F8FAFC`
- `surface`: `#FFFFFF`
- `surface-hover`: `#F1F5F9`
- `border`: `#E2E8F0`
- `text-primary`: `#0B132B`
- `text-secondary`: `#64748B`
- `text-muted`: `#94A3B8`

## 📋 Components Verification Matrix
- [x] `index.css` global CSS tokens
- [x] `tailwind.config.ts` extended color mappings
- [x] `tokens.ts` TypeScript constants export
- [x] Layout (`AdminLayout`, `Sidebar`, `Header`, `PageHeader`)
- [x] UI primitives (`Button`, `Card`, `MetricCard`, `DataTable`, `StatusBadge`, `Input`, `Modal`, `DetailDrawer`, `Pagination`)
- [x] Theme state synchronization (`useAppStore`, `localStorage`)

## ⚡ Verification & Build Plan
- Execute TypeScript check: `tsc --noEmit`
- Execute Vite Production Build: `npm --prefix admin run build`
