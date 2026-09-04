const SUPABASE_URL = 'https://xzwkombhtesozqobldvu.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Ri_inFHaWpCyMAJHee8Zqw_YXdp3fnO';

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
const seedBooks = [
  {id:1,title:'The Moonbeam Garden',author:'Maya Rao',price:349,age:'4–6',genre:'Magic',rating:4.9,reviews:28,icon:'🌙',color:'#7767c9',description:'When a shy firefly loses her glow, a moonbeam garden helps her find a brave new kind of light.',available:true},
  {id:2,title:'Pippa and the Pocket Planet',author:'Nisha Iyer',price:399,age:'6–8',genre:'Adventure',rating:4.8,reviews:19,icon:'🪐',color:'#ef8162',description:'Pippa discovers a tiny planet in her coat pocket — complete with a very worried alien mayor.',available:true},
  {id:3,title:'The Great Mango Mystery',author:'Arjun Mehta',price:299,age:'5–7',genre:'Mystery',rating:4.7,reviews:42,icon:'🥭',color:'#e6a21c',description:'Three best friends follow a trail of sticky clues to solve the tastiest mystery in town.',available:true},
  {id:4,title:'Rumi’s Robot Rainy Day',author:'Anya Das',price:379,age:'3–5',genre:'Friendship',rating:5,reviews:31,icon:'🤖',color:'#4baeb3',description:'Rumi builds a robot to play with — and learns that imperfect rainy days can be the best kind.',available:true},
  {id:5,title:'A Kite for Every Cloud',author:'Zoya Khan',price:329,age:'4–6',genre:'Feelings',rating:4.9,reviews:16,icon:'🪁',color:'#d06c99',description:'A tender story about big feelings, a stubborn breeze, and finding your way back to the sunshine.',available:true},
  {id:6,title:'Nori’s Noisy Orchestra',author:'Tara Bose',price:359,age:'2–4',genre:'Music',rating:4.8,reviews:24,icon:'🎺',color:'#7c9c46',description:'Tap, toot and twirl along as Nori gathers the noisiest orchestra the forest has ever heard.',available:true},
  {id:7,title:'The Cloud Collector',author:'Dev Sen',price:429,age:'7–9',genre:'Nature',rating:4.9,reviews:11,icon:'☁️',color:'#65a6d5',description:'A curious child learns how clouds travel, change and carry stories across the sky.',available:true},
  {id:8,title:'Tara’s Tiny Tea Shop',author:'Leena Kapoor',price:319,age:'3–6',genre:'Pretend',rating:4.7,reviews:36,icon:'🫖',color:'#bd7f9b',description:'Tara opens a tea shop for woodland creatures — but her first customer has a very unusual order.',available:true}
];

const defaultContent={
  announcement:'Hi',

  heroEyebrow:'A little shop full of wonder',
  heroTitle:'Stories that make',
  heroHighlight:'little minds bloom.',
  heroCopy:'Thoughtfully chosen books for curious kids — packed with imagination, kindness, and plenty of giggles.',
  heroButton:'Browse current offers',
  collectionTitle:'A story for every kind of day',
  saleText:'Curious about the little story behind TinyTotBooks?',
  clubEyebrow:'A fresh story each month',
  clubTitle:'The Little Reader’s Club',
  clubText:'Age-right, joy-packed monthly reading picks, delivered to your door.',
  ageEyebrow:'Built for growing readers',
  ageTitle:'Find their next favourite.',
  ageText:'Browse by age, interest, or the kind of adventure they’re craving today.',
  offersMessage:'Our current offers are waiting for you!',
offersRules:'• Coupons can be used once per order\n• Only one coupon may be applied to an order\n• Offers cannot be combined with other discounts'
};

const defaultCharacters=[
  {id:101,title:'Animal friends',description:'Gentle, mischievous and wonderfully wild companions.',icon:'🦁',color:'#f8c0cd',target:'Adventure'},
  {id:102,title:'Magic makers',description:'Wands, wishes, moonbeams and a spark of the impossible.',icon:'🧚',color:'#b9e4df',target:'Magic'},
  {id:103,title:'Big adventurers',description:'For explorers ready to travel far without leaving the sofa.',icon:'🚀',color:'#ded2ff',target:'Adventure'}
];

let appliedCoupon = null;
document.addEventListener('click', async e => {

  if (e.target.id !== 'applyCouponButton') return;

  const input = document.querySelector('#checkoutCouponInput');
  const message = document.querySelector('#checkoutCouponMessage');

  if (!input || !message) return;

  const code = input.value.trim().toUpperCase();

  if (!code) {
    appliedCoupon = null;
    message.textContent = 'Please enter a coupon code.';
    return;
  }

  message.textContent = 'Checking coupon…';

  try {

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .ilike('code', code)
      .maybeSingle();

    if (error) {
      console.error('Coupon lookup failed:', error);
      appliedCoupon = null;
      message.textContent =
        'Unable to check this coupon right now.';
      return;
    }

    if (!data) {
      appliedCoupon = null;
      message.textContent = 'Invalid coupon code.';
      return;
    }

    if (!data.active) {
      appliedCoupon = null;
      message.textContent =
        'This coupon is no longer active.';
      return;
    }

    if (data.expires_at) {
      const expiresAt =
        new Date(data.expires_at).getTime();

      if (
        Number.isFinite(expiresAt) &&
        Date.now() >= expiresAt
      ) {
        appliedCoupon = null;
        message.textContent =
          'This coupon has expired.';
        return;
      }
    }

    appliedCoupon = {
      code: data.code
    };

    message.textContent =
      `Coupon ${data.code} applied.`;

  } catch (error) {

    console.error(
      'Coupon application error:',
      error
    );

    appliedCoupon = null;

    message.textContent =
      'Unable to check this coupon right now.';
  }

});
const state={

  books:[] ,

  allBooks: [],

  cart:JSON.parse(localStorage.getItem('ss-cart')||'[]'),

  shipping:Number(localStorage.getItem('ss-shipping')||799),

  content:defaultContent,

  characters:defaultCharacters,

  reviews:[],

  monthlyPicks:[],

  bundles:[],

  admin:sessionStorage.getItem('ss-admin')==='yes',

  filter:'All',

  ageFilter: null,

  sort: 'newest',

  editingBook:null,

  editingCharacter:null

};



async function renderShipping(){

  app.innerHTML = `
    <section class="shipping-page">

      <div class="shipping-hero">
        <span class="eyebrow">Shipping & Delivery</span>

        <h1>
          A little journey<br>
          from our shelf to yours.
        </h1>

        <p>
          Everything you need to know about getting your TinyTotBooks
          safely home.
        </p>
      </div>

      <div class="shipping-content" id="shippingContent">
        <p class="shipping-loading">
          Loading shipping information…
        </p>
      </div>

    </section>
  `;

  const {
    data,
    error
  } = await supabase
    .from('shipping_info')
    .select('content')
    .eq('active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const content = document.querySelector('#shippingContent');

  if(error){
    console.error('Shipping information error:', error);

    content.innerHTML = `
      <p class="shipping-error">
        We couldn't load our shipping information right now.
      </p>
    `;

    return;
  }

  if(!data){
    content.innerHTML = `
      <p class="shipping-error">
        Shipping information is currently unavailable.
      </p>
    `;

    return;
  }

  /*
   * Convert paragraphs separated by blank lines
   * into proper readable paragraphs.
   */
  content.innerHTML = data.content
    .split(/\n\s*\n/)
    .map(paragraph => `
      <p>${esc(paragraph.trim())}</p>
    `)
    .join('');
}

async function loadBooksFromSupabase() {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Could not load books from Supabase:', error);
    return;
  }

if (Array.isArray(data) && data.length) {

state.allBooks = data;
state.books = data.filter(book => book.available !== false);

  // route later
}
}


async function loadCharactersFromSupabase() {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Could not load characters from Supabase:', error);
    return;
  }

  if (Array.isArray(data) && data.length) {
    state.characters = data;
    // route later
  }
}

async function loadMonthlyPicksFromSupabase() {
  const { data, error } = await supabase
    .from('monthly_picks')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Could not load monthly picks:', error);
    state.monthlyPicks = [];
    return;
  }

  state.monthlyPicks = data || [];
  console.log('MONTHLY PICKS LOADED:', state.monthlyPicks);
}


async function loadBundlesFromSupabase() {
  const { data, error } = await supabase
    .from('bundles')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Could not load bundles:', error);
    state.bundles = [];
    return;
  }

  state.bundles = data || [];
  console.log('BUNDLES LOADED:', state.bundles);
}

async function loadBookImagesFromSupabase() {
  const { data, error } = await supabase
    .from('book_images')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Could not load book images from Supabase:', error);
    return;
  }

  // Attach images to the correct book
  console.log('BOOK IMAGES LOADED:', data);

  for (const book of state.allBooks) {
    book.images = (data || [])
.filter(image => Number(image.book_id) === Number(book.id))
    .sort((a, b) => a.sort_order - b.sort_order);
  }

  // route later
}

async function loadSiteContentFromSupabase() {
  const { data, error } = await supabase
    .from('siteSettings')
    .select('*')
    .eq('id', 'general')
    .maybeSingle();

  if (error) {
    console.error('Could not load site settings:', error);
    return;
  }

  if (!data) {
    console.warn('No siteSettings/general row found.');
    return;
  }

  state.content = {
    ...state.content,
    ...data
  };

  console.log('SITE CONTENT LOADED:', state.content);
}

async function loadReviewsFromSupabase(){

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('review_date', { ascending: false });

  if(error){
    console.error('Could not load reviews from Supabase:', error);
    state.reviews = [];
    return;
  }

  state.reviews = Array.isArray(data) ? data : [];

  console.log('REVIEWS LOADED:', state.reviews);
}

const app=document.querySelector('#app');
const money=n=>`₹${n.toLocaleString('en-IN')}`;

function updateAnnouncement(){
  const banner=document.querySelector('.announcement');
  if(!banner)return;

  const template=
    typeof state.content.announcement==='string'&&state.content.announcement.trim()
      ? state.content.announcement.trim()
      : 'Hi';

  banner.textContent=template.replace('{shipping}',money(state.shipping));
}

function save(){
  localStorage.setItem('ss-books',JSON.stringify(state.books));
  localStorage.setItem('ss-cart',JSON.stringify(state.cart));
  localStorage.setItem('ss-shipping',state.shipping);
  localStorage.setItem('ss-characters',JSON.stringify(state.characters));
  updateAnnouncement();
  updateCartBadge();
}

function esc(s){
  return String(s).replace(/[&<>"']/g,c=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#039;'
  }[c]));
}

function cover(b, small = false) {
  const imageUrl =
    b.images && b.images.length
      ? b.images[0].image_url
      : b.image;

  const art = imageUrl
    ? `<img class="cover-photo" src="${esc(imageUrl)}" alt="${esc(b.title)}">`
    : `<span class="${small ? 'cart-cover-icon' : 'cover-icon'}">${esc(b.icon)}</span>`;

  return `<div class="${small ? 'cart-cover' : 'cover'}" style="background:${b.color}">${art}${small ? '' : `<span class="cover-title">${esc(b.title)}</span>`}</div>`;
}

function bookCard(b){

  return `
    <article
      class="book-card"
      onclick="openBook(${b.id})"
      style="cursor:pointer"
    >

      ${cover(b)}

      <div class="book-meta">

        <h3>${esc(b.title)}</h3>

        <p>
          ${esc(b.author)} · Ages ${esc(b.age)}
        </p>

        <div class="book-bottom">

          <span class="price">
            ${money(b.price)}
          </span>

          <span class="rating">
            ★ ${b.rating} (${b.reviews})
          </span>

          ${
            b.available
              ? `
                <button
                  class="mini-add"
                  onclick="
                    event.stopPropagation();
                    addToCart(${b.id})
                  "
                  aria-label="Add ${esc(b.title)}"
                >
                  +
                </button>
              `
              : `
                <span class="status sold">
                  Sold
                </span>
              `
          }

        </div>

      </div>

    </article>
  `;
}

