import { ILocalData } from '../interfaces';

export function setLocalData(data: ILocalData): void {
  if (data.localAmount || data.localAmount === 0) {
    localStorage.setItem('amount-os', JSON.stringify(data.localAmount));
  }
  if (data.localCart) {
    localStorage.setItem('cart-os', JSON.stringify(data.localCart));
  }
  if (data.localCounter || data.localCounter === 0) {
    localStorage.setItem('counter-os', JSON.stringify(data.localCounter));
  }
  if (data.localLimit) {
    localStorage.setItem('limit-os', JSON.stringify(data.localLimit));
  }
  if (data.localPage) {
    localStorage.setItem('page-os', JSON.stringify(data.localPage));
  }
  if (data.localFilters) {
    localStorage.setItem('filters-os', JSON.stringify(data.localFilters));
  }
  if (data.localPromo) {
    localStorage.setItem('promo-os', JSON.stringify(data.localPromo));
  }
}
