import { IWatch } from '../../interfaces';
import { watchData } from '../../watch-data/watch-data';
import { fillQuantity } from './fill-quantity';
import { renderProductsPage } from '../../templates/render-products-page';
import { sortProducts } from './sort-products';
import { setLocalData } from '../../utils/set-local-data';
import { getLocalData } from '../../utils/get-local-data';
import { findLimitValue } from './multirange';

export let filteredArray = [...watchData];
export let chosenBrands: IWatch[] = [];
export let nazaraData: IWatch[] = [];
export let isBrandChecked = false;

function filterOptions(filtersEl: HTMLElement): void {
  const local = getLocalData();
  const pointerOption = filtersEl.querySelector('#clockface-pointer') as HTMLInputElement;
  const digitalOption = filtersEl.querySelector('#clockface-digital') as HTMLInputElement;
  const strapOption = filtersEl.querySelector('#mount-strap') as HTMLInputElement;
  const braceletOption = filtersEl.querySelector('#mount-bracelet') as HTMLInputElement;
  const searchInput = filtersEl.querySelector('.search-bar__input') as HTMLInputElement;

  filteredArray = [...watchData];

  if (searchInput.value) {
    filteredArray = filteredArray.filter((el) => {
      return (
        el.brand.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        el.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        String(el.price).includes(searchInput.value) ||
        String(el.stock).includes(searchInput.value) ||
        el.clockFace.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        el.mount.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        el.description.toLowerCase().includes(searchInput.value.toLowerCase())
      );
    });
  }

  local.localFilters.search = searchInput.value;

  if (digitalOption.checked && pointerOption.checked) {
    filteredArray = filteredArray.filter((el) => el.clockFace === 'digital' || el.clockFace === 'pointer');
  } else if (pointerOption.checked) {
    filteredArray = filteredArray.filter((el) => el.clockFace === 'pointer');
  } else if (digitalOption.checked) {
    filteredArray = filteredArray.filter((el) => el.clockFace === 'digital');
  }

  if (strapOption.checked && braceletOption.checked) {
    filteredArray = filteredArray.filter((el) => el.mount === 'strap' || el.mount === 'bracelet');
  } else if (strapOption.checked) {
    filteredArray = filteredArray.filter((el) => el.mount === 'strap');
  } else if (braceletOption.checked) {
    filteredArray = filteredArray.filter((el) => el.mount === 'bracelet');
  }

  local.localFilters.optionsPointer = pointerOption.checked;
  local.localFilters.optionsDigital = digitalOption.checked;
  local.localFilters.optionsStrap = strapOption.checked;
  local.localFilters.optionsBracelet = braceletOption.checked;
  setLocalData(local);
}

function filterBrands(filtersEl: HTMLElement): void {
  const local = getLocalData();
  const casioCheckbox = filtersEl.querySelector('#casio') as HTMLInputElement;
  const citizenCheckbox = filtersEl.querySelector('#citizen') as HTMLInputElement;
  const northEdgeCheckbox = filtersEl.querySelector('#north-edge') as HTMLInputElement;
  const seikoCheckbox = filtersEl.querySelector('#seiko') as HTMLInputElement;
  const tagHeuerCheckbox = filtersEl.querySelector('#tag-heuer') as HTMLInputElement;
  const fossilCheckbox = filtersEl.querySelector('#fossil') as HTMLInputElement;
  const brandsCheckbox = [
    casioCheckbox,
    citizenCheckbox,
    northEdgeCheckbox,
    seikoCheckbox,
    tagHeuerCheckbox,
    fossilCheckbox,
  ];

  isBrandChecked = false;

  chosenBrands = [];

  brandsCheckbox.forEach((el) => {
    if (el.checked) {
      chosenBrands = [...chosenBrands, ...filteredArray.filter((item) => item.brand === el.dataset.brand)];
      isBrandChecked = true;
    }
  });

  local.localFilters.brandCasio = casioCheckbox.checked;
  local.localFilters.brandCitizen = citizenCheckbox.checked;
  local.localFilters.brandNorthEdge = northEdgeCheckbox.checked;
  local.localFilters.brandSeiko = seikoCheckbox.checked;
  local.localFilters.brandTagHeuer = tagHeuerCheckbox.checked;
  local.localFilters.brandFossil = fossilCheckbox.checked;
  setLocalData(local);
}

function filterRanges(filtersEl: HTMLElement): void {
  const local = getLocalData();
  const priceFrom = filtersEl.querySelector('.slider__from-data__input-price') as HTMLInputElement;
  const priceTo = filtersEl.querySelector('.slider__to-data__input-price') as HTMLInputElement;
  const stockFrom = filtersEl.querySelector('.slider__from-data__input-stock') as HTMLInputElement;
  const stockTo = filtersEl.querySelector('.slider__to-data__input-stock') as HTMLInputElement;

  filteredArray = filteredArray.filter((el) => {
    return (
      el.price >= +priceFrom.value &&
      el.price <= +priceTo.value &&
      el.stock >= +stockFrom.value &&
      el.stock <= +stockTo.value
    );
  });

  local.localFilters.priceFrom = +priceFrom.value;
  local.localFilters.priceTo = +priceTo.value;
  local.localFilters.stockFrom = +stockFrom.value;
  local.localFilters.stockTo = +stockTo.value;
  local.localFilters.priceMin = findLimitValue(nazaraData, 'price', 'min');
  local.localFilters.priceMax = findLimitValue(nazaraData, 'price', 'max');
  local.localFilters.stockMin = findLimitValue(nazaraData, 'stock', 'min');
  local.localFilters.stockMax = findLimitValue(nazaraData, 'stock', 'max');
  setLocalData(local);
}

export function applyAllFilters(filtersEl: HTMLElement): void {
  filterOptions(filtersEl);
  filterBrands(filtersEl);

  nazaraData = isBrandChecked ? chosenBrands : filteredArray;

  filterRanges(filtersEl);
  sortProducts(filtersEl);

  const itemsArray = isBrandChecked ? chosenBrands : filteredArray;

  renderProductsPage(itemsArray);
  fillQuantity(filtersEl, itemsArray);
}

export function filterProductsListener(filtersEl: HTMLElement): void {
  const allInputs = filtersEl.querySelectorAll('input') as NodeListOf<HTMLInputElement>;

  allInputs.forEach((el) => {
    el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', () => {
      applyAllFilters(filtersEl);
    });
  });

  filtersEl.addEventListener('mousedown', (event) => {
    const target = event.target as HTMLElement;

    if (target.classList.contains('multi-range__btn')) {
      document.addEventListener('mouseup', function applyFiltersListener() {
        applyAllFilters(filtersEl);
        document.removeEventListener('mouseup', applyFiltersListener);
      });
    }
  });
}
