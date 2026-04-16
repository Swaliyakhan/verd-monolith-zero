/* ============================================================
   VERD — MONOLITH ZERO · SS26
   Interactive Campaign JS + AI Image Generation
   ============================================================ */

const PROMPTS = {
  'img-hero': 'Luxury fashion editorial photograph. A woman with Mongolian-Korean features, severe blunt black bob haircut chin-length, strong jaw, high cheekbones, standing in a brutalist underground concrete channelway at night. She wears an oversized floor-length structured charcoal wool coat. Single hard flash from 45 degrees camera-left creates deep shadow on right side of face. Expansion joint grid concrete floor. Cold colour palette, near-black tones, bone white highlights. 35mm lens, full body shot, editorial quality, high fashion campaign image.',

  'img-z01-a': 'High fashion editorial portrait photograph. Woman with Mongolian-Korean features, severe blunt black bob haircut, warm medium-deep skin, zero expression, absolute stillness. Extreme close crop face and neck. Half the face in deep shadow, single flash catchlight in left eye only. Raw concrete aggregate wall texture background. Charcoal structured coat collar visible. 85mm f/1.4, bone white and void black palette. Luxury campaign quality.',

  'img-z01-b': 'Fashion editorial portrait. Same woman, Mongolian-Korean, blunt black bob, zero affect. Three-quarter upper body shot in brutalist service corridor. Single fluorescent strip light on ceiling. Hard flash 45 degrees left. Charcoal deconstructed blazer. 85mm lens. Cold grey concrete walls with vertical drainage channels. Editorial magazine quality.',

  'img-z01-c': 'Luxury fashion editorial. Woman, Mongolian-Korean heritage, blunt black bob, strong jaw. Shoulder leaning against raw poured concrete aggregate wall. Arms loose at sides. Deconstructed charcoal suit jacket with raw lapel seams. Single geometric resin earring left ear. Hard flash 45 degrees camera-left. 85mm upper body shot. Deep shadow, bone highlights. Campaign quality.',

  'img-z02-a': 'Fashion campaign photograph. Woman, Mongolian-Korean, blunt black bob, walking directly toward camera in brutalist corridor. Floor-length charcoal coat in motion, hem lifted by stride. Hard flash freezes motion absolutely. Receding concrete perspective behind her. 35mm full body. Eyes straight at lens. Zero expression while body moves. Editorial authority.',

  'img-z02-b': 'Editorial fashion photograph. Woman, Mongolian-Korean, blunt bob. Shot from slightly above, descending brutalist concrete spiral staircase. Coat trailing one step behind. Overhead flash casting sharp shadow on stairs. 35mm. Cold void palette. Architectural editorial quality.',

  'img-z02-c': 'Luxury fashion image. Same model shot from behind, three-quarter back. Structured charcoal coat as a single seamless architectural plane from behind. Brutalist urban landscape ahead of her in darkness. Hard flash catches coat silhouette edge and hair nape. 35mm full body. Silence as communication.',

  'img-z02-d': 'High fashion editorial. Woman, Mongolian-Korean, blunt black bob. Standing on rain-slicked brutalist plaza at night. Full body reflection doubled in shallow puddle below. Both subject and reflection equally sharp. Hard flash camera-left. 35mm centred. Above dark concrete architecture, below perfect mirror reflection. Void palette with ice highlights on wet surface.',

  'img-z03-a': 'Luxury fashion campaign. Woman, Mongolian-Korean, blunt bob, absolute stillness. Full length under massive brutalist bridge underpass, enormous concrete slab overhead. Wet aggregate pavement below. Night environment. Hard directional flash camera-left. 35mm full body, model small in vast frame. Floor-length charcoal coat. Titanium clasp. Cold void palette.',

  'img-z03-b': 'Fashion editorial. Woman, Mongolian-Korean, blunt bob. Standing between brutalist cistern columns, shallow water on floor reflecting flash. Columns recede into darkness behind her. Minimal charcoal turtleneck and structured trousers. Hard flash camera-left. 35mm full body model centred between columns. Subterranean monumental controlled mood.',

  'img-z03-c': 'High fashion campaign image. Woman, Mongolian-Korean. Small figure on brutalist exterior concrete plaza at night. Massive government megastructure behind her, dark windows with single lit row far above. Flash pool of light on subject, architecture falls to near black. 35mm full body model at left third. Vast dark void architecture right.',

  'img-z03-d': 'Fashion campaign panoramic. Woman, Mongolian-Korean, blunt bob. Shot from extreme low angle below ground level. Camera at ankle height, model standing above, brutalist tower rising behind her to top of frame. Full architectural scale. Oversized coat in silhouette. 35mm extreme low angle. Model and building as same vertical force. Void and ice palette.',

  'img-z04-a': 'Experimental fashion editorial. Woman, Mongolian-Korean, blunt bob. Caught in single intense floodlight beam from directly above. Extreme top-light only, face lit from above, chin in shadow. Brutalist exterior wall behind her. The body becomes shadow geometry. 35mm full body centred. Void palette with extreme single highlight zone. High drama zero artifice.',

  'img-z04-b': 'Abstract fashion editorial. Woman, Mongolian-Korean, blunt bob. Rebar grid shadow pattern falling across face and entire coat. Secondary geometry of shadow lines crossing the figure. Hard flash 45 degrees. 85mm three-quarter body. The industrial and the tailored creating graphic abstraction. Cold palette.',

  'img-z04-c': 'Fashion detail editorial extreme close. Same model hands and wrist. Titanium architectural cuff, square cross-section, matte finish. Charcoal raw wool sleeve. Raw concrete background out of focus. Hard single flash dramatic shadow. 85mm macro. Fabric texture, skin texture, metal surface all with absolute clarity.',

  'img-closing': 'Final luxury fashion campaign image. Woman, Mongolian-Korean, blunt black bob, warm medium-deep skin, absolute zero affect. Full look: oversized charcoal coat, deconstructed trousers, matte boots, titanium cuff. Standing on brutalist plaza alone at night, flash from camera-left, dark city mass behind. She does not look at camera. Gaze at something 40 degrees right not visible in frame. She is not posing she is existing. 35mm full body. VERD campaign final image.'
};

