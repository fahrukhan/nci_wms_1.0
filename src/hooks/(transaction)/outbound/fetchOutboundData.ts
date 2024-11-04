import { loadingAtom, outboundDataAtom } from '@/lib/atom';
import { getHeaders } from '@/lib/utils/GetHeaders';
import { useSetAtom } from 'jotai';

export const useFetchOutboundData = () => {
  const setOutboundData = useSetAtom(outboundDataAtom);
  const setLoading = useSetAtom(loadingAtom);

  const fetchOutboundData = async (filter: { warehouseId: string; contactId: string; startDate: string; endDate: string }) => {
    setLoading(true);
    try {
      const { warehouseId, contactId, startDate, endDate } = filter;
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/outbound?warehouseId=${warehouseId}&contactId=${contactId}&startDate=${startDate}&endDate=${endDate}`, {
        headers: await getHeaders(),
        cache: "no-store",
      });
      const {data} = await response.json();
      setOutboundData(data);
    } catch (error) {
      console.error('Error fetching inbound data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { fetchOutboundData };
};