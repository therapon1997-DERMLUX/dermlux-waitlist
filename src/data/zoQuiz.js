// Skin analysis quiz + regimen recommendation engine.
// Logic follows the ZO® philosophy from the official Training Manual:
// Getting Skin Ready (cleanse / exfoliate / tone) → Prevent + Correct → Hydrate → Protect.
// Product mapping uses item numbers from the ACD Wellness Cyprus order form.

export const QUIZ_STEPS = [
  {
    id: 'skinType',
    title: 'How would you describe your skin?',
    single: true,
    options: [
      { value: 'oily', label: 'Oily', hint: 'Shiny, enlarged pores' },
      { value: 'combination', label: 'Combination', hint: 'Oily T-zone, normal cheeks' },
      { value: 'normal', label: 'Normal', hint: 'Balanced, rarely reactive' },
      { value: 'dry', label: 'Dry', hint: 'Tight, flaky, rough patches' },
      { value: 'sensitive', label: 'Sensitive', hint: 'Easily irritated, reactive' },
    ],
  },
  {
    id: 'concerns',
    title: 'What are your main concerns?',
    subtitle: 'Choose up to 3',
    max: 3,
    options: [
      { value: 'aging', label: 'Fine lines + wrinkles' },
      { value: 'pigment', label: 'Dark spots + uneven tone' },
      { value: 'acne', label: 'Breakouts + congestion' },
      { value: 'redness', label: 'Redness + rosacea' },
      { value: 'dullness', label: 'Dullness' },
      { value: 'texture', label: 'Texture + large pores' },
      { value: 'eyes', label: 'Eye area' },
      { value: 'dehydration', label: 'Dehydration' },
    ],
  },
  {
    id: 'age',
    title: 'Your age group?',
    single: true,
    options: [
      { value: 'u30', label: 'Under 30' },
      { value: '30_45', label: '30 – 45' },
      { value: 'o45', label: '45+' },
    ],
  },
  {
    id: 'retinol',
    title: 'Have you used retinol before?',
    single: true,
    options: [
      { value: 'never', label: 'Never' },
      { value: 'some', label: 'Occasionally' },
      { value: 'regular', label: 'Regularly' },
    ],
  },
  {
    id: 'pregnancy',
    title: 'Are you pregnant or breastfeeding?',
    subtitle: 'Retinol products are not recommended during pregnancy or breastfeeding.',
    single: true,
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes' },
    ],
  },
  {
    id: 'spf',
    title: 'Your sunscreen preference?',
    single: true,
    options: [
      { value: 'invisible', label: 'Invisible / sheer finish' },
      { value: 'tinted', label: 'Tinted' },
      { value: 'mineral', label: '100% mineral (sensitive skin)' },
      { value: 'powder', label: 'Powder for on-the-go' },
    ],
  },
];

// item numbers
const P = {
  CLEANSER_OILY: '967100',
  CLEANSER_DRY: '968600',
  CLEANSER_GENTLE: '973600',
  CLEANSER_BALANCING: '916100',
  POLISH: '900400',
  SCRUB_DUAL: '974000',
  PADS_RENEWAL: '928200',
  PADS_OIL: '928400',
  TONER_CALMING: '928600',
  DPD: '969700',
  AOX: '969600',
  GF_SERUM: '904400',
  FIRMING: '912700',
  WT_RETINOL: '969300',
  VITC: '904000',
  EXF_ACCEL: '915900',
  PORE_REFINER: '941800',
  RSB: '950300',
  BRIGHTALIVE: '940700',
  CLARIFYING: '922700',
  CLEARING_MASQUE: '973420',
  ROZATROL: '973160',
  RENEWAL: '950200',
  RECOVERY: '950100',
  HYDRATING_CREME: '915300',
  HYDRO_MIST: '924400',
  EYE_INTENSE: '907900',
  EYE_BRIGHT: '918300',
  EYE_GF: '973130',
  SPF_SHEER: '941700',
  SPF_FLUID: '916900',
  SPF_TONE: '973400',
  SPF_MINERAL: '933300',
  SPF_POWDER_L: '972400',
  PRG_DAILY: '973540',
  PRG_AGING: '973570',
  PRG_REDNESS: '977400',
  PRG_CLEARING: '922900',
  PRG_BRIGHT: '975200',
};

