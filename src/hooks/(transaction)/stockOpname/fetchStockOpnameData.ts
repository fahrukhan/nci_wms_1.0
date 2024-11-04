import { loadingAtom, stockOpnameProfileAtom } from '@/lib/atom';
import { getHeaders } from '@/lib/utils/GetHeaders';
import { getCookie } from 'cookies-next';
import { useSetAtom } from 'jotai';

export const useFetchStockOpnameData = () => {
  const setStockOpnameProfile = useSetAtom(stockOpnameProfileAtom);
  const setLoading = useSetAtom(loadingAtom);

  const fetchStockOpnameData = async (filter: { warehouseId: string; }) => {
    setLoading(true);
    try {
      const { warehouseId } = filter;
      let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stock-opname/profile`;
      if (warehouseId) {
        url += `/${warehouseId}`;
      }
      const response = await fetch(url, {
        headers: await getHeaders(),
      });

      const {data} = await response.json();
      setStockOpnameProfile(data);
    } catch (error) {
      console.error('Error fetching transfer data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { fetchStockOpnameData };
};