function pageHero(eyebrow,title,text){
  return `<section class="page-hero">
    <span class="eyebrow">${eyebrow}</span>
    <h1>${title}</h1>
    <p>${text}</p>
  </section>`;
}

function renderHome(){
  const c=state.content;

  app.innerHTML=`
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">${esc(c.heroEyebrow)}</span>
        <h1>${esc(c.heroTitle)} <i>${esc(c.heroHighlight)}</i></h1>
        <p>${esc(c.heroCopy)}</p>
        <a class="button button-dark" href="#offers">${esc(c.heroButton)}</a>
      </div>

      <div class="hero-art logo-hero">
        <img src="assets/tinytotbooks-logo.png" alt="TinyTotBooks">
      </div>
    </section>

<!-- Homepage character collections intentionally hidden.
     They remain available on the dedicated Characters page. -->

    <section class="section" style="padding-top:45px">
      <div class="section-head">
        <h2>Fresh from the bookshelf</h2>
        <a class="text-link" href="#books">See all books →</a>
      </div>

      <div class="book-grid">
        ${state.books.filter(b=>b.available).slice(0,4).map(bookCard).join('')}
      </div>
    </section>

    <div class="sale-strip">
      <strong>${esc(c.saleText)}</strong>
      <a class="button button-light" href="#about">Our Story →</a>
      </div>

    <section class="section">
      <div class="feature-grid">
        <article class="feature purple">
          <span class="eyebrow">${esc(c.clubEyebrow)}</span>
          <h2>${esc(c.clubTitle)}</h2>
          <p>${esc(c.clubText)}</p>
          <a class="button button-dark" href="#monthly">See this month’s box</a>
          <span class="doodle">📚</span>
        </article>

        <article class="feature orange">
          <span class="eyebrow">${esc(c.ageEyebrow)}</span>
          <h2>${esc(c.ageTitle)}</h2>
          <p>${esc(c.ageText)}</p>
          <a class="button button-light" href="#ages">Browse by age</a>
          <span class="doodle">🌈</span>
        </article>

        <article class="feature bundle-feature">

  <span class="eyebrow">
    Ready to share
  </span>

  <h2>
    A little box of magic, all wrapped up.
  </h2>

  <p>
    Discover thoughtful book bundles made for birthdays, surprises, and just-because moments.
  </p>

  <a
    class="button button-dark"
    href="#bundles"
  >
    Explore the bundles →
  </a>

  <span class="doodle">
    🎁
  </span>

</article>
       <article class="feature character-feature">

  <span class="eyebrow">
    Explore the formats
  </span>

  <h2>
    Every story needs a great binding.
  </h2>

  <p>
Playful pop-ups, beautiful hardcovers, and easy-to-love paperbacks, find the format that fits their next reading adventure.
  </p>

  <a
    class="button button-dark"
    href="#characters"
  >
    Browse by format →
  </a>

  <span class="doodle">
    🦊
  </span>

</article> 
      </div>
    </section>
  `;
}

function renderBooks(){
  const genres=['All',...new Set(state.books.map(b=>b.genre))];

let filteredBooks = state.books;

if (state.ageFilter) {
  filteredBooks = filteredBooks.filter(
    b => b.age.replace('-', '–') === state.ageFilter
  );
}

if (state.filter !== 'All') {
  filteredBooks = filteredBooks.filter(
    b => b.genre === state.filter
  );
}

const books = [...filteredBooks];

switch(state.sort){

  case 'newest':
    books.sort(
      (a,b) =>
        new Date(b.created_at || 0) -
        new Date(a.created_at || 0)
    );
    break;

  case 'oldest':
    books.sort(
      (a,b) =>
        new Date(a.created_at || 0) -
        new Date(b.created_at || 0)
    );
    break;

  case 'price-high':
    books.sort(
      (a,b) =>
        Number(b.price || 0) -
        Number(a.price || 0)
    );
    break;

  case 'price-low':
    books.sort(
      (a,b) =>
        Number(a.price || 0) -
        Number(b.price || 0)
    );
    break;

  case 'reviews-high':
    books.sort(
      (a,b) =>
        Number(b.reviews || 0) -
        Number(a.reviews || 0)
    );
    break;

  case 'rating-high':
    books.sort(
      (a,b) =>
        Number(b.rating || 0) -
        Number(a.rating || 0)
    );
    break;

  case 'title':
    books.sort(
      (a,b) =>
        String(a.title || '').localeCompare(
          String(b.title || '')
        )
    );
    break;
}

  app.innerHTML=`
    ${pageHero(
      'The full shelf',
      'Books they’ll ask for again and again.',
      'Every title is hand-picked for bright illustrations, memorable characters, and the magic of a page well turned.'
    )}

    <section class="section">
      <div class="filters">
        ${genres.map(x=>`
          <button class="filter ${x===state.filter?'active':''}" onclick="setFilter('${x}')">${x}</button>
        `).join('')}
      </div>

<div class="book-sort">
  <label for="bookSort">Sort by</label>

  <select
    id="bookSort"
    onchange="setBookSort(this.value)"
  >
    <option value="newest" ${state.sort === 'newest' ? 'selected' : ''}>
      Newest first
    </option>

    <option value="oldest" ${state.sort === 'oldest' ? 'selected' : ''}>
      Oldest first
    </option>

    <option value="price-high" ${state.sort === 'price-high' ? 'selected' : ''}>
      Price: High to Low
    </option>

    <option value="price-low" ${state.sort === 'price-low' ? 'selected' : ''}>
      Price: Low to High
    </option>

    <option value="reviews-high" ${state.sort === 'reviews-high' ? 'selected' : ''}>
      Most reviews
    </option>

    <option value="rating-high" ${state.sort === 'rating-high' ? 'selected' : ''}>
      Highest rated
    </option>

    <option value="title" ${state.sort === 'title' ? 'selected' : ''}>
      A–Z
    </option>
  </select>
</div>

      <div class="book-grid">
        ${books.map(bookCard).join('')}
      </div>
    </section>
  `;
}

function renderCharacters(){
  app.innerHTML=`
    ${pageHero(
      'Browse by mood',
      'Who will they meet next?',
      'Pick a shelf full of characters they already love — and a few new friends waiting to be found.'
    )}

    <section class="section">
      <div class="collection-grid">
        ${state.characters.map(x=>`
          <a class="collection" style="background:${x.color}" href="#books" onclick="filterFromLink('${esc(x.target)}')">
            ${x.image
              ? `<img class="collection-photo" src="${x.image}" alt="${esc(x.title)}">`
              : `<span>${esc(x.icon)}</span>`}
            <h2>${esc(x.title)}</h2>
            <p>${esc(x.description)}</p>
          </a>
        `).join('')}
      </div>
    </section>
  `;
}

function renderAges(){
  const ages=[
    ['0–2','Board books, rhymes & snuggly read-alouds','🐣'],
    ['3–5','Picture books full of play and possibility','🫧'],
    ['6–8','Early readers and stories to get lost in','🔎'],
    ['9+','Big worlds for independent bookworms','🌍']
  ];

  app.innerHTML=`
    ${pageHero(
      'Just right for right now',
      'Books that grow with them.',
      'Finding the right story at the right moment can make all the difference.'
    )}

    <section class="section">
      <div class="age-grid">
        ${ages.map((a,i)=>`
           <a class="age-card" href="#books" onclick="filterAge('${i===0?'0–2':i===1?'3–5':i===2?'6–8':'9+'}')">
          <span>${a[2]}</span>
            <h2>Ages ${a[0]}</h2>
            <p>${a[1]}</p>
            <b>Explore →</b>
          </a>
        `).join('')}
      </div>
    </section>
  `;
}

function renderMonthly(){

  const picks = state.monthlyPicks || [];

  app.innerHTML = `
    ${pageHero(
      'August reading box',
      'The Little Reader’s Club',
      'A lovely little ritual : Your monthly box of little books. Discover great deals below.'
    )}

    <section class="section">

      ${
        picks.length
          ? picks.map(p => `
              <div class="about-grid">

                <div class="about-card">

                  <span class="eyebrow">
                    ${esc(p.eyebrow || '')}
                  </span>

                  <h2>
                    ${esc(p.title || '')}
                  </h2>

                  <p>
                    ${esc(p.description || '')}
                  </p>

                  ${
                    Array.isArray(p.items)
                      ? `
                        <ul>
                          ${p.items.map(item => `
                            <li>${esc(item)}</li>
                          `).join('')}
                        </ul>
                      `
                      : ''
                  }

                  <p>
                    <b>${money(p.price || 0)}</b>
                    · ${esc(p.shipping_text || '')}
                  </p>

                  <button
                    class="button button-dark"
                    onclick="addMonthlyPick(${p.id})"
                    >
                    ${esc(p.button_text || 'Add this box')}
                  </button>

                </div>

                <div>
                  <div
                    class="bundle-art"
                    style="
                      height:100%;
                      min-height:330px;
                      background:${esc(p.artwork_color || '#f7bdd0')}
                    "
                  >
                    ${esc(p.artwork || '✨')}
                  </div>
                </div>

              </div>
            `).join('')
          : `
            <div class="about-card">
              <h2>No monthly picks right now</h2>
              <p>Check back soon for the next reading box.</p>
            </div>
          `
      }

    </section>
  `;
}

async function renderFAQs() {
  const app = document.querySelector('#app');

  app.innerHTML = `
    <section class="faq-page">
      <div class="faq-hero">
        <p class="eyebrow">Questions, answered</p>
        <h1>Frequently Asked Questions</h1>
        <p>
          A few little answers to the things you might be wondering.
        </p>
      </div>

      <div class="faq-list" id="faqList">
        <p class="faq-loading">Loading FAQs…</p>
      </div>
    </section>
  `;

  const {
    data: faqs,
    error
  } = await supabase
    .from('faqs')
    .select('id,question,answer')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  const faqList = document.querySelector('#faqList');

  if (error) {
    console.error('FAQ loading error:', error);

    faqList.innerHTML = `
      <p class="faq-error">
        We couldn't load the FAQs right now. Please try again.
      </p>
    `;

    return;
  }

  if (!faqs || faqs.length === 0) {
    faqList.innerHTML = `
      <p class="faq-error">
        No FAQs are available right now.
      </p>
    `;

    return;
  }

  faqList.innerHTML = faqs.map(faq => `
    <article class="faq-card">
      <button
        class="faq-question"
        type="button"
        aria-expanded="false"
      >
        <span>${esc(faq.question)}</span>
        <span class="faq-plus">+</span>
      </button>

      <div class="faq-answer">
        <p>${esc(faq.answer)}</p>
      </div>
    </article>
  `).join('');

  faqList.querySelectorAll('.faq-question').forEach(button => {

    button.addEventListener('click', () => {

      const card = button.closest('.faq-card');
      const isOpen =
        card.classList.contains('open');

      /*
       * Close other questions.
       */
      faqList.querySelectorAll('.faq-card.open')
        .forEach(openCard => {
          openCard.classList.remove('open');

          const openButton =
            openCard.querySelector('.faq-question');

          openButton.setAttribute(
            'aria-expanded',
            'false'
          );
        });

      /*
       * Open this question.
       */
      if (!isOpen) {
        card.classList.add('open');

        button.setAttribute(
          'aria-expanded',
          'true'
        );
      }

    });

  });
}

