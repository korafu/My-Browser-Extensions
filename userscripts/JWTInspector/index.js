/* global Popper, jwt_decode */

document.body.addEventListener('pointerup', (event) => {
  const eventTarget = event.target;
  const matches = eventTarget.textContent.match(/(\beyJ[\w-]*\.eyJ[\w-]*\.[\w-]*\b)/);
  if (!matches) { return; }
  if (eventTarget.dataset.tooltipId) { return; }
  if (eventTarget.closet('input, textarea')){ return; }

  const jwt = matches[0].replace(/\s/g, '');
  const tid = String(Math.random()).slice(2);
  eventTarget.innerHTML = eventTarget.innerHTML.replace(jwt, `<span aria-describedby="tooltip" data-tooltip-id="${ tid }">${ jwt }</span>`);

  const referenceEl = document.querySelector(`[data-tooltip-id="${ tid }"]`);
  const popperEl = document.createElement('div');
  popperEl.setAttribute('role', 'tooltip');
  document.body.appendChild(popperEl);

  const jwtPayload = JSON.stringify(jwt_decode(jwt), null, 2);
  popperEl.innerHTML = `<pre><code>${ jwtPayload }</code></pre>`;
  popperEl.hidden = true;
  Object.assign(popperEl.style, {
    backgroundColor: 'black',
    color: 'white',
    padding: '8px',
    borderRadius: '4px',
  });

  referenceEl.addEventListener('pointerenter', () => { popperEl.hidden = false; });
  referenceEl.addEventListener('pointerleave', () => { popperEl.hidden = true; });
  // eslint-disable-next-line no-alert
  referenceEl.addEventListener('click', () => prompt(jwtPayload, jwtPayload));
  Object.assign(referenceEl.style, {
    cursor: 'pointer',
    textDecoration: 'underline dashed currentColor 1px',
  });

  Popper.createPopper(referenceEl, popperEl, {
    placement: 'auto-start',
    modifiers: [{
      name: 'offset',
      options: { offset: [0, 20] },
    }],
  });
});

// cSpell:ignore describedby
