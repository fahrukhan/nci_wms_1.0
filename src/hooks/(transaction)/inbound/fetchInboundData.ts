import { inboundDataAtom, loadingAtom } from '@/lib/atom';
import { getHeaders } from '@/lib/utils/GetHeaders';
import { useSetAtom } from 'jotai';

export const useFetchInboundData = () => {
  const setInboundData = useSetAtom(inboundDataAtom);
  const setLoading = useSetAtom(loadingAtom);

  const fetchInboundData = async (filter: { warehouseId: string; supplierId: string; startDate: string; endDate: string }) => {
    setLoading(true);
    try {
      const { warehouseId, supplierId, startDate, endDate } = filter;
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/inbound?warehouseId=${warehouseId}&supplierId=${supplierId}&startDate=${startDate}&endDate=${endDate}`, {
        headers: await getHeaders(),
        cache: "no-store",
      });
      const {data} = await response.json();
      setInboundData(data);

    } catch (error) {
      console.error('Error fetching inbound data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { fetchInboundData };
};