function showBundleDetails(bundleId) {

  const bundle = (state.bundles || []).find(
    b => Number(b.id) === Number(bundleId)
  );

  if (!bundle) {
    console.error('Bundle not found:', bundleId);
    return;
  }

  const books = Array.isArray(bundle.book_ids)
    ? bundle.book_ids
        .map(id =>
          state.allBooks.find(
            book => Number(book.id) === Number(id)
          )
        )
        .filter(Boolean)
    : [];

  const overlay = document.createElement('div');

  overlay.className = 'bundle-details-overlay';

  overlay.innerHTML = `
    <div class="bundle-details-modal">

      <button
        class="bundle-details-close"
        type="button"
        aria-label="Close"
        onclick="this.closest('.bundle-details-overlay').remove()"
      >
        ×
      </button>

      <div class="bundle-details-head">

        <span class="eyebrow">
          Inside this bundle
        </span>

        <h2>
          ${esc(bundle.title || '')}
        </h2>

        <p>
          ${esc(bundle.description || '')}
        </p>

      </div>

      <div class="bundle-details-books">

        ${
          books.length
            ? books.map(book => `
                <button
                  type="button"
                  class="bundle-detail-book"
                  onclick="openBookFromBundle(${book.id})"
                >

                   ${cover(book)}

                  <div class="bundle-detail-book-info">

                    <h3>
                      ${esc(book.title || '')}
                    </h3>

                    <span>
                      View book
                    </span>

                  </div>

                </button>
              `).join('')
            : `
                <p class="muted">
                  No books have been added to this bundle yet.
                </p>
            `
        }

      </div>

    </div>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener('click', event => {
    if (event.target === overlay) {
      overlay.remove();
    }
  });
}

function renderBundles(){

  const bundles = state.bundles || [];

  app.innerHTML = `
    ${pageHero(
      'Ready-to-give magic',
      'Bundles made for wide eyes.',
      'Thoughtful book pairings for birthdays, holidays, or a just-because surprise.'
    )}

    <section class="section">

      <div class="bundle-grid">

        ${
          bundles.length
            ? bundles.map(b => `
                <article class="bundle">

<div class="bundle-art">
  ${
    b.image_url
      ? `<img
          src="${esc(b.image_url)}"
          alt="${esc(b.title || 'Bundle')}"
        >`
      : esc(b.icon || '🎁')
  }
</div>

                  <h2>
                    ${esc(b.title || '')}
                  </h2>

                  <p class="muted">
                    ${esc(b.description || '')}
                  </p>

                  ${
                    Array.isArray(b.book_ids)
                      ? `
                        <ul>
                          ${
                            b.book_ids.map(id => {
                              const book = state.allBooks.find(
                                x => Number(x.id) === Number(id)
                              );

                              return book
                                ? `<li>${esc(book.title)}</li>`
                                : '';
                            }).join('')
                          }
                        </ul>
                      `
                      : ''
                  }


<div class="bundle-footer">

  <strong>
    ${money(b.price || 0)}
  </strong>

  <div class="bundle-actions">

    <button
      class="button button-light"
      onclick="showBundleDetails(${b.id})"
    >
      View books
    </button>

    <button
      class="button button-dark"
      onclick="addBundle(${b.id})"
    >
      ${esc(b.button_text || 'Add bundle')}
    </button>

  </div>

</div>

                </article>
              `).join('')
            : `
                <div class="about-card">
                  <h2>No bundles available</h2>
                  <p>New bundles are coming soon.</p>
                </div>
              `
        }

      </div>

    </section>
  `;
}

function formatReviewDate(date){

  if(!date) return '';

  const parsed = new Date(date);

  if(Number.isNaN(parsed.getTime())){
    return esc(String(date));
  }

  return parsed.toLocaleDateString('en-IN',{
    day:'numeric',
    month:'short',
    year:'numeric'
  });
}


function renderReviews(){

  const reviews = Array.isArray(state.reviews)
    ? state.reviews
    : [];

  app.innerHTML=`

    ${pageHero(
      'Kind words from our readers',
      'Stories that found their way home.',
      'A few lovely words from families who have discovered TinyTotBooks.'
    )}

    <section class="section reviews-page">

      <div class="reviews-intro">

        <span class="eyebrow">
          From our readers
        </span>

        <h2>
          Little books. Big love.
        </h2>

        <p>
          Curious where these came from? find them waiting for you on our Google page <3
        </p>

      </div>


      <div class="reviews-grid">

        ${
          reviews.length
            ? reviews.map((review,index)=>`

              <article
                class="review-card"
                style="--review-delay:${index * 0.06}s"
              >

                <div class="review-top">

                  <div
                    class="review-stars"
                    aria-label="${review.stars} out of 5 stars"
                  >
                    ${'★'.repeat(Number(review.stars))}
                    <span class="review-stars-empty">
                      ${'★'.repeat(5 - Number(review.stars))}
                    </span>
                  </div>

                  <span class="review-date">
                    ${formatReviewDate(review.review_date)}
                  </span>

                </div>


                <p class="review-text">
                  “${esc(review.review)}”
                </p>


                <div class="review-person">

                  <span class="review-avatar">
                    ${esc(
                      String(review.name || '?')
                        .trim()
                        .charAt(0)
                        .toUpperCase()
                    )}
                  </span>

                  <strong>
                    ${esc(review.name)}
                  </strong>

                </div>

              </article>

            `).join('')
            : `

              <div class="about-card review-empty">

                <h2>
                  Our little review shelf is growing.
                </h2>

                <p>
                  We’ll be adding lovely words from TinyTotBooks families soon.
                </p>

              </div>

            `
        }

      </div>

<div class="review-story-cta">

  <div class="review-story-copy">

    <span class="eyebrow">
      A little more about us
    </span>

    <h2>
      Seen the love? Come meet the story behind it.
    </h2>

    <p>
      Every bookshop has a story. Ours began with a simple love
      for wonderful books and little imaginations.
    </p>

  </div>

  <a
    class="button button-dark"
    href="#about"
  >
    Read our story →
  </a>

</div>

      <div class="google-review-cta">

        <span class="eyebrow">
          Want to see more?
        </span>

        <h2>
          See what families are saying on Google.
        </h2>

        <p>
          Read more reviews, share your own experience,
          and say hello over on Google.
        </p>

<a
  class="button button-dark google-review-button"
  href="https://share.google/k90Tm6W3fiV4vgIuf"
  target="_blank"
  rel="noopener noreferrer"
>
  Read our Google reviews ↗
</a>
        </div>

    </section>
  `;
}

function renderAbout(){

  app.innerHTML=`

    ${pageHero(
      'Our story',
      'A little idea that began with a love for books.',
      'TinyTotBooks started with a simple wish — to help more children discover wonderful stories without the wonderful price tag.'
    )}

    <section class="story-page">

      <!-- =================================================
           01 — THE BEGINNING
           ================================================= -->

      <section class="story-chapter story-paper story-opening">

        <div class="story-inner story-opening-grid">

          <div>

            <span class="story-marker">01 / The beginning</span>

            <h2>
              Sometimes the best ideas begin with something very simple.
            </h2>

            <p class="story-opening-lead">
              TinyTotBooks started in 2021, when my second child was born.
            </p>

            <p>
              Being a pediatrician and a mom, I wanted my children to grow
              up surrounded by beautiful books, wonderful stories and little
              worlds that could spark their imagination — just like any
              parent would.
            </p>

          </div>

          <div class="story-year" aria-label="Started in 2021">
            2021
          </div>

        </div>

      </section>


      <!-- =================================================
           02 — THE SEARCH
           ================================================= -->

      <section class="story-chapter story-cream story-idea">

        <div class="story-inner story-center">

          <span class="story-marker">02 / The search</span>

          <h2>
            Then came the hunt for books.
          </h2>

          <p class="story-idea-copy">
            While searching for books for my children, I found myself drawn
            to imported books and titles by authors from around the world.
            They were beautiful, engaging and often very different from the
            books I had grown up with.
          </p>

          <p class="story-idea-copy">
            But I soon realised that many of them were quite expensive,
            especially for a middle-class family.
          </p>

        </div>

      </section>


      <!-- =================================================
           03 — THE QUESTION
           ================================================= -->

      <section class="story-chapter story-question">

        <div class="story-inner story-center">

          <span class="story-marker">03 / The question</span>

          <h2>
            “Why should beautiful, good-quality books have to be so expensive?”
          </h2>

          <p>
            That question stayed with me.
          </p>

        </div>

      </section>


      <!-- =================================================
           04 — PRE-LOVED BOOKS
           ================================================= -->

      <section class="story-chapter story-mint story-journey">

        <div class="story-inner story-center">

          <span class="story-marker">04 / A new idea</span>

          <h2>
            That was when I discovered the world of pre-loved books.
          </h2>

          <p class="story-journey-intro">
            I loved the idea that a book could be loved by one child and
            then continue its journey to another.
          </p>


          <div class="story-flow" aria-hidden="true">

            <div class="story-flow-book">
              📖
            </div>

            <div class="story-flow-arrow">
              →
            </div>

            <div class="story-flow-book">
              🧒
            </div>

          </div>


          <p class="story-journey-note">
            A book didn't have to stop being special just because it had
            already belonged to someone.
          </p>

          <p class="story-journey-note">
            And that little thought slowly became TinyTotBooks.
          </p>

        </div>

      </section>


      <!-- =================================================
           05 — OUR WISH
           ================================================= -->

      <section class="story-chapter story-wish">

        <div class="story-inner story-center">

          <p class="story-wish-text">
            Our wish is simple — to make wonderful children's books more
            accessible and affordable, so that more children can discover
            the joy of reading.
          </p>

        </div>

      </section>


      <!-- =================================================
           06 — CURATION
           ================================================= -->

      <section class="story-chapter story-paper">

        <div class="story-inner">

          <div class="story-curation-header">

            <span class="story-marker">06 / What we choose</span>

            <h2>
              Every book here is handpicked.
            </h2>

            <p>
              We choose each one with the same care we would use while
              picking a book for our own children.
            </p>

          </div>


          <div class="story-curation">

            <article class="story-curation-item">

              <span class="story-curation-number">01</span>

              <h3>
                Beautiful stories
              </h3>

              <p>
                Writing with warmth, humour and heart.
              </p>

            </article>


            <article class="story-curation-item">

              <span class="story-curation-number">02</span>

              <h3>
                Engaging illustrations
              </h3>

              <p>
                Art that makes a child want to stop, look and explore.
              </p>

            </article>


            <article class="story-curation-item">

              <span class="story-curation-number">03</span>

              <h3>
                Books worth keeping
              </h3>

              <p>
                Stories that can become favourites and earn a place
                on the shelf.
              </p>

            </article>

          </div>

        </div>

      </section>


      <!-- =================================================
           07 — INVITATION
           ================================================= -->

      <section class="story-chapter story-blush story-invitation">

        <div class="story-inner story-center">

          <div class="story-divider">
            <span></span>
          </div>

          <span
            class="story-marker"
            style="margin-top:28px"
          >
            07 / Your turn
          </span>

          <h2>
            So, take a little peek around.
          </h2>

          <p>
            You might find a story you've been looking for, a beautiful
            book you didn't know existed, or perhaps your child's next
            favourite.
          </p>

          <p>
            From treasured classics to hidden gems from around the world,
            there's always something waiting to be discovered.
          </p>

          <a
            class="button button-dark"
            href="#books"
          >
            Browse the bookshelf
          </a>

        </div>

      </section>


      <!-- =================================================
           08 — REVIEWS TRANSITION
           ================================================= -->

      <section class="story-chapter story-review-transition">

        <div class="story-inner story-center">

          <span class="story-marker">
            08 / And then...
          </span>

          <h2>
            Of course, we'd love to tell you how lovely TinyTotBooks is.
          </h2>

          <p>
            But it's much nicer when someone else says it.
          </p>

        </div>

      </section>


      <!-- =================================================
           09 — PRESENT DAY
           ================================================= -->

      <section class="story-chapter story-paper story-present">

        <div class="story-inner story-center">

          <span class="story-marker">
            09 / Today
          </span>

          <h2>
            A little box of possibilities.
          </h2>

          <p>
            We hope every parcel from TinyTotBooks feels like opening
            a little box of possibilities — a new story, a new adventure,
            and a new reason to read together.
          </p>

        </div>

      </section>


      <!-- =================================================
           10 — ENDING
           ================================================= -->

      <section class="story-chapter story-finale">

        <div class="story-inner story-center">

          <span class="story-marker">
            10 / The next chapter
          </span>

          <p class="story-finale-text">
            Come find a book.<br>
            Give it a new home.<br>
            Let its next little adventure begin.
          </p>

          <p class="story-finale-sub">
            ❤️📚
          </p>

        </div>

      </section>


      <!-- =================================================
           REVIEWS CTA
           ================================================= -->

      <section class="story-review-cta">

        <div class="story-review-copy">

          <span class="eyebrow">
            Want to see more?
          </span>

          <h2>
            Hear from the families who've been here.
          </h2>

          <p>
            More real experiences from TinyTotBooks families are waiting
            for you on our reviews page.
          </p>

        </div>

        <a
          class="button"
          href="#reviews"
        >
          Read our reviews →
        </a>

      </section>

    </section>
  `;
}
function renderBulk(){
  app.innerHTML=`
    ${pageHero(
      'Bulk & Events',
      'Stories for big little moments.',
      'Planning a birthday, school event, exhibition, return gifts, or a large book order? Tell us what you need and we’ll help you put together the perfect shelf.'
    )}

    <section class="section">
      <div class="about-grid">
        <div class="about-card">
          <span class="eyebrow">Your bulk enquiry</span>
          <h2>Let’s build your order.</h2>
          <p class="muted">
            Choose what you’re planning, how many books you need, and the
            books you’re interested in.
          </p>

          <label>
            What is this for?
            <select id="bulkPurpose">
              <option>Birthday party</option>
              <option>Preschool / school</option>
              <option>Exhibition / event</option>
              <option>Return gifts</option>
              <option>Business / corporate gifting</option>
              <option>Bulk purchase</option>
              <option>Something else</option>
            </select>
          </label>

          <label>
            Approximate number of books
            <input
              id="bulkQuantity"
              type="number"
              min="1"
              value="50"
            />
          </label>

          <label>
            Your name
            <input id="bulkName" placeholder="Your name" />
          </label>

          <label>
            City
            <input id="bulkCity" placeholder="Your city" />
          </label>

          <label>
            Anything else?
            <textarea
              id="bulkNote"
              placeholder="Age group, budget, event date, special requirements..."
            ></textarea>
          </label>
        </div>

        <div>
          <div class="about-card">
            <span style="font-size:4rem">📚</span>
            <h2>Choose your books</h2>
            <p class="muted">
              Add the books you’re interested in. You can change the
              quantities before sending your enquiry.
            </p>

            <div id="bulkBooks"></div>

            <div class="total-row" style="margin-top:20px">
              <strong>Total books</strong>
              <strong id="bulkTotal">0</strong>
            </div>

            <button
              class="button button-dark"
              type="button"
              onclick="sendBulkWhatsApp()"
              style="margin-top:20px;width:100%"
            >
              💬 Send enquiry on WhatsApp
            </button>

            <p class="photo-note" style="margin-top:12px">
              Your selections will be added automatically to the WhatsApp
              message. You’ll just need to press Send.
            </p>
          </div>
        </div>
      </div>
    </section>
  `;

  renderBulkBooks();
}

function renderBulkBooks(){
  const container=document.querySelector('#bulkBooks');
  if(!container)return;

  container.innerHTML=state.books.map(book=>`
    <div class="bulk-book">
      <div>
        <strong>${esc(book.title)}</strong>
        <p class="muted">${money(book.price)}</p>
      </div>

      <input
        class="bulk-book-qty"
        data-book-id="${book.id}"
        type="number"
        min="0"
        value="0"
        aria-label="Quantity for ${esc(book.title)}"
        onchange="updateBulkTotal()"
      />
    </div>
  `).join('');

  updateBulkTotal();
}

function updateBulkTotal(){
  const inputs=document.querySelectorAll('.bulk-book-qty');

  let total=0;

  inputs.forEach(input=>{
    total+=Math.max(0,Number(input.value)||0);
  });

  const totalEl=document.querySelector('#bulkTotal');

  if(totalEl){
    totalEl.textContent=total;
  }
}

function sendBulkWhatsApp(){
  const purpose=document.querySelector('#bulkPurpose')?.value||'Bulk order';
  const quantity=Math.max(
    0,
    Number(document.querySelector('#bulkQuantity')?.value)||0
  );
  const name=document.querySelector('#bulkName')?.value.trim()||'';
  const city=document.querySelector('#bulkCity')?.value.trim()||'';
  const note=document.querySelector('#bulkNote')?.value.trim()||'';

  const selections=[...document.querySelectorAll('.bulk-book-qty')]
    .map(input=>{
      const qty=Math.max(0,Number(input.value)||0);
      const book=state.books.find(
        b=>Number(b.id)===Number(input.dataset.bookId)
      );

      return book && qty>0
        ? `• ${book.title} × ${qty}`
        : null;
    })
    .filter(Boolean);

  if(!selections.length){
    alert('Please choose at least one book.');
    return;
  }

  const message=[
    'Hi TinyTotBooks! 👋',
    '',
    'I’d like to enquire about a bulk / event order.',
    '',
    `Purpose: ${purpose}`,
    `Approximate total: ${quantity} books`,
    '',
    'Books I’m interested in:',
    ...selections,
    '',
    name ? `Name: ${name}` : '',
    city ? `City: ${city}` : '',
    note ? `Notes: ${note}` : '',
    '',
    'Could you please share your bulk pricing and availability?'
  ]
    .filter(Boolean)
    .join('\n');

  const whatsappNumber='918789677337';
  const url=
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(url,'_blank','noopener');
}

function renderAdmin(){
  if(!state.admin){
    app.innerHTML=`
      ${pageHero(
        'Shop dashboard',
        'Admin sign in',
        'Manage your book shelf, stock status and website content from one simple place.'
      )}

      <section class="section">
        <form class="admin-login" onsubmit="adminLogin(event)">
          <h2>Welcome back</h2>
          <p class="muted">Demo passcode: <b>storybook</b></p>
          <label>Passcode<input id="adminPass" type="password" required placeholder="Enter passcode" /></label>
          <br>
          <button class="button button-dark">Open dashboard</button>
          <p class="form-notice" id="adminNotice"></p>
        </form>
      </section>
    `;
    return;
  }

  const b=state.books.find(x=>x.id===state.editingBook)||{};
  const ch=state.characters.find(x=>x.id===state.editingCharacter)||{};
  const c=state.content;

  app.innerHTML=`
    ${pageHero(
      'Shop dashboard',
      'Hello, bookseller.',
      'Edit your shelf and your storefront without opening code.'
    )}

    <section class="section">
      <div class="admin-wrap">

        <div class="settings">
          <div>
            <h2 style="margin:0">Store settings</h2>
            <p class="muted">Free-shipping threshold</p>
          </div>

          <label>Amount (₹)
            <input id="shippingInput" type="number" min="0" value="${state.shipping}" />
          </label>

          <button class="button button-dark" onclick="saveShipping()">Save setting</button>
          <button class="tiny-button" onclick="adminLogout()">Sign out</button>
        </div>

        <form class="content-editor" onsubmit="saveContent(event)">
          <h2>Home page words</h2>

          <div class="content-grid">
            <label>Announcement<input name="announcement" value="${esc(c.announcement)}" /></label>
            <label>Hero eyebrow<input name="heroEyebrow" value="${esc(c.heroEyebrow)}" /></label>
            <label>Hero title<input name="heroTitle" value="${esc(c.heroTitle)}" /></label>
            <label>Highlighted words<input name="heroHighlight" value="${esc(c.heroHighlight)}" /></label>

            <label class="full">
              Hero text
              <textarea name="heroCopy">${esc(c.heroCopy)}</textarea>
            </label>

            <label>Hero button<input name="heroButton" value="${esc(c.heroButton)}" /></label>
            <label>Collections title<input name="collectionTitle" value="${esc(c.collectionTitle)}" /></label>

            <label class="full">
              Gift-strip message
              <input name="saleText" value="${esc(c.saleText)}" />
            </label>

            <label>Club eyebrow<input name="clubEyebrow" value="${esc(c.clubEyebrow)}" /></label>
            <label>Club title<input name="clubTitle" value="${esc(c.clubTitle)}" /></label>

            <label class="full">
              Club text
              <textarea name="clubText">${esc(c.clubText)}</textarea>
            </label>

            <label>Age card eyebrow<input name="ageEyebrow" value="${esc(c.ageEyebrow)}" /></label>
            <label>Age card title<input name="ageTitle" value="${esc(c.ageTitle)}" /></label>

            <label class="full">
              Age card text
              <textarea name="ageText">${esc(c.ageText)}</textarea>
            </label>
          </div>

          <br>
          <button class="button button-dark">Save home page</button>
        </form>

        <h2 class="admin-section-title">Character & collection cards</h2>

        <form class="admin-form" onsubmit="saveCharacter(event)">
          <h2>${ch.id?'Edit':'Add'} a character card</h2>

          <label>Card title
            <input required name="title" value="${esc(ch.title||'')}" placeholder="Animal friends" />
          </label>

          <label>What it says
            <input required name="description" value="${esc(ch.description||'')}" placeholder="A short description" />
          </label>

          <label>Book genre to open
            <input required name="target" value="${esc(ch.target||'Adventure')}" placeholder="Magic" />
          </label>

          <label>Emoji (if no image)
            <input name="icon" maxlength="4" value="${esc(ch.icon||'✨')}" />
          </label>

          <label>Card colour
            <input name="color" value="${esc(ch.color||'#b9e4df')}" placeholder="#b9e4df" />
          </label>

          <label>Image link (optional)
            <input name="imageUrl" value="${esc(ch.image||'')}" placeholder="https://…" />
          </label>

          <label class="full">
            Or upload a card picture
            <input name="imageFile" type="file" accept="image/*" />
            <span class="photo-note">Use a small image (under 1 MB) in this offline demo.</span>
          </label>

          <button class="button button-dark">${ch.id?'Save card':'Add card'}</button>
          ${ch.id?'<button type="button" class="tiny-button" onclick="cancelCharacterEdit()">Cancel</button>':''}
        </form>

        <div class="collection-grid">
          ${state.characters.map(x=>`
            <article class="collection" style="background:${x.color}">
              ${x.image
                ? `<img class="collection-photo" src="${x.image}" alt="">`
                : `<span>${esc(x.icon)}</span>`}

              <h2>${esc(x.title)}</h2>
              <p>${esc(x.description)}</p>

              <button class="tiny-button" onclick="startCharacterEdit(${x.id})">Edit</button>
              <button class="tiny-button" onclick="deleteCharacter(${x.id})">Remove</button>
            </article>
          `).join('')}
        </div>

        <h2 class="admin-section-title">Books & covers</h2>

        <form class="admin-form" onsubmit="saveBook(event)">
          <h2>${b.id?'Edit':'Add'} a book</h2>

          <label>Title
            <input required name="title" value="${esc(b.title||'')}" placeholder="Book title" />
          </label>

          <label>Author
            <input required name="author" value="${esc(b.author||'')}" placeholder="Author" />
          </label>

          <label>Price (₹)
            <input required type="number" min="1" name="price" value="${b.price||''}" placeholder="349" />
          </label>

          <label>Age group
            <input required name="age" value="${esc(b.age||'')}" placeholder="4–6" />
          </label>

          <label>Genre
            <input required name="genre" value="${esc(b.genre||'')}" placeholder="Adventure" />
          </label>

          <label>Cover colour
            <input name="color" value="${esc(b.color||'#7767c9')}" placeholder="#7767c9" />
          </label>

          <label>Cover emoji (if no image)
            <input name="icon" maxlength="4" value="${esc(b.icon||'📚')}" />
          </label>

          <label>Cover image link (optional)
            <input name="imageUrl" value="${esc(b.image||'')}" placeholder="https://…" />
          </label>

          <label>Rating
            <input type="number" name="rating" min="0" max="5" step="0.1" value="${b.rating||5}" />
          </label>

          <label>Review count
            <input type="number" name="reviews" min="0" value="${b.reviews||0}" />
          </label>

          <label class="full">
            Or upload a custom book cover
            <input name="imageFile" type="file" accept="image/*" />
            <span class="photo-note">Your image will show on the home page, catalogue and book detail. Keep it under 1 MB for reliable browser storage.</span>
          </label>

          <label class="full">
            Description
            <textarea required name="description" placeholder="A short, enticing book description">${esc(b.description||'')}</textarea>
          </label>

          <button class="button button-dark">${b.id?'Save book':'Add book to shelf'}</button>
          ${b.id?'<button type="button" class="tiny-button" onclick="cancelBookEdit()">Cancel</button>':''}
        </form>

        <div class="admin-toolbar">
          <div>
            <h2>Book inventory</h2>
            <p class="muted">${state.books.length} books in your catalogue</p>
          </div>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Price</th>
              <th>Age</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            ${state.books.map(x=>`
              <tr>
                <td>
                  <b>${esc(x.title)}</b><br>
                  <span class="muted">${esc(x.author)}</span>
                </td>
                <td>${money(x.price)}</td>
                <td>${x.age}</td>
                <td>
                  <span class="status ${x.available?'available':'sold'}">
                    ${x.available?'Available':'Sold'}
                  </span>
                </td>
                <td>
                  <button class="tiny-button" onclick="startBookEdit(${x.id})">Edit</button>
                  <button class="tiny-button" onclick="toggleSold(${x.id})">Mark ${x.available?'sold':'available'}</button>
                  <button class="tiny-button" onclick="deleteBook(${x.id})">Remove</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

      </div>
    </section>
  `;
}
function renderCollabs(){
  app.innerHTML=`
    ${pageHero(
      'Let’s create together',
      'TinyTotBooks loves a good collaboration.',
      'Are you a creator, school, brand, illustrator, storyteller, or simply someone who loves children’s books? We’d love to hear from you.'
    )}

    <section class="section">
      <div class="about-grid">
        <div>
          <span class="eyebrow">Collab with us</span>
          <h2>Let’s make something lovely.</h2>
          <p>
            We’re always open to thoughtful collaborations that bring
            wonderful books and ideas to more little readers.
          </p>
          <p>
            Tell us a little about yourself, what you have in mind,
            and how you think we could work together.
          </p>

          <a
            class="button button-dark"
            href="YOUR_GOOGLE_FORM_LINK_HERE"
            target="_blank"
            rel="noopener"
          >
            Apply to collaborate
          </a>
        </div>

        <div class="about-card">
          <span style="font-size:4rem">🤝</span>
          <h2>Who can collaborate?</h2>
          <p>Creators · Schools · Brands · Illustrators · Authors · Book lovers</p>
        </div>
      </div>
    </section>
  `;
}

function renderOffers(){

  app.innerHTML = `

    <section class="page offers-page">

      <div class="page-head">

        <span class="eyebrow">
          Offers & Coupons
        </span>

        <h1>
          Little treats for little readers.
        </h1>

        <p>
          Discover our current offers and coupons
          before you fill your bookshelf.
        </p>

      </div>


      <!-- CURRENT OFFER MESSAGE -->

      <div class="offers-info-card">

        <span class="eyebrow">
          Hello fellers
        </span>

        <p id="offersMessage">
          ${esc(state.content.offersMessage)}
        </p>

      </div>


      <!-- CURRENT COUPONS -->

      <div class="offers-coupons-section">

        <div class="section-head">

          <span class="eyebrow">
            Current coupons
          </span>

          <h2>
            Save a little extra
          </h2>

        </div>

        <div id="offersCouponList">

          <p class="muted">
            Loading coupons...
          </p>

        </div>

      </div>


      <!-- COUPON RULES -->

      <div class="offers-info-card">

        <span class="eyebrow">
          Coupon rules
        </span>

        <p id="offersRules">
          ${esc(state.content.offersRules)}
        </p>

      </div>

    </section>

  `;


  /*
   * LOAD ACTIVE COUPONS
   */

  supabase
    .from('coupons')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

    .then(({data,error}) => {

      const list =
        document.querySelector('#offersCouponList');

      if(!list) return;


      /*
       * DATABASE ERROR
       */

      if(error){

        console.error(
          'Could not load coupons:',
          error
        );

        list.innerHTML =
          '<p class="muted">Unable to load coupons right now.</p>';

        return;
      }


      /*
       * NO ACTIVE COUPONS
       */

      if(!data || !data.length){

        list.innerHTML =
          '<p class="muted">No active coupons right now. Check back soon!</p>';

        return;
      }


      /*
       * RENDER COUPONS
       */

      list.innerHTML =
        data.map(coupon => {

          const discount =
            coupon.discount_type === 'percentage'
              ? `${coupon.discount_value}% OFF`
              : `${money(coupon.discount_value)} OFF`;


          return `

            <div class="coupon-card">

              <div class="coupon-card-top">

                <span class="eyebrow">
                  Coupon
                </span>

                <strong class="coupon-discount">
                  ${esc(discount)}
                </strong>

              </div>


              <h3>
                ${
                  coupon.discount_type === 'percentage'
                    ? `${coupon.discount_value}% off your order`
                    : `${money(coupon.discount_value)} off your order`
                }
              </h3>


              <p>
                Use the code below at checkout.
              </p>


              <div class="coupon-code">
                ${esc(coupon.code)}
              </div>


              ${
                Number(coupon.minimum_order || 0) > 0
                  ? `<small class="muted">
                       Minimum order: ${money(coupon.minimum_order)}
                     </small>`
                  : ''
              }

            </div>

          `;

        }).join('');

    })


    /*
     * UNEXPECTED LOADING ERROR
     */

    .catch(error => {

      console.error(
        'Coupon loading error:',
        error
      );

    });

}

function route(){

  const parts = location.hash.slice(1).split('/');
  const view = parts[0] || 'home';

  if(view === 'book'){

    const bookId = Number(parts[1]);

    if(Number.isFinite(bookId)){
      renderBookDetail(bookId);
    }else{
      renderBooks();
    }

  }else{

const pages={
  home:renderHome,
  books:renderBooks,
  characters:renderCharacters,
  ages:renderAges,
  monthly:renderMonthly,
  bundles:renderBundles,
  about:renderAbout,
  collabs:renderCollabs,
  bulk:renderBulk,
  reviews:renderReviews,
  shipping:renderShipping,
  faqs:renderFAQs,
  'track-order': renderTrackOrder,
  offers: renderOffers,
};

if(view === 'order') {

  const orderNumber =
    decodeURIComponent(
      parts.slice(1).join('/')
    );

  if(orderNumber) {
    renderOrderConfirmation(orderNumber);
  } else {
    renderHome();
  }

} else {

  (pages[view] || renderHome)();

}
    (pages[view]||renderHome)();

  }

  document.querySelector('#mainNav').classList.remove('open');
  app.focus();
}

function addToCart(id){
  const book=state.books.find(b=>b.id===id);
  if(!book||!book.available)return;

  const line=state.cart.find(x=>x.id===id);


if (line) {
  line.qty = 1;
} else {
  state.cart.push({
    id,
    qty: 1
  });
}
  save();
  openCart();
}

function addBundle(id){
  const bundle = state.bundles.find(
    b => Number(b.id) === Number(id)
  );

  if(!bundle || !bundle.active) return;

  const line = state.cart.find(
    x => x.type === 'bundle' &&
         Number(x.id) === Number(id)
  );

if (line) {
  line.qty = 1;
} else {
  state.cart.push({
  type: 'bundle',
        id: Number(id),
        qty: 1
      });

  save();
  openCart();
}
}
function addMonthlyPick(id){
  const pick = state.monthlyPicks.find(
    p => Number(p.id) === Number(id)
  );

  if(!pick || !pick.active) return;

  const line = state.cart.find(
    x => x.type === 'monthly' &&
         Number(x.id) === Number(id)
  );

if (line) {
  line.qty = 1;
} else {
  state.cart.push({
    type: 'monthly',
    id: Number(id),
    qty: 1
  });
}
  save();
  openCart();
}
function removeFromCart(type, id){

  state.cart = state.cart.filter(
    item =>
      !(
        (item.type || 'book') === type &&
        Number(item.id) === Number(id)
      )
  );

  save();
  renderCart();
}
function changeQty(type,id,d){
  const item = state.cart.find(
    x =>
      (x.type || 'book') === type &&
      Number(x.id) === Number(id)
  );

  if(!item) return;

if (type === 'book') {
  item.qty = Math.min(1, item.qty + d);
} else {
  item.qty += d;
}
  if(item.qty <= 0){
    state.cart = state.cart.filter(
      x =>
        !(
          (x.type || 'book') === type &&
          Number(x.id) === Number(id)
        )
    );
  }

  save();
  renderCart();
}

function updateCartBadge(){
  document.querySelector('#cartCount').textContent=
    state.cart.reduce((n,x)=>n+x.qty,0);
}

function renderCart(){

  const lines = state.cart
    .map(item => {

      const type = item.type || 'book';

      if(type === 'bundle'){
        const bundle = state.bundles.find(
          b => Number(b.id) === Number(item.id)
        );

        if(!bundle) return null;

        return {
          type,
          product: bundle,
          qty: item.qty
        };
      }

      if(type === 'monthly'){
        const pick = state.monthlyPicks.find(
          p => Number(p.id) === Number(item.id)
        );

        if(!pick) return null;

        return {
          type,
          product: pick,
          qty: item.qty
        };
      }

      const book = state.books.find(
        b => Number(b.id) === Number(item.id)
      );

      if(!book) return null;

      return {
        type: 'book',
        product: book,
        qty: item.qty
      };

    })
    .filter(Boolean);


  /*
   * BOOK / BUNDLE / MONTHLY SUBTOTAL
   */
  const subtotal = lines.reduce(
    (n,line) =>
      n + Number(line.product.price || 0) * line.qty,
    0
  );


  /*
   * Render cart items
   */
  document.querySelector('#cartItems').innerHTML =
    lines.length
      ? lines.map(line => {

          const {type,product,qty} = line;

          const isBook = type === 'book';

          const productTitle =
            product.title || 'Item';

          const productPrice =
            Number(product.price || 0);

          let visual = '';

          if(isBook){

            visual = `
              <div
                onclick="closeCart();openBook(${product.id})"
                style="cursor:pointer"
                title="View book details"
              >
                ${cover(product,true)}
              </div>
            `;

          }else{

            visual = `
              <div
                class="cart-cover"
                style="
                  background:${
                    product.artwork_color ||
                    product.color ||
                    '#f7bdd0'
                  };
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  font-size:2rem;
                  cursor:default;
                "
              >
                ${esc(
                  product.artwork ||
                  product.icon ||
                  '🎁'
                )}
              </div>
            `;

          }


          return `
            <div class="cart-line">

              ${visual}

              <div class="line-info">

                <h3>
                  ${esc(productTitle)}
                </h3>

                <p>
                  ${money(productPrice)}
                </p>

                ${
                  type === 'bundle'
                    ? `<small class="muted">Bundle</small>`
                    : ''
                }

                ${
                  type === 'monthly'
                    ? `<small class="muted">Monthly pick</small>`
                    : ''
                }

<div class="qty">
  <b>Quantity: 1</b>
</div>
              </div>

              <strong>
                ${money(productPrice * qty)}
              </strong>
<button
  class="cart-remove"
  type="button"
  aria-label="Remove item"
  title="Remove item"
  onclick="removeFromCart('${type}', ${product.id})"
>
  <span class="trash-icon" aria-hidden="true"></span>
</button>
              </div>
          `;

        }).join('')

      : '<p class="empty">Your bag is waiting for its first story.</p>';


  /*
   * BOOK / BUNDLE / MONTHLY SUBTOTAL
   */
  document.querySelector('#cartSubtotal').textContent =
    money(subtotal);


  /*
   * Empty cart
   */
  if(subtotal === 0){

    document.querySelector('#cartShipping').textContent =
      '₹0';

    document.querySelector('#cartTotal').textContent =
      '₹0';

    document.querySelector('#shippingMessage').textContent =
      'Add a story to get started.';

    return;
  }


  /*
   * FREE SHIPPING AT ₹799
   */
  if(subtotal >= state.shipping){

    document.querySelector('#cartShipping').textContent =
      'Free';

    document.querySelector('#cartTotal').textContent =
      money(subtotal);

    document.querySelector('#shippingMessage').textContent =
      'You’ve unlocked free delivery! 🎉';

    return;
  }


  /*
   * BELOW ₹799:
   * Read actual shipping charge from Supabase.
   */
  supabase
    .from('site_settings')
    .select('value')
    .eq('key','shipping_charge')
    .maybeSingle()

    .then(({data,error}) => {

      let shippingCharge = 0;

      if(!error && data){

        const parsed =
          Number(data.value);

        if(
          Number.isFinite(parsed) &&
          parsed >= 0
        ){
          shippingCharge = parsed;
        }

      }

      document.querySelector('#cartShipping').textContent =
        money(shippingCharge);

      document.querySelector('#cartTotal').textContent =
        money(subtotal + shippingCharge);

      document.querySelector('#shippingMessage').textContent =
        `Add ${money(state.shipping-subtotal)} more for free delivery.`;

    })

    .catch(error => {

      console.error(
        'Unable to load shipping charge:',
        error
      );

      document.querySelector('#cartShipping').textContent =
        '—';

      document.querySelector('#cartTotal').textContent =
        '—';

      document.querySelector('#shippingMessage').textContent =
        'Unable to calculate delivery charge. Please try again.';

    });
}

function openCart(){
  renderCart();

  document.querySelector('#cartDrawer').classList.add('open');
  document.querySelector('#cartDrawer').setAttribute('aria-hidden','false');
  document.querySelector('#overlay').classList.add('show');
}

function closeCart(){

  const cart = document.querySelector('#cartDrawer');
  const overlay = document.querySelector('#overlay');

  console.log(
    'BEFORE CLOSE:',
    cart.className,
    overlay.className
  );

  cart.classList.remove('open');
  overlay.classList.remove('show');

  console.log(
    'AFTER CLOSE:',
    cart.className,
    overlay.className
  );

  setTimeout(() => {

    console.log(
      '100ms LATER:',
      cart.className,
      overlay.className
    );

  }, 100);

}
function openBook(id){
  const b=state.books.find(x=>x.id===id);
  const d=document.querySelector('#bookDialog');

  d.innerHTML=`
    <div class="dialog-head">
      <span class="tag">${b.genre} · Ages ${b.age}</span>
      <button class="close" onclick="bookDialog.close()">×</button>
    </div>

    <div class="book-detail">
     <div
  class="book-detail-cover-link"
onclick="event.stopPropagation(); bookDialog.close(); location.hash='#book/${b.id}'"
  style="cursor:pointer"
  title="View full book details"
>
  ${cover(b)}
</div>

      <div>
        <h1>${esc(b.title)}</h1>
        <p class="muted">
          by ${esc(b.author)} ·
          <span class="rating">★ ${b.rating} from ${b.reviews} readers</span>
        </p>

        <p>${esc(b.description)}</p>
        <p><strong>${money(b.price)}</strong></p>

        ${b.available
          ? `<button class="button button-dark" onclick="addToCart(${b.id});bookDialog.close()">Add to bag</button>`
          : '<span class="status sold">Currently sold out</span>'}
      </div>
    </div>
  `;

  d.showModal();
}

function openBookFromBundle(id) {
  const b = state.allBooks.find(
    x => Number(x.id) === Number(id)
  );

  if (!b) {
    console.error('Bundle book not found:', id);
    return;
  }

  const d = document.querySelector('#bookDialog');

  d.innerHTML = `
    <div class="dialog-head">
      <span class="tag">${esc(b.genre || '')} · Ages ${esc(b.age || '')}</span>
      <button class="close" onclick="bookDialog.close()">×</button>
    </div>

    <div class="book-detail">


<div
  class="book-detail-cover-link"
  style="cursor:pointer"
  title="View full book details"
  onclick="openFullBookFromBundle(event, ${b.id})"
>
  ${cover(b)}
</div>

      <div>
        <h1>${esc(b.title || '')}</h1>

        <p class="muted">
          by ${esc(b.author || '')} ·
          <span class="rating">
            ★ ${b.rating || 0} from ${b.reviews || 0} readers
          </span>
        </p>

        <p>${esc(b.description || '')}</p>

        <p>
          <strong>${money(b.price || 0)}</strong>
        </p>

        <span class="status sold">
          Available only as part of a bundle
        </span>
      </div>

    </div>
  `;

  d.showModal();
}

function openFullBookFromBundle(event, bookId) {
  event.preventDefault();
  event.stopPropagation();

  const overlay = document.querySelector('.bundle-details-overlay');

  if (overlay) {
    overlay.remove();
  }

  if (typeof bookDialog !== 'undefined' && bookDialog.open) {
    bookDialog.close();
  }

  location.hash = `#book/${bookId}`;
}

/* =========================================================
   ORDER CONFIRMATION
========================================================= */

function renderOrderConfirmation(orderNumber) {

  app.innerHTML = `
    <section class="page-hero">
      <span class="eyebrow">Order confirmed</span>

      <h1>
        Your little order is on its way.
      </h1>

      <p>
        Thank you for shopping with TinyTotBooks.
      </p>
    </section>

    <section class="section">

      <div
        class="about-card"
        style="
          max-width:620px;
          margin:0 auto;
          text-align:center;
        "
      >

        <p class="muted">
          Your order number
        </p>

        <div
          style="
            display:flex;
            align-items:center;
            justify-content:center;
            gap:10px;
            flex-wrap:wrap;
            margin:12px 0 24px;
          "
        >

          <strong
            id="confirmationOrderNumber"
            style="
              font-size:1.35rem;
              letter-spacing:.04em;
            "
          >
            ${esc(orderNumber)}
          </strong>

          <button
            class="tiny-button"
            type="button"
            onclick="copyOrderNumber()"
          >
            Copy
          </button>

        </div>

        <div
          style="
            background:#f7f3eb;
            border-radius:14px;
            padding:18px;
            margin-top:20px;
          "
        >

          <strong>
            Keep this order number safe.
          </strong>

          <p
            class="muted"
            style="margin-bottom:0"
          >
            You can enter it on the
            <a href="#track-order">
              Track your order
            </a>
            page in the footer to view your order later.
          </p>

        </div>

      </div>

    </section>
  `;

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function renderTrackOrder() {

  app.innerHTML = `
    <section class="page-hero">
      <span class="eyebrow">Track your order</span>

      <h1>
        Where's your little order?
      </h1>

      <p>
        Enter the order number and phone number
        used when placing your order.
      </p>
    </section>

    <section class="section">

      <div
        class="about-card track-order-card"
      >

        <div class="track-order-icon">
          📦
        </div>

        <h2>
          Find your order
        </h2>

        <p class="muted">
          Both details must match the order
          placed with TinyTotBooks.
        </p>

        <form id="trackOrderForm">

          <label for="trackOrderNumber">
            Order number
          </label>

          <input
            id="trackOrderNumber"
            type="text"
            autocomplete="off"
            placeholder="TTB-1787934096443-XXXXXX"
            required
          >

          <label for="trackOrderPhone">
            Phone number
          </label>

          <input
            id="trackOrderPhone"
            type="tel"
            inputmode="tel"
            autocomplete="tel"
            placeholder="Phone number used at checkout"
            required
          >

          <button
            class="primary track-order-button"
            type="submit"
          >
            Track my order
          </button>

          <div
            id="trackOrderStatus"
            class="status"
          ></div>

        </form>

      </div>

      <div
        id="trackedOrderResult"
        class="track-order-result"
      ></div>

    </section>
  `;

  const form =
    document.getElementById(
      'trackOrderForm'
    );

  const status =
    document.getElementById(
      'trackOrderStatus'
    );

  const result =
    document.getElementById(
      'trackedOrderResult'
    );

  form.addEventListener(
    'submit',
    async event => {

      event.preventDefault();

      console.log('TRACK ORDER BUTTON CLICKED');

      const orderNumber =
        document
          .getElementById(
            'trackOrderNumber'
          )
          .value
          .trim();

      const phoneNumber =
        document
          .getElementById(
            'trackOrderPhone'
          )
          .value
          .trim();

      result.innerHTML = '';

status.textContent =
  'Looking for your order...';

status.classList.remove('error');
      const button =
        form.querySelector(
          'button[type="submit"]'
        );

      button.disabled = true;
      button.textContent =
        'Checking...';

      try {

        const {
          data,
          error
        } =
          await supabase.functions.invoke(
            'track-order',
            {
              body: {
                order_number:
                  orderNumber,

                phone_number:
                  phoneNumber
              }
            }
          );

        if (error) {
          throw error;
        }

        if (
          !data ||
          !data.success ||
          !data.order
        ) {

status.textContent =
  data?.error ||
  'We could not find an order matching those details.';

status.classList.add('error');
          return;
        }

status.textContent = '';
status.classList.remove('error');
        renderTrackedOrder(
          data.order
        );

      } catch (error) {

console.log(
  'TRACK ORDER FUNCTION RESPONSE:',
  error
);

        console.error(
          'Track order error:',
          error
        );

status.textContent =
  'We could not look up your order right now. Please try again.';

status.classList.add('error');
      } finally {

        button.disabled = false;
        button.textContent =
          'Track my order';

      }

    }
  );

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function renderTrackedOrder(order) {

  const result =
    document.getElementById(
      'trackedOrderResult'
    );

  if (!result) return;

  const items =
    Array.isArray(order.items)
      ? order.items
      : [];

  const itemMarkup =
    items.length
      ? items.map(item => {

          const quantity =
            Number(
              item.quantity ??
              item.qty ??
              1
            );

          const unitPrice =
            Number(
              item.unit_price ??
              0
            );

          const lineTotal =
            Number(
              item.line_total ??
              (unitPrice * quantity)
            );

          return `
            <li class="tracked-order-item">

              <span>
                <strong>
                  ${esc(
                    item.title ||
                    'Book'
                  )}
                </strong>

                <span class="tracked-order-quantity">
                  × ${quantity}
                </span>
              </span>

              <strong>
                ₹${lineTotal.toFixed(2)}
              </strong>

            </li>
          `;

        }).join('')
      : `
          <li class="tracked-order-item">
            <span>
              Order details
            </span>
          </li>
        `;

  const orderDate =
    order.created_at
      ? new Date(
          order.created_at
        ).toLocaleString(
          'en-IN'
        )
      : '—';

  result.innerHTML = `

    <article class="tracked-order-card">

      <div class="tracked-order-header">

        <div>

          <span class="eyebrow">
            Order found
          </span>

          <h2>
            Your order
          </h2>

        </div>

        <span class="tracked-order-status">
          Confirmed
        </span>

      </div>

      <div class="tracked-order-number">

        <span>
          Order number
        </span>

        <strong>
          ${esc(
            order.order_number
          )}
        </strong>

      </div>

      <div class="tracked-order-customer">

        <p>
          <strong>
            ${esc(
              order.customer_name ||
              'Customer'
            )}
          </strong>
        </p>

        <p class="muted">
          Order placed:
          ${esc(orderDate)}
        </p>

      </div>

      <div class="tracked-order-section">

        <h3>
          Books ordered
        </h3>

        <ul class="tracked-order-items">
          ${itemMarkup}
        </ul>

      </div>

      <div class="tracked-order-total">

        <div>
          Subtotal
          <span>
            ₹${Number(
              order.subtotal || 0
            ).toFixed(2)}
          </span>
        </div>

        <div>
          Shipping
          <span>
            ₹${Number(
              order.shipping || 0
            ).toFixed(2)}
          </span>
        </div>

        <div class="tracked-order-grand-total">
          <strong>
            Total paid
          </strong>

          <strong>
            ₹${Number(
              order.total || 0
            ).toFixed(2)}
          </strong>
        </div>

      </div>

    </article>

    <div class="tracked-order-message">

      <div class="tracked-order-message-icon">
        💬
      </div>

      <div>

        <h3>
          What happens next?
        </h3>

        <p>
          As a small home-run business, we personally
          handle every order from packing to dispatch.
          You should receive a message from us within
          the next 24 hours regarding your order.
        </p>

        <p>
          Any further updates and correspondence
          will follow on WhatsApp.
        </p>

      </div>

    </div>

  `;

  result.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

function copyOrderNumber() {

  const element =
    document.querySelector('#confirmationOrderNumber');

  if (!element) return;

  const orderNumber =
    element.textContent.trim();

  navigator.clipboard.writeText(orderNumber)
    .then(() => {

      const button =
        document.querySelector(
          '#confirmationOrderNumber + button'
        );

      if (!button) return;

      const original =
        button.textContent;

      button.textContent = 'Copied!';

      setTimeout(() => {
        button.textContent = original;
      }, 1500);

    })
    .catch(() => {

      alert(
        'Could not copy automatically. Please copy the order number manually.'
      );

    });
}

/* =========================================================
   BOOK DETAIL PAGE
========================================================= */

function renderBookDetail(id){

  const b = state.allBooks.find(
    x => Number(x.id) === Number(id)
  );

  if(!b){
    renderBooks();
    return;
  }

  const images =
    Array.isArray(b.images) && b.images.length
      ? b.images
      : [];

  const mainImage =
    images.length
      ? images[0].image_url
      : b.image;

  app.innerHTML = `
    <section class="book-detail-page">

      <div class="book-detail-top">
        <button
          class="text-link"
          type="button"
          onclick="location.hash='#books'"
        >
          ← Back to books
        </button>
      </div>

      <div class="book-detail-layout">

        <div class="book-gallery">

          <div
            class="book-detail-main-image"
            id="bookDetailMainImage"
            style="background:${b.color || '#eee'}"
          >
            ${
              mainImage
                ? `<img
                    src="${esc(mainImage)}"
                    alt="${esc(b.title)}"
                  >`
                : `<span class="cover-icon">
                    ${esc(b.icon || '📚')}
                  </span>`
            }
          </div>

          ${
            images.length > 1
              ? `
                <div class="book-thumbnails">
                  ${images.map((image,index)=>`
                    <button
                      type="button"
                      class="book-thumbnail ${index === 0 ? 'active' : ''}"
                      onclick="changeBookDetailImage(${index})"
                      aria-label="View image ${index + 1}"
                    >
                      <img
                        src="${esc(image.image_url)}"
                        alt="${esc(b.title)} image ${index + 1}"
                        loading="${index === 0 ? 'eager' : 'lazy'}"
                      >
                    </button>
                  `).join('')}
                </div>
              `
              : ''
          }

        </div>

        <div class="book-detail-info">

          <span class="tag">
            ${esc(b.genre || 'Children’s book')}
            · Ages ${esc(b.age || '')}
          </span>

          <h1>${esc(b.title)}</h1>

          <p class="book-detail-author">
            by ${esc(b.author)}
          </p>

          <div class="book-detail-rating">
            ${
              b.rating != null
                ? `★ ${esc(b.rating)}`
                : ''
            }
            ${
              b.reviews
                ? ` · ${esc(b.reviews)} readers`
                : ''
            }
          </div>

          <p class="book-detail-description">
            ${esc(b.description || '')}
          </p>

          ${
            b.condition_notes
              ? `
                <div class="book-condition">
                  <h3>Book condition</h3>
                  <p>${esc(b.condition_notes)}</p>
                </div>
              `
              : ''
          }

          <div class="book-detail-purchase">

            <strong class="book-detail-price">
              ${money(b.price)}
            </strong>

            ${
              b.available
                ? `
                  <button
                    class="button button-dark"
                    type="button"
                    onclick="addToCart(${b.id})"
                  >
                    Add to bag
                  </button>
                `
                : `
                  <span class="status sold">
  Available only as part of a bundle

                  </span>
                `
            }

          </div>

        </div>

      </div>

    </section>
  `;

  window.scrollTo({
    top:0,
    behavior:'smooth'
  });
}


/* =========================================================
   BOOK DETAIL IMAGE SWITCHER
========================================================= */

function changeBookDetailImage(index){

  const id =
    Number(location.hash.split('/')[1]);

const b =
  state.allBooks.find(
    x => Number(x.id) === id
  );

  if(!b || !b.images || !b.images[index]) return;

  const image =
    b.images[index].image_url;

  const main =
    document.querySelector(
      '#bookDetailMainImage'
    );

  if(!main) return;

  main.innerHTML = `
    <img
      src="${esc(image)}"
      alt="${esc(b.title)}"
    >
  `;

  document
    .querySelectorAll('.book-thumbnail')
    .forEach((button,i)=>{
      button.classList.toggle(
        'active',
        i === index
      );
    });

}

function setFilter(f){
  state.filter=f;
  renderBooks();
}

function setBookSort(value){
  state.sort = value;
  renderBooks();
}

function filterFromLink(f){
  state.filter=f;
}

function filterAge(a){
  state.ageFilter = a;
  state.filter = 'All';
  renderBooks();
}

function toggleSold(id){
  const b=state.books.find(x=>x.id===id);
  b.available=!b.available;
  save();
  renderAdmin();
}

function deleteBook(id){
  if(confirm('Remove this book from your shelf?')){
    state.books=state.books.filter(b=>b.id!==id);
    state.cart=state.cart.filter(x=>x.id!==id);
    save();
    renderAdmin();
  }
}

function photoFromForm(form,done){
  const file=form.querySelector('[name="imageFile"]').files[0];

  if(!file){
    done(form.elements.imageUrl.value.trim());
    return;
  }

  if(
    file.size>950000 &&
    !confirm('This photo is over 1 MB. It may not fit in this browser’s local storage. Continue?')
  )return;

  const reader=new FileReader();

  reader.onload=()=>done(reader.result);
  reader.readAsDataURL(file);
}

function saveBook(e){
  e.preventDefault();

  const form=e.currentTarget;
  const f=new FormData(form);

  photoFromForm(form,image=>{
    const old=state.books.find(x=>x.id===state.editingBook);

    const book={
      id:old?.id||Date.now(),
      title:f.get('title').trim(),
      author:f.get('author').trim(),
      price:Number(f.get('price')),
      age:f.get('age').trim(),
      genre:f.get('genre').trim(),
      icon:f.get('icon').trim()||'📚',
      color:f.get('color').trim()||'#7767c9',
      image:image||old?.image||'',
      description:f.get('description').trim(),
      rating:Number(f.get('rating'))||5,
      reviews:Math.max(0,Number(f.get('reviews'))||0),
      available:old?.available??true
    };

    if(old)
      Object.assign(old,book);
    else
      state.books.push(book);

    state.editingBook=null;
    save();
    renderAdmin();
  });
}

function startBookEdit(id){
  state.editingBook=id;
  renderAdmin();
  window.scrollTo({top:0,behavior:'smooth'});
}

function cancelBookEdit(){
  state.editingBook=null;
  renderAdmin();
}

function saveCharacter(e){
  e.preventDefault();

  const form=e.currentTarget;
  const f=new FormData(form);

  photoFromForm(form,image=>{
    const old=state.characters.find(
      x=>x.id===state.editingCharacter
    );

    const item={
      id:old?.id||Date.now(),
      title:f.get('title').trim(),
      description:f.get('description').trim(),
      target:f.get('target').trim()||'All',
      icon:f.get('icon').trim()||'✨',
      color:f.get('color').trim()||'#b9e4df',
      image:image||old?.image||''
    };

    if(old)
      Object.assign(old,item);
    else
      state.characters.push(item);

    state.editingCharacter=null;
    save();
    renderAdmin();
  });
}

function startCharacterEdit(id){
  state.editingCharacter=id;
  renderAdmin();
  window.scrollTo({top:0,behavior:'smooth'});
}

function cancelCharacterEdit(){
  state.editingCharacter=null;
  renderAdmin();
}

function deleteCharacter(id){
  if(confirm('Remove this character card?')){
    state.characters=state.characters.filter(x=>x.id!==id);
    save();
    renderAdmin();
  }
}

function saveContent(e){
  e.preventDefault();

  const f=new FormData(e.currentTarget);

  Object.keys(defaultContent).forEach(
    key=>state.content[key]=(f.get(key)||'').trim()
  );

  save();
  alert('Home page text saved. Open Home to see it.');
}

function saveShipping(){
  state.shipping=Math.max(
    0,
    Number(document.querySelector('#shippingInput').value)||0
  );

  save();
  alert('Free-shipping threshold saved.');
}

function adminLogin(e){
  e.preventDefault();

  if(document.querySelector('#adminPass').value==='storybook'){
    state.admin=true;
    sessionStorage.setItem('ss-admin','yes');
    renderAdmin();
  }else{
    document.querySelector('#adminNotice').textContent=
      'That passcode doesn’t match. Try “storybook”.';
  }
}

function adminLogout(){
  state.admin=false;
  sessionStorage.removeItem('ss-admin');
  renderAdmin();
}

function sendMessage(e){
  e.preventDefault();

  document.querySelector('#contactNotice').textContent=
    'Thanks! In the real site this would send via your email service.';

  e.target.reset();
}

document.querySelector('#menuButton').onclick=()=>{
  document.querySelector('#mainNav').classList.toggle('open');
};

document.querySelector('#cartButton').onclick=openCart;

document.querySelector('#overlay').onclick=closeCart;

document.querySelectorAll('[data-close]').forEach(button => {
console.log('CART CLOSE BUTTON TOUCHED');
  const handleClose = event => {

    event.preventDefault();
    event.stopPropagation();

    const id = button.dataset.close;

    if (id === 'cartDrawer') {
      closeCart();
    } else {
      document
        .querySelector('#' + id)
        ?.close();
    }
  };

  button.addEventListener('click', handleClose);
  button.addEventListener('pointerup', handleClose);
});
document.querySelector('#searchButton').onclick=()=>{
  searchDialog.showModal();
  searchInput.focus();
  searchBooks();
};

document.querySelector('#searchInput').oninput=searchBooks;

function searchBooks(){
  const q=searchInput.value.toLowerCase();

if(!q.trim()){
  searchResults.innerHTML='<p class="empty">Start typing to find a story.</p>';
  return;
}
  const list=state.books.filter(
    b=>[b.title,b.author,b.genre,b.age]
      .join(' ')
      .toLowerCase()
      .includes(q)
  );

  searchResults.innerHTML=
    list.map(b=>`
      <div class="result">
        ${cover(b,true)}

        <div>
          <h3>${esc(b.title)}</h3>
          <p>${b.author} · ${money(b.price)}</p>
        </div>

        <button
          class="tiny-button"
          onclick="searchDialog.close();openBook(${b.id})">
          View
        </button>
      </div>
    `).join('')
    || '<p class="empty">No stories found — try a different word.</p>';
}

document.querySelector('#checkoutButton').onclick=()=>{
  if(!state.cart.length)return;

  closeCart();
  checkoutDialog.showModal();
};

document.querySelector('#checkoutForm').onsubmit = async e => {
  e.preventDefault();

  if (!state.cart.length) return;

  const form = e.currentTarget;
  const formData = new FormData(form);

const name = (formData.get('name') || '').trim();
const phone = (formData.get('phone') || '').trim();
const otp = (formData.get('otp') || '').trim();
const email = (formData.get('email') || '').trim();

const address = {
  house: (formData.get('address_house') || '').trim(),
  building: (formData.get('address_building') || '').trim(),
  street: (formData.get('address_street') || '').trim(),
  area: (formData.get('address_area') || '').trim(),
  landmark: (formData.get('address_landmark') || '').trim(),
  city: (formData.get('address_city') || '').trim(),
  pin: (formData.get('address_pin') || '').trim(),
  district: (formData.get('address_district') || '').trim(),
  state: (formData.get('address_state') || '').trim(),
  country: 'INDIA'
};

/*
 * OTP verification is not implemented yet.
 *
 * We collect the OTP now so the checkout form is ready
 * for WhatsApp verification later.
 *
 * IMPORTANT:
 * The OTP is intentionally NOT used for authorization
 * or payment verification at this stage.
 */

if (!name || !phone) {
  checkoutNotice.textContent =
    'Please enter your full name and WhatsApp number.';
  return;
}

/*
 * Normalize an Indian WhatsApp number.
 *
 * Accepted examples:
 *
 * 9876543210
 * +91 9876543210
 * +919876543210
 * 91 9876543210
 * 91-9876543210
 *
 * Internally we always store/send the final
 * 10-digit Indian mobile number.
 */

let cleanPhone =
  phone.replace(/\D/g, '');

/*
 * Remove India's country code if the customer
 * entered it.
 */
if (
  cleanPhone.length === 12 &&
  cleanPhone.startsWith('91')
) {
  cleanPhone =
    cleanPhone.slice(2);
}

/*
 * Indian mobile numbers must:
 * - contain exactly 10 digits
 * - begin with 6, 7, 8 or 9
 */
if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
  checkoutNotice.textContent =
    'Please enter a valid Indian WhatsApp number.';
  return;
}

/* Email remains optional.
 */
if (email) {
  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    checkoutNotice.textContent =
      'Please enter a valid email address.';
    return;
  }
}

/*
 * Every delivery field is required except landmark.
 *
 * The server performs the same validation again.
 * Never rely on frontend validation for security.
 */
const requiredAddressFields = [
  ['House / Flat No.', address.house],
  ['Building / Society Name', address.building],
  ['Street / Road Name', address.street],
  ['Area / Locality', address.area],
  ['City / Town', address.city],
  ['PIN Code', address.pin],
  ['District', address.district],
  ['State', address.state]
];

const missingAddressField =
  requiredAddressFields.find(
    ([, value]) => !value
  );

if (missingAddressField) {
  checkoutNotice.textContent =
    `Please enter your ${missingAddressField[0]}.`;
  return;
}

/*
 * PIN must be exactly 6 digits.
 */
if (!/^\d{6}$/.test(address.pin)) {
  checkoutNotice.textContent =
    'Please enter a valid 6-digit PIN code.';
  return;
}

/*
 * Country is fixed by the form and is never taken
 * from user input.
 */
address.country = 'INDIA';

checkoutNotice.textContent =
  'Preparing secure payment…';
  /*
   * Name, phone and delivery address are mandatory.
   * Email is optional.
   */
if (
  !name ||
  !phone ||
  !address.house ||
  !address.building ||
  !address.street ||
  !address.area ||
  !address.city ||
  !address.pin ||
  !address.district ||
  !address.state
) {
  checkoutNotice.textContent =
    'Please fill in all required customer and delivery details.';
  return;
}

  checkoutNotice.textContent = 'Preparing secure payment…';

  try {

    /* Load Razorpay Checkout */
    if (!window.Razorpay) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');

        script.src =
          'https://checkout.razorpay.com/v1/checkout.js';

        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(script);
      });
    }

    /*
     * Send ONLY product IDs + quantities to our server.
     *
     * The server gets the real prices from Supabase.
     * The browser is NOT trusted for prices.
     */
    const response = await fetch(
      'https://xzwkombhtesozqobldvu.supabase.co/functions/v1/create-razorpay-order',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

body: JSON.stringify({
customer: {
  name,
  phone: cleanPhone,
  otp: otp || null,
  email: email || null,
  address
},

  cart: state.cart.map(item => ({
    type: item.type || 'book',
    id: item.id,
    qty: item.qty
  })),

  coupon_code: appliedCoupon
    ? appliedCoupon.code
    : null
})
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || 'Could not create payment order.'
      );
    }

    checkoutNotice.textContent = '';

    const options = {

      key: data.key_id,

      amount: data.amount,

      currency: data.currency,

      name: 'TinyTotBooks',

      description: 'Your TinyTotBooks order',

      order_id: data.razorpay_order_id,

prefill: {
  name,
  email: email || undefined,
  contact: cleanPhone
},

notes: {
  customer_name: name,
  customer_phone: cleanPhone,
  customer_email: email || '',
  shipping_address: JSON.stringify(address)
},

      theme: {
        color: '#26343b'
      },

      /*
       * Razorpay calls this ONLY after successful payment.
       */
      handler: async function(paymentResponse) {
const orderCart = state.cart.map(item => ({
  book_id: item.id,
  qty: item.qty
}));
        console.log(
          'Razorpay payment response:',
          paymentResponse
        );


        try {

          /*
           * IMPORTANT:
           *
           * The browser does NOT decide whether payment succeeded.
           *
           * These payment details go to our Supabase Edge Function,
           * where the Razorpay signature is verified server-side.
           */
          const verifyResponse = await fetch(
            'https://xzwkombhtesozqobldvu.supabase.co/functions/v1/verify-razorpay-payment',
            {
              method: 'POST',

              headers: {
                'Content-Type': 'application/json'
              },

              body: JSON.stringify({

                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature,

                customer: {
                  name,
                  phone,
                  email: email || null,
                  address
                },

items: state.cart.map(item => ({
  type: item.type || 'book',
  id: item.id,
  qty: item.qty
}))
              })
            }
          );

          const verifyData =
            await verifyResponse.json();

          if (
            !verifyResponse.ok ||
            !verifyData.success
          ) {
            throw new Error(
              verifyData.error ||
              'Payment verification failed.'
            );
          }

          /*
           * Payment has now been verified by the server.
           *
           * Only NOW do we consider the order successful.
           */

// Mark every ordered book as unavailable.
// This happens ONLY after Razorpay payment has been
// successfully verified by the Supabase server.

const orderedBookIds = [
  ...new Set(
    state.cart
      .filter(item => (item.type || 'book') === 'book')
      .map(item => item.id)
  )
];

for (const bookId of orderedBookIds) {
  const { error: availabilityError } = await supabase
    .from('books')
    .update({ available: false })
    .eq('id', bookId);

  if (availabilityError) {
    console.error(
      `Could not update availability for book ${bookId}:`,
      availabilityError
    );
  }
}

renderOrderConfirmation(
  verifyData.order?.order_number ||
  verifyData.order_number ||
  data.order_number
);


          /*
           * Clear the cart only after successful
           * server-side payment verification.
           */
state.cart = [];

save();

form.reset();

checkoutDialog.close();

/*
 * The order has been verified and saved by the server.
 * Only now send the customer to the confirmation page.
 */
if (
  verifyData.order &&
  verifyData.order.order_number
) {

  location.hash =
    `#order/${encodeURIComponent(
      verifyData.order.order_number
    )}`;

} else {

  checkoutNotice.textContent =
    'Order confirmed, but we could not display the order number. Please contact us.';

}
          console.log(
            'Verified TinyTotBooks order:',
            verifyData
          );

        } catch (verificationError) {

          console.error(
            'Payment verification error:',
            verificationError
          );

          /*
           * IMPORTANT:
           *
           * We DO NOT clear the cart here.
           * We DO NOT tell the user the order succeeded.
           */
          checkoutNotice.textContent =
            verificationError.message ||
            'Payment was received but could not be verified. Please contact us before trying again.';
        }
      },

      modal: {
        ondismiss: function() {

          checkoutNotice.textContent =
            'Payment window closed. Your order has not been placed.';
        }
      }
    };

    const razorpay =
      new Razorpay(options);

    razorpay.on(
      'payment.failed',
      function(response) {

        console.error(
          'Razorpay payment failed:',
          response
        );

        checkoutNotice.textContent =
          'Payment failed or was cancelled. No order was placed.';
      }
    );
console.log('TTB: About to close checkout and open Razorpay');

checkoutDialog.close();
razorpay.open();

  } catch (error) {

    console.error(
      'Checkout error:',
      error
    );

    checkoutNotice.textContent =
      error.message ||
      'Something went wrong while starting payment.';
  }
};