// ── CURSOR ──────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .zone-row, .wf-item').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('is-hovering'); follower.classList.add('is-hovering'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('is-hovering'); follower.classList.remove('is-hovering'); });
});

document.querySelectorAll('.hover-zoom').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('on-image'); follower.classList.add('on-image'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('on-image'); follower.classList.remove('on-image'); });
});

// ── PARALLAX ────────────────────────────────────────────────
const heroScene = document.querySelector('.parallax-scene');
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.pageYOffset;
      if (heroScene) {
        heroScene.style.transform = `translateY(${scrollY * 0.35}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }
});

// ── SCROLL REVEAL ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

// ── NAV VISIBILITY ───────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 80) nav.classList.add('visible');
  else nav.classList.remove('visible');
});

// ── AI IMAGE GENERATION ──────────────────────────────────────
const loaderFill = document.getElementById('loaderFill');
const loaderStatus = document.getElementById('loaderStatus');
const loader = document.getElementById('loader');

const imageIds = Object.keys(PROMPTS);
let generated = 0;

async function generateImage(id, prompt) {
  const wrap = document.getElementById(id);
  if (!wrap) return;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Generate a detailed SVG illustration for a luxury fashion campaign image. The image should be: ${prompt}

Create a sophisticated SVG artwork (viewBox="0 0 800 1000") that captures this fashion editorial scene using:
- Deep blacks (#030305, #060608, #080809) as dominant tones
- Subtle grey tones (#0d0d0f, #111113, #1a1a1c) for midtones  
- Warm skin tones (#b8906e, #c4956e, #d4b090) for the model
- Bone white (#e0e0e0, #d9d9d9) for maximum highlights
- A stylized figure silhouette with the described outfit
- Brutalist architectural elements as background
- Dramatic single-source lighting creating strong shadow/highlight contrast
- The overall feeling of a high-end fashion editorial photograph rendered as sophisticated SVG art

Return ONLY the SVG code, starting with <svg and ending with </svg>. No explanation, no markdown.`
        }]
      })
    });

    const data = await response.json();
    const svgText = data.content?.[0]?.text || '';
    const svgMatch = svgText.match(/<svg[\s\S]*<\/svg>/);

    if (svgMatch) {
      const svgBlob = new Blob([svgMatch[0]], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'VERD Campaign Image';
      img.onload = () => {
        img.classList.add('loaded');
        const genEl = wrap.querySelector('.img-generating');
        if (genEl) genEl.classList.add('done');
      };
      wrap.appendChild(img);
    }
  } catch (err) {
    console.warn('Image generation failed for', id, err);
    const genEl = wrap?.querySelector('.img-generating');
    if (genEl) genEl.querySelector('span').textContent = 'Campaign Image';
  }

  generated++;
  const pct = Math.round((generated / imageIds.length) * 100);
  loaderFill.style.width = pct + '%';

  if (generated <= 3) {
    const statuses = ['Generating campaign world', 'Building visual language', 'Rendering brutalist spaces', 'Composing identity portraits'];
    loaderStatus.textContent = statuses[generated - 1] || 'Finalising campaign';
  }

  if (generated === imageIds.length) {
    setTimeout(() => {
      loader.classList.add('hidden');
      nav.classList.add('visible');
      document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));
    }, 600);
  }
}

// Generate all images — stagger slightly to not overwhelm
async function runGeneration() {
  loaderStatus.textContent = 'Generating campaign world';
  loaderFill.style.width = '5%';

  // Generate hero first, then batch the rest
  const [heroId, ...restIds] = imageIds;
  generateImage(heroId, PROMPTS[heroId]);

  // Stagger remaining
  restIds.forEach((id, i) => {
    setTimeout(() => generateImage(id, PROMPTS[id]), 800 + i * 300);
  });
}

// Start on load
window.addEventListener('load', runGeneration);
