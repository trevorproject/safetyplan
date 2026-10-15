import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { getDocs } from 'firebase/firestore';
import { REGION_STORAGE_KEY } from '../../context/region';
import { LANGUAGE_STORAGE_KEY } from '../../context/language';
import { FreeResources } from './FreeResources';
import { freeResourcesContent, lifelineCard, trevorCard } from '../../data/resourcesContent';
import {
  atEachBreakpoint,
  renderResponsive,
  getClassSet,
  expectAdaptsAt,
  expectResponsiveBaseline,
  expectResponsiveHorizontalPadding,
  expectHasMaxWidthContainer,
  BREAKPOINTS,
} from '../../test/responsive';

describe('FreeResources responsiveness', () => {
  it('renders the heading and both resource cards at every supported screen width', () => {
    atEachBreakpoint(<FreeResources />, ({ width }) => {
      expect(screen.getByRole('heading', { name: freeResourcesContent.heading }), `missing at ${width}px`).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: trevorCard.heading })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: lifelineCard.heading })).toBeInTheDocument();
    });
  });

  it('stacks the two cards on mobile and lays them side-by-side from lg', () => {
    const { container } = renderResponsive(<FreeResources />, BREAKPOINTS.lg);
    expect(getClassSet(container).has('lg:flex-row')).toBe(true);
    expectAdaptsAt(container, ['sm', 'lg']);
  });

  it('keeps card images fluid and the section overflow-safe', () => {
    const { container } = renderResponsive(<FreeResources />, BREAKPOINTS.xs);
    const imgs = container.querySelectorAll('img');
    expect(imgs.length).toBe(2);
    imgs.forEach((img) => expect(img.className).toMatch(/w-full/));
    expectResponsiveHorizontalPadding(container);
    expectHasMaxWidthContainer(container);
    expectResponsiveBaseline(container);
  });
});

describe('FreeResources region resources', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  function mockResources(docs: Record<string, Record<string, unknown>>) {
    vi.mocked(getDocs).mockResolvedValue({
      docs: Object.entries(docs).map(([id, data]) => ({ id, data: () => data })),
    } as never);
  }

  it('shows the 988 card only in the United States', () => {
    renderResponsive(<FreeResources />, BREAKPOINTS.lg);
    expect(screen.getByRole('heading', { name: lifelineCard.heading })).toBeInTheDocument();
  });

  it('hides 988 outside the United States but keeps The Trevor Project', () => {
    window.localStorage.setItem(REGION_STORAGE_KEY, 'mx');
    renderResponsive(<FreeResources />, BREAKPOINTS.lg);
    expect(screen.queryByRole('heading', { name: lifelineCard.heading })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: trevorCard.heading })).toBeInTheDocument();
  });

  it('lists the region resources first and the international ones after, without region headings', async () => {
    window.localStorage.setItem(REGION_STORAGE_KEY, 'mx');
    mockResources({
      g: { region: 'GLOBAL', isActive: true, name: 'International line', url: 'https://global.example.org', order: 1 },
      mx: { region: 'MX', isActive: true, name: 'Línea MX', phone: '5512345678', order: 1 },
    });
    renderResponsive(<FreeResources />, BREAKPOINTS.lg);

    const regional = await screen.findByRole('heading', { name: 'Línea MX' });
    const international = screen.getByRole('heading', { name: 'International line' });
    expect(regional.compareDocumentPosition(international) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Mexico' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Global' })).not.toBeInTheDocument();

    // Phone shown in the Mexican format, with an international tel: link.
    const phone = screen.getByRole('link', { name: /55 1234 5678/ });
    expect(phone).toHaveAttribute('href', 'tel:+525512345678');
    const site = screen.getAllByRole('link', { name: new RegExp(lifelineCard.action.label) }).map((a) => a.getAttribute('href'));
    expect(site).toContain('https://global.example.org');
  });

  it('lays each resource out as image, centred name, description and link in a responsive grid', async () => {
    window.localStorage.setItem(REGION_STORAGE_KEY, 'mx');
    mockResources({
      mx: {
        region: 'MX',
        isActive: true,
        name: 'Safe Space Hotline',
        description: '24/7 support line',
        url: 'https://example.com/mx-hotline',
        imageUrl: 'https://firebasestorage.googleapis.com/hotline.png',
      },
      noImage: { region: 'MX', isActive: true, name: 'Línea sin imagen', phone: '5512345678' },
    });
    const { container } = renderResponsive(<FreeResources />, BREAKPOINTS.xs);

    const name = await screen.findByRole('heading', { name: 'Safe Space Hotline' });
    expect(name).toHaveClass('text-center');
    const card = name.closest('li')!;
    const image = card.querySelector('img')!;
    expect(image).toHaveAttribute('src', 'https://firebasestorage.googleapis.com/hotline.png');
    expect(image).toHaveAttribute('alt', 'Safe Space Hotline');
    // Order inside the card: image, name, description, link.
    const description = screen.getByText('24/7 support line');
    const link = card.querySelector('a')!;
    expect(image.compareDocumentPosition(name) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(name.compareDocumentPosition(description) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(description.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(link).toHaveAttribute('href', 'https://example.com/mx-hotline');

    // A resource without an image still renders, just without the picture.
    const other = screen.getByRole('heading', { name: 'Línea sin imagen' }).closest('li')!;
    expect(other.querySelector('img')).toBeNull();

    const grid = card.closest('ul')!;
    expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'xl:grid-cols-3');
    expectResponsiveBaseline(container);
  });

  it('shows the international resources as a fallback when the region has none', async () => {
    window.localStorage.setItem(REGION_STORAGE_KEY, 'mx');
    mockResources({ g: { region: 'GLOBAL', isActive: true, name: 'International line', url: 'https://global.example.org' } });
    renderResponsive(<FreeResources />, BREAKPOINTS.lg);
    expect(await screen.findByRole('heading', { name: 'International line' })).toBeInTheDocument();
  });

  it('uses the resource text of the active language', async () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
    window.localStorage.setItem(REGION_STORAGE_KEY, 'us');
    mockResources({ us: { region: 'US', isActive: true, name: { en: 'US line', es: 'Línea EE. UU.' }, phone: '8664887386' } });
    renderResponsive(<FreeResources />, BREAKPOINTS.lg);
    expect(await screen.findByRole('heading', { name: 'Línea EE. UU.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /\(866\) 488-7386/ })).toHaveAttribute('href', 'tel:+18664887386');
  });

  it('still shows The Trevor Project when the database cannot be reached', async () => {
    vi.mocked(getDocs).mockRejectedValue(new Error('offline'));
    renderResponsive(<FreeResources />, BREAKPOINTS.lg);
    expect(screen.getByRole('heading', { name: trevorCard.heading })).toBeInTheDocument();
    await vi.waitFor(() => expect(getDocs).toHaveBeenCalled());
  });
});
