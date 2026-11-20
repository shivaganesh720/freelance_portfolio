import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  filterProjectsByCategory,
  getNextAccordionState,
  resolveActiveSection,
  buildMailtoHref,
} = require('../public/script.js');

const sampleProjects = [
  { id: 'fraudguard', category: 'ml' },
  { id: 'retinascan', category: 'cv' },
  { id: 'drowsiness', category: 'cv' },
  { id: 'nlp-chatbot', category: 'nlp' },
];

test('filterProjectsByCategory returns all projects when category is all', () => {
  assert.deepEqual(filterProjectsByCategory(sampleProjects, 'all'), [
    'fraudguard',
    'retinascan',
    'drowsiness',
    'nlp-chatbot',
  ]);
});

test('filterProjectsByCategory filters accurately by category', () => {
  assert.deepEqual(filterProjectsByCategory(sampleProjects, 'cv'), [
    'retinascan',
    'drowsiness',
  ]);
  assert.deepEqual(filterProjectsByCategory(sampleProjects, 'ml'), ['fraudguard']);
  assert.deepEqual(filterProjectsByCategory(sampleProjects, 'nlp'), ['nlp-chatbot']);
  assert.deepEqual(filterProjectsByCategory(sampleProjects, 'unknown'), []);
});

test('getNextAccordionState toggles panels cleanly', () => {
  assert.equal(getNextAccordionState(null, 'faq-panel-1'), 'faq-panel-1');
  assert.equal(getNextAccordionState('faq-panel-1', 'faq-panel-1'), null);
  assert.equal(getNextAccordionState('faq-panel-1', 'faq-panel-2'), 'faq-panel-2');
});

test('resolveActiveSection identifies the active section based on scroll position', () => {
  const sections = [
    { id: 'about', top: 700 },
    { id: 'services', top: 1400 },
    { id: 'projects', top: 2300 },
  ];

  assert.equal(resolveActiveSection(sections, 0, 150), null);
  assert.equal(resolveActiveSection(sections, 600, 150), 'about');
  assert.equal(resolveActiveSection(sections, 1300, 150), 'services');
  assert.equal(resolveActiveSection(sections, 2500, 150), 'projects');
});

test('buildMailtoHref creates encoded mailto URLs', () => {
  assert.equal(
    buildMailtoHref('naguruganesh2005@gmail.com', 'Project Enquiry'),
    'mailto:naguruganesh2005@gmail.com?subject=Project%20Enquiry'
  );
  assert.equal(
    buildMailtoHref('naguruganesh2005@gmail.com', ''),
    'mailto:naguruganesh2005@gmail.com'
  );
});
