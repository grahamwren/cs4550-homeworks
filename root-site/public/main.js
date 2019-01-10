// gotta have those promises
async function replaceSingleNodeWithPartial(element) {
    const src = element.getAttribute('src');
    if (!(src && fetch && typeof fetch === 'function')) return;

    const resp = await fetch(src);
    const elementPartial = await resp.text();
    if (!(elementPartial && resp.status === 200)) return;

    element.innerHTML = elementPartial;
}

function loadPartials() {
    const elements = document.querySelectorAll('partial[src]');
    Array.prototype.forEach.call(elements, replaceSingleNodeWithPartial);
}

document.addEventListener('DOMContentLoaded', loadPartials);
