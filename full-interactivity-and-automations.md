# Project Plan: Full Button Interactivity, Real Automations & Universal Responsiveness

## 🎯 Objectives
Make 100% of buttons, table action links, search bars, filter tabs, and modal triggers fully clickable and functional across the N'Tandinho ERP, connecting them to real state automations in `useErpStore`, with 100% device responsiveness (Mobile, Tablet, Desktop), while **preserving 100% of the current visual design**.

## 📑 Task Breakdown

### Phase 1: State Management & Automations (`useErpStore.ts`)
- [ ] Add mutation methods to `useErpStore.ts`:
  - `addTrip(tripData)`
  - `updateTripStatus(tripId, status)`
  - `addBooking(bookingData)`
  - `addQuotation(quotationData)`
  - `addVehicle(vehicleData)`
  - `addDriver(driverData)`
  - `addInvoice(invoiceData)`
  - `updateInvoiceStatus(invoiceId, status)`
  - `updateCompanyProfile(profileData)`

### Phase 2: Global Header, Modals & Search (`Header.tsx`, `QuickActionModal.tsx`, `GlobalSearchModal.tsx`, `EditProfileModal.tsx`)
- [ ] Make "+ Criar" / "Despacho Rápido" button open `QuickActionModal` with working form actions for Trip, Booking, Vehicle, Invoice.
- [ ] Make `GlobalSearchModal` clickable: clicking a search result navigates to the item page.
- [ ] Make `EditProfileModal` save profile data to `useUserProfileStore` with success toast.
- [ ] Make Notification drawer items clickable with "Mark as read" & "Clear all" actions.

### Phase 3: Page-Level Button Interactivity & Forms
- [ ] **Dashboard (`DashboardPage.tsx`)**:
  - Filter buttons ("Hoje", "Esta Semana", "Este Mês") filter KPIs dynamically.
  - Table row actions ("Ver Detalhes", "Aprovar Cotação", "Gerar Guia", "Despachar Viagem") execute real store updates.
- [ ] **Operations (`OperationsPage.tsx`)**:
  - "+ Nova Viagem", "+ Nova Reserva", "+ Nova Cotação" open interactive forms adding data to `useErpStore`.
  - Trip status actions ("Iniciar Viagem", "Concluir", "Cancelar") mutate trip state in real-time.
- [ ] **Fleet (`FleetPage.tsx` & `DriversAndTeamPage.tsx`)**:
  - "+ Adicionar Viatura", "Registar Manutenção", "+ Adicionar Motorista" modals with form validation.
  - Odometer & status updates.
- [ ] **Finance (`FinancePage.tsx`)**:
  - "+ Emitir Factura" modal and "Marcar como Pago" toggle.
- [ ] **Settings (`SettingsPage.tsx`)**:
  - "Guardar Alterações" updates company details in `useErpStore`.

### Phase 4: Device Responsiveness Audit
- [ ] Verify touch-scrolling containers on all data tables (`overflow-x-auto custom-scrollbar`).
- [ ] Verify mobile dialog scaling (`max-h-[90vh] overflow-y-auto`).
- [ ] Verify action bar wrapping (`flex-wrap`).

### Phase 5: Verification & Quality Assurance
- [ ] Run TypeScript compilation: `npm --prefix admin run build`.
- [ ] Manual test of all modal forms, button actions, and responsive breakpoints.