document.addEventListener('click',e=>{
  const card=e.target.closest('.cover');

  if(card){
    const title=card.querySelector('.cover-title')?.textContent;
    const b=state.books.find(x=>x.title===title);

    if(b)openBook(b.id);
  }
});

window.addEventListener('hashchange',route);

save();
route();

async function loadSiteSettings() {

  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');

  if (error) {
    console.error('Could not load site settings:', error);
    return;
  }

  for (const setting of data || []) {

    if (!setting.key) continue;

    // Update any matching homepage content field automatically
    if (
      Object.prototype.hasOwnProperty.call(
        state.content,
        setting.key
      )
    ) {
      state.content[setting.key] =
        setting.value ?? state.content[setting.key];
    }

  }

  updateAnnouncement();
}

async function initializeApp() {

  await loadSiteSettings();

  await loadBooksFromSupabase();

  await loadCharactersFromSupabase();

  await loadBookImagesFromSupabase();

  await loadMonthlyPicksFromSupabase();

  await loadBundlesFromSupabase();

  await loadReviewsFromSupabase();


  updateAnnouncement();

  route();

}

initializeApp();

/* =========================================================
   PREVENT BROWSER FROM RESTORING OLD SCROLL POSITION
   ========================================================= */

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0);

window.addEventListener('hashchange', () => {
  window.scrollTo(0, 0);

  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 50);
});