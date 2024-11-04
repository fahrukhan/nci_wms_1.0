import { loadingAtom,relocationDataAtom } from '@/lib/atom';
import { getHeaders } from '@/lib/utils/GetHeaders';
import { useSetAtom } from 'jotai';

export const useFetchRelocationData = () => {
  const setRelocationData = useSetAtom(relocationDataAtom);
  const setLoading = useSetAtom(loadingAtom);

  const fetchRelocationData = async (filter: { warehouseId: string; originId: string; destinationId: string; startDate: string; endDate: string }) => {
    setLoading(true);
    try {
      const { warehouseId, originId, destinationId, startDate, endDate } = filter;
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/relocation?warehouseId=${warehouseId}&originId=${originId}&destinationId=${destinationId}&startDate=${startDate}&endDate=${endDate}`, {
        headers: await getHeaders(),
        cache: "no-store",
      });
      const {data} = await response.json();
      setRelocationData(data);
    } catch (error) {
      console.error('Error fetching transfer data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { fetchRelocationData };
};