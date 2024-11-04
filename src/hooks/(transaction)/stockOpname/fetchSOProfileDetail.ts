import { loadingAtom, stockOpnameProfileDetailAtom } from '@/lib/atom';
import { getCookie } from 'cookies-next';
import { useSetAtom } from 'jotai';
import { getHeaders } from '@/lib/utils/GetHeaders';

export const useFetchSOProfileDetail = (soProfileId: string) => {
  const setSOProfileDetail = useSetAtom(stockOpnameProfileDetailAtom);
  const setLoading = useSetAtom(loadingAtom);

  const fetchSOProfileDetail = async (filter: { warehouseId: string; }) => {
    setLoading(true);
    const token = getCookie('token');
    try {
      const { warehouseId } = filter;
      let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stock-opname/filter/profile/${soProfileId}`;
      const response = await fetch(url, {
        cache: "no-store",
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonResponse = await response.json();
      const { data } = jsonResponse;

      if (data && Array.isArray(data.rows)) {
        setSOProfileDetail(data.rows);
      } else {
        console.error('Fetched data.rows is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching transfer data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { fetchSOProfileDetail };
};