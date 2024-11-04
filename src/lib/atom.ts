import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// GLOBAL ATOM
export const loadingAtom = atom(false);

// TRANSACTION ATOM
export const inboundDataAtom = atom<InboundRecordDTO[]>([]);
export const outboundDataAtom = atom<OutboundRecordDTO[]>([]);
export const transferDataAtom = atom<TransferRecordDTO[]>([]);
export const relocationDataAtom = atom<RelocationRecordDTO[]>([]);
export const stockOpnameProfileAtom = atom<StockOpnameProfileDTO[]>([]);
export const stockOpnameProfileDetailAtom = atom<StockOpnameProfileDetailDTO[]>(
  []
);
export const userMenuAtom = atomWithStorage<MenuUserDTO[]>("userMenu", []);
export const allMenusAtom = atomWithStorage<MenuUserDTO[]>("allMenus", []);

export const menuLoadingAtom = atom<boolean>(true);

// REPORT ATOM
export const stockItemDataAtom = atom<StockItemRecordDTO[]>([]);