export function buildRegimen(a) {
  const rec = []; // { itemNo, step, reason }
  const add = (itemNo, step, reason) => {
    if (itemNo && !rec.some((r) => r.itemNo === itemNo)) rec.push({ itemNo, step, reason });
  };
  const has = (c) => (a.concerns || []).includes(c);
  const pregnant = a.pregnancy === 'yes';
  const retinolOk = !pregnant && a.skinType !== 'sensitive' && a.retinol !== 'never';

  // 1. CLEANSE
  if (a.skinType === 'oily' || (a.skinType === 'combination' && has('acne')))
    add(P.CLEANSER_OILY, 'Step 1 · Cleanse', 'Targets surface oil on normal-to-oily, acne-prone skin.');
  else if (a.skinType === 'dry')
    add(P.CLEANSER_DRY, 'Step 1 · Cleanse', 'Cleanses while restoring hydration to dry skin.');
  else if (a.skinType === 'sensitive')
    add(P.CLEANSER_BALANCING, 'Step 1 · Cleanse', 'Gentle emulsion for sensitized, reactive skin.');
  else add(P.CLEANSER_GENTLE, 'Step 1 · Cleanse', 'Balanced everyday cleansing for all skin types.');

  // 2. EXFOLIATE
  if (a.skinType === 'oily' || has('acne'))
    add(P.SCRUB_DUAL, 'Step 2 · Exfoliate', 'Physical + chemical exfoliation for oily, breakout-prone skin.');
  else if (a.skinType !== 'sensitive')
    add(P.POLISH, 'Step 2 · Exfoliate', 'Magnesium crystals polish away dead cells for instant glow.');

  // 3. TONE
  if (a.skinType === 'oily' || has('acne'))
    add(P.PADS_OIL, 'Step 3 · Tone', 'Controls oil and keeps pores clear.');
  else if (a.skinType === 'sensitive')
    add(P.TONER_CALMING, 'Step 3 · Tone', 'Calms and rebalances the skin barrier pH.');
  else add(P.PADS_RENEWAL, 'Step 3 · Tone', 'Gently renews complexion and preps skin for treatment.');

  // 4. TREAT
  if (has('aging')) {
    add(P.DPD, 'Step 4 · Treat', 'The ZO® hero serum — DNA repair, barrier support, anti-aging for every routine.');
    if (retinolOk && (a.age === 'o45' || a.retinol === 'regular'))
      add(P.WT_RETINOL, 'Step 4 · Treat', '0.5% retinol visibly improves wrinkles, texture and firmness.');
    else if (a.age === 'o45')
      add(P.GF_SERUM, 'Step 4 · Treat', 'Growth factors strengthen skin without retinol irritation.');
  }
  if (has('pigment')) {
    if (retinolOk) add(P.RSB, 'Step 4 · Treat', 'Retinol brightener evens tone and fades dark spots.');
    else add(P.BRIGHTALIVE, 'Step 4 · Treat', 'Non-retinol brightener — safe in pregnancy and for sensitive skin.');
    add(P.VITC, 'Step 4 · Treat', '10% vitamin C brightens and defends against free radicals.');
  }
  if (has('acne')) {
    add(P.CLARIFYING, 'Step 4 · Treat', 'Clarifies congested, breakout-prone complexion.');
    add(P.CLEARING_MASQUE, 'Step 4 · Treat', 'Sulfur masque 1–2× weekly to absorb oil and calm breakouts.');
  }
  if (has('redness')) add(P.ROZATROL, 'Step 4 · Treat', 'Normalizes red, sensitized skin and reduces visible flushing.');
  if (has('dullness') && !has('pigment')) add(P.VITC, 'Step 4 · Treat', 'Vitamin C restores radiance to a dull complexion.');
  if (has('texture')) {
    add(P.PORE_REFINER, 'Step 4 · Treat', 'Instantly minimizes the look of pores and smooths texture.');
    if (retinolOk && !has('aging')) add(P.EXF_ACCEL, 'Step 4 · Treat', 'Accelerates cell turnover for smoother texture.');
  }

  // 5. HYDRATE
  if (a.skinType === 'dry' || has('dehydration'))
    add(P.RECOVERY, 'Step 5 · Hydrate', 'Rich recovery moisturizer for dry, compromised skin.');
  else if (a.skinType === 'sensitive')
    add(P.HYDRATING_CREME, 'Step 5 · Hydrate', 'Soothing hydration that supports a weakened barrier.');
  else if (a.skinType !== 'oily')
    add(P.RENEWAL, 'Step 5 · Hydrate', 'Lightweight daily moisturizer that supports renewal.');
  if (has('dehydration')) add(P.HYDRO_MIST, 'Step 5 · Hydrate', 'Instant soothing hydration boost during the day.');

  // 6. EYES
  if (has('eyes')) {
    if (has('aging') || a.age === 'o45') add(P.EYE_GF, 'Eye Care', 'Growth factor technology for lines and hollowing around the eyes.');
    else if (has('pigment') || has('dullness')) add(P.EYE_BRIGHT, 'Eye Care', 'Brightens dark circles and evens the eye area.');
    else add(P.EYE_INTENSE, 'Eye Care', 'Targets puffiness, lines and loss of firmness.');
  }

  // 7. PROTECT — always
  if (a.spf === 'tinted') add(P.SPF_TONE, 'Step 6 · Protect', 'Tinted SPF 50 that adapts to your skin tone.');
  else if (a.spf === 'mineral' || pregnant || a.skinType === 'sensitive')
    add(P.SPF_MINERAL, 'Step 6 · Protect', '100% mineral SPF 50 — ideal for sensitive and post-treatment skin.');
  else if (a.spf === 'powder') add(P.SPF_POWDER_L, 'Step 6 · Protect', 'Brush-on powder SPF for effortless reapplication.');
  else if (a.skinType === 'oily') add(P.SPF_SHEER, 'Step 6 · Protect', 'Dry-touch sheer SPF 50, no greasy feel.');
  else add(P.SPF_FLUID, 'Step 6 · Protect', 'Weightless fluid SPF 50 for daily protection.');

  // Value program suggestion
  let program = null;
  if (has('redness')) program = { itemNo: P.PRG_REDNESS, reason: 'Complete redness relief + barrier defense system at kit price.' };
  else if (has('acne')) program = { itemNo: P.PRG_CLEARING, reason: 'Complete complexion clearing system at kit price.' };
  else if (has('pigment')) program = { itemNo: P.PRG_BRIGHT, reason: 'Complete brightening system at kit price.' };
  else if (has('aging')) program = { itemNo: P.PRG_AGING, reason: 'Complete anti-aging system at kit price.' };
  else program = { itemNo: P.PRG_DAILY, reason: 'The essential daily ZO® routine in one kit.' };

  return { recommendations: rec, program };
}
