# Bugfix Plan: Fix Sidebar Layout Overlap & Route Path Mismatch

## 🎯 Root Cause Analysis
1. **Layout Overlap Bug**: `Sidebar` container was positioned with `fixed top-0 left-0` instead of a flex `sticky top-0 shrink-0` layout item inside `AdminLayout`. This caused the main content container to take 100% screen width and slide directly underneath the sidebar, corrupting page grids and making header/cards misaligned.
2. **URL Path Mismatch Bug**: Navigation items used hardcoded `/admin/` prefixes (e.g., `/admin/fleet`) while `BrowserRouter` was already configured with `basename="/admin"`. This resulted in duplicate URL resolution (`/admin/admin/fleet`), breaking router matching and causing pages to show blank/corrupted states.

## 🛠️ Proposed Solution
1. **Refactor `Sidebar.tsx` Layout Container**:
   - Change container to `sticky top-0 left-0 h-screen shrink-0` so flexbox allocates exact sidebar width (`w-64` or `w-20`) cleanly.
   - Maintain mobile drawer overlay for small screens.
2. **Correct All Navigation Paths**:
   - Map all routes to relative basename paths: `/`, `/operations`, `/fleet`, `/drivers-team`, `/crm`, `/finance`, `/reports`, `/documents`, `/audit-logs`, `/settings`.
   - Restore full submenu navigation links (*Viagens*, *Reservas*, *Agenda*, *Viaturas*, *Motoristas*, *Manutenção*, *Clientes*, *Cotações*, *Serviços*, *Rotas*, *Facturas*, *Utilizadores*, *Permissões*, *Actividade*, *Definições*).
3. **Harmonize Re-exports**:
   - Ensure both `admin/src/components/layout/Sidebar.tsx` and `admin/src/shared/layouts/Sidebar.tsx` export the same unified component.

## ⚡ Verification Plan
- Run TypeScript compilation check (`tsc`).
- Run Vite production build (`vite build`).
- Verify all routes, buttons, cards, and mode toggles function with 100% layout fidelity.
