"use server";

export async function fetchSupplierInboundData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/contact/supplier/inbound`,
    {
      cache: "no-cache",
    }
  );
  const { data } = await response.json();
  const transformedData = data.map((item: any) => ({
    value: item.id.toString(),
    label: item.name,
  }));
  return transformedData;
}

export async function fetchOutboundCustomerData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/contact/customer/outbound`,
    {
      cache: "no-cache",
    }
  );
  const { data } = await response.json();
  const transformedData = data.map((item: any) => ({
    value: item.id.toString(),
    label: item.name,
  }));
  return transformedData;
}

export async function fetchSOWarehouseData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/warehouse/stock-opname`,
    {
      cache: "no-cache",
    }
  );
  const { data } = await response.json();
  const transformedData = data.map((item: any) => ({
    value: item.id.toString(),
    label: item.name,
  }));
  return transformedData;
}

export async function fetchTransferOriginWarehouseData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/warehouse/transfer/origin`,
    {
      cache: "no-cache",
    }
  );
  const { data } = await response.json();
  const transformedData = data.map((item: any) => ({
    value: item.id.toString(),
    label: item.name,
  }));
  return transformedData;
}

export async function fetchTransferDestinationWarehouseData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/warehouse/transfer/destination`,
    {
      cache: "no-cache",
    }
  );
  const { data } = await response.json();
  const transformedData = data.map((item: any) => ({
    value: item.id.toString(),
    label: item.name,
  }));
  return transformedData;
}
