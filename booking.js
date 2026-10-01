(() => {
  const whatsappNumber = '919179480342';
  const contextLabels = {
    route: 'Route',
    vehicle: 'Vehicle',
    package: 'Package'
  };

  function formatContext(service, details = {}) {
    return [
      service || 'Cab booking',
      ...Object.entries(contextLabels)
        .filter(([key]) => details[key])
        .map(([key, label]) => `${label}: ${details[key]}`)
    ].join(' | ');
  }

  function applyBookingDetails(service, details = {}) {
    const serviceField = document.getElementById('bookService');
    serviceField.value = formatContext(service, details);

    const vehicleField = document.getElementById('bookVehicle');
    if (details.vehicle && vehicleField) {
      const vehicleName = details.vehicle.toLowerCase();
      const matchingOption = Array.from(vehicleField.options).find((option) =>
        option.value && option.textContent.toLowerCase().includes(vehicleName)
      );
      if (matchingOption) vehicleField.value = matchingOption.value;
    }

    const dropField = document.getElementById('bookDrop');
    if (details.drop && dropField) dropField.value = details.drop;
  }

  window.startBooking = function (service = 'Cab booking', details = {}) {
    const serviceField = document.getElementById('bookService');
    const bookingSection = document.getElementById('booking');

    if (serviceField && bookingSection) {
      applyBookingDetails(service, details);
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.getElementById('bookPickup').focus({ preventScroll: true });
      return;
    }

    const params = new URLSearchParams({ service });
    Object.entries(details).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    window.location.href = `index.html?${params.toString()}#booking`;
  };

  function createCardBookingDialog() {
    const style = document.createElement('style');
    style.textContent = `
      .card-booking-dialog {
        --booking-motion: cubic-bezier(0.2, 0.8, 0.2, 1);
        position: fixed;
        top: 50%;
        left: 50%;
        width: min(420px, calc(100% - 32px));
        max-height: calc(100vh - 32px);
        max-height: calc(100dvh - 32px);
        margin: 0;
        padding: 0;
        border: 0;
        border-radius: 18px;
        color: #1C1A15;
        background: #FFFFFF;
        box-shadow: 0 28px 88px rgba(15, 13, 10, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.6);
        overflow-y: auto;
        opacity: 0;
        transform: translate(-50%, -46%) scale(0.97);
        transition: opacity 220ms var(--booking-motion), transform 280ms var(--booking-motion), display 280ms allow-discrete, overlay 280ms allow-discrete;
      }
      .card-booking-dialog[open] {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      .card-booking-dialog::before {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        border-radius: 18px 18px 0 0;
        background: linear-gradient(90deg, #D98F00, #F5A800);
        content: '';
        pointer-events: none;
      }
      .card-booking-dialog::backdrop {
        background: rgba(15, 13, 10, 0);
        backdrop-filter: blur(0);
        transition: background 220ms ease, backdrop-filter 220ms ease, display 280ms allow-discrete, overlay 280ms allow-discrete;
      }
      .card-booking-dialog[open]::backdrop {
        background: rgba(15, 13, 10, 0.58);
        backdrop-filter: blur(4px);
      }
      @starting-style {
        .card-booking-dialog[open] { opacity: 0; transform: translate(-50%, -46%) scale(0.97); }
        .card-booking-dialog[open]::backdrop { background: rgba(15, 13, 10, 0); backdrop-filter: blur(0); }
      }
      .card-booking-form { display: grid; gap: 18px; padding: 28px 26px 24px; background: #FFFFFF; }
      .card-booking-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
      .card-booking-header h2 { margin: 0; color: #0F0D0A; font: 700 22px/1.2 'Outfit', sans-serif; }
      .card-booking-summary { margin: 8px 0 0; padding: 10px 12px; border-left: 3px solid #F5A800; border-radius: 0 8px 8px 0; background: #FFF5D6; color: #5A5548; font: 13px/1.5 'Inter', sans-serif; overflow-wrap: anywhere; }
      .card-booking-close { width: 36px; height: 36px; flex: 0 0 36px; border: 1px solid #EEEAE0; border-radius: 10px; background: #FAFAF7; color: #5A5548; font-size: 20px; line-height: 1; cursor: pointer; transition: background 160ms ease, color 160ms ease, transform 160ms ease; }
      .card-booking-close:hover { background: #F5A800; color: #0F0D0A; transform: rotate(4deg); }
      .card-booking-field { display: grid; gap: 7px; }
      .card-booking-field label { color: #5A5548; font: 700 12px 'Inter', sans-serif; }
      .card-booking-field input { width: 100%; min-height: 46px; padding: 11px 12px; border: 1px solid #DDD7CA; border-radius: 10px; background: #FAFAF7; color: #1C1A15; font: 14px 'Inter', sans-serif; transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease; }
      .card-booking-field input:focus { outline: none; border-color: #D98F00; background: #FFFFFF; box-shadow: 0 0 0 3px rgba(245, 168, 0, 0.16); }
      .card-booking-actions { display: flex; justify-content: flex-end; gap: 9px; margin-top: 2px; }
      .card-booking-actions button { min-height: 44px; padding: 10px 16px; border: 1px solid #EEEAE0; border-radius: 10px; font: 700 13px 'Inter', sans-serif; cursor: pointer; transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease; }
      .card-booking-actions button:hover { transform: translateY(-1px); box-shadow: 0 5px 16px rgba(15, 13, 10, 0.1); }
      .card-booking-actions button:focus-visible, .card-booking-close:focus-visible { outline: 2px solid #D98F00; outline-offset: 2px; }
      .card-booking-cancel { background: #FFFFFF; color: #5A5548; }
      .card-booking-cancel:hover { background: #FAFAF7; }
      .card-booking-submit { border-color: #F5A800 !important; background: #F5A800; color: #0F0D0A; }
      .card-booking-submit:hover { background: #D98F00; }
      @media (max-width: 600px) {
        .card-booking-form { gap: 15px; padding: 24px 20px 20px; }
        .card-booking-header h2 { font-size: 20px; }
        .card-booking-actions { display: grid; grid-template-columns: 1fr; }
      }
      @media (max-width: 760px) {
        .card-booking-field input { font-size: 16px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .card-booking-dialog, .card-booking-dialog::backdrop, .card-booking-close, .card-booking-field input, .card-booking-actions button { transition-duration: 0.01ms; }
      }
    `;
    document.head.appendChild(style);

    const dialog = document.createElement('dialog');
    dialog.className = 'card-booking-dialog';
    dialog.setAttribute('aria-labelledby', 'cardBookingTitle');
    dialog.innerHTML = `
      <form class="card-booking-form" id="cardBookingForm">
        <div class="card-booking-header">
          <div>
            <h2 id="cardBookingTitle">Complete your booking</h2>
            <p class="card-booking-summary" id="cardBookingSummary"></p>
          </div>
          <button class="card-booking-close" type="button" aria-label="Close booking dialog">×</button>
        </div>
        <div class="card-booking-field">
          <label for="cardBookingPhone">Phone number</label>
          <input id="cardBookingPhone" name="phone" type="tel" autocomplete="tel" placeholder="+91 98765 43210" required>
        </div>
        <div class="card-booking-field">
          <label for="cardBookingDate">Pickup date</label>
          <input id="cardBookingDate" name="date" type="date" required>
        </div>
        <div class="card-booking-actions">
          <button class="card-booking-cancel" type="button">Cancel</button>
          <button class="card-booking-submit" type="submit">Continue to WhatsApp</button>
        </div>
      </form>
    `;
    document.body.appendChild(dialog);

    const form = dialog.querySelector('#cardBookingForm');
    const closeDialog = () => dialog.close();
    dialog.querySelector('.card-booking-close').addEventListener('click', closeDialog);
    dialog.querySelector('.card-booking-cancel').addEventListener('click', closeDialog);
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog();
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const fields = new FormData(form);
      const pickupDate = new Date(`${fields.get('date')}T00:00:00`);
      const selectedDetails = dialog.dataset.bookingDetails || '';
      const message = [
        'Hi, I would like to book this option.',
        selectedDetails,
        `Phone number: ${fields.get('phone')}`,
        `Pickup date: ${pickupDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
      ].filter(Boolean).join('\n');

      window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    });

    return dialog;
  }

  function getCardBookingDetails(button) {
    const card = button.closest('.fleet-card, .route-card, .svc-card');
    if (!card) return null;

    const getText = (selector) => card.querySelector(selector)?.textContent.replace(/\s+/g, ' ').trim();
    const getList = (selector) => Array.from(card.querySelectorAll(selector), (item) => item.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean);

    if (card.matches('.fleet-card')) {
      const details = [
        `Vehicle: ${getText('.fleet-name') || 'Fleet vehicle'}`,
        getText('.fleet-cat') && `Category: ${getText('.fleet-cat')}`,
        getText('.fleet-price-section, .fleet-price-block') && `Rate: ${getText('.fleet-price-section, .fleet-price-block')}`,
        getList('.fleet-feat, .fleet-spec').length && `Features: ${getList('.fleet-feat, .fleet-spec').join(', ')}`
      ].filter(Boolean);
      return details;
    }

    if (card.matches('.route-card')) {
      const details = [
        (getText('.route-from-to, .route-dest-line')) && `Route: ${getText('.route-from-to, .route-dest-line')}`,
        (getList('.route-chips').join(', ') || getText('.route-dist-badge')) && `Distance and time: ${getList('.route-chips').join(', ') || getText('.route-dist-badge')}`,
        (getText('.route-desc, .route-subtitle')) && `Details: ${getText('.route-desc, .route-subtitle')}`
      ].filter(Boolean);
      return details;
    }

    const details = [
      (getText('.svc-name') || getText('.svc-category-badge')) && `Service: ${getText('.svc-name') || getText('.svc-category-badge')}`,
      getText('.svc-price-badge') && `Price: ${getText('.svc-price-badge')}`,
      getText('.svc-desc') && `Details: ${getText('.svc-desc')}`,
      getList('.svc-feat').length && `Includes: ${getList('.svc-feat').join(', ')}`
    ].filter(Boolean);
    return details;
  }

  let cardBookingDialog;

  function showCardBookingDialog(details) {
    if (!details?.length) return;

    cardBookingDialog ||= createCardBookingDialog();
    const summary = cardBookingDialog.querySelector('#cardBookingSummary');
    const dateField = cardBookingDialog.querySelector('#cardBookingDate');
    const today = new Date();
    dateField.min = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
    cardBookingDialog.dataset.bookingDetails = details.join('\n');
    summary.textContent = details.join(' · ');
    cardBookingDialog.showModal();
  }

  window.openBookingRequest = function (service, options = {}) {
    const labels = { route: 'Route', vehicle: 'Vehicle', package: 'Package', drop: 'Drop location' };
    const details = [`Service: ${service || 'Cab booking'}`];
    Object.entries(labels).forEach(([key, label]) => {
      if (options[key]) details.push(`${label}: ${options[key]}`);
    });
    showCardBookingDialog(details);
  };

  window.openCardBooking = function (button) {
    showCardBookingDialog(getCardBookingDetails(button));
  };

  document.addEventListener('click', (event) => {
    const bookingButton = event.target.closest('.route-book-btn, .svc-btn-book');
    if (bookingButton && !(bookingButton.matches('.svc-btn-book') && /view\s+packages/i.test(bookingButton.textContent))) {
      event.preventDefault();
      event.stopPropagation();
      window.openCardBooking(bookingButton);
      return;
    }

    const link = event.target.closest('.fleet-wa-btn, .pkg-wa, .route-wa-btn, .svc-btn-wa');
    if (!link) return;

    event.preventDefault();
    event.stopPropagation();

    if (link.matches('.fleet-wa-btn')) {
      const vehicle = link.closest('.fleet-card')?.querySelector('.fleet-name')?.textContent.trim();
      window.startBooking('Fleet booking', { vehicle });
      return;
    }

    if (link.matches('.pkg-wa')) {
      const card = link.closest('.pkg-card');
      const packageName = card?.querySelector('.pkg-name')?.textContent.trim();
      const packageHours = card?.querySelector('.pkg-hours')?.textContent.trim();
      window.startBooking('Car rental', { package: [packageName, packageHours].filter(Boolean).join(' - ') });
      return;
    }

    if (link.matches('.route-wa-btn')) {
      const route = link.closest('.route-card')?.querySelector('.route-from-to')?.textContent.replace(/\s+/g, ' ').trim();
      const destination = route?.split('→').pop().trim();
      window.startBooking('Outstation taxi', { route: route?.replace('→', 'to'), drop: destination });
      return;
    }

    const category = link.closest('.svc-card')?.querySelector('.svc-category-badge')?.textContent.trim().toLowerCase();
    const serviceByCategory = {
      city: 'Local cab service',
      airport: 'Airport transfer',
      outstation: 'Outstation taxi',
      rental: 'Car rental',
      corporate: 'Corporate cab',
      wedding: 'Wedding car',
      tours: 'Tour package',
      school: 'School cab',
      medical: 'Medical cab'
    };
    window.startBooking(serviceByCategory[category] || 'Service booking');
  }, true);

  function initializeBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    if (params.has('service') || params.has('route') || params.has('vehicle') || params.has('package')) {
      applyBookingDetails(params.get('service'), {
        route: params.get('route'),
        vehicle: params.get('vehicle'),
        package: params.get('package'),
        drop: params.get('drop')
      });
    }

    const dateField = document.getElementById('bookDate');
    const today = new Date();
    dateField.min = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const booking = new FormData(form);
      const date = new Date(`${booking.get('date')}T00:00:00`);
      const message = [
        'Hi, I would like to book a cab.',
        `Requested service: ${booking.get('service')}`,
        `Pickup location: ${booking.get('pickup')}`,
        `Drop location: ${booking.get('drop')}`,
        `Pickup date: ${date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
        `Pickup time: ${booking.get('time')}`,
        `Phone number: ${booking.get('phone')}`,
        `Vehicle: ${booking.get('vehicle')}`
      ].join('\n');

      window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBookingForm);
  } else {
    initializeBookingForm();
  }
})();
