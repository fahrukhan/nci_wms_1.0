import { getAttributesCombo } from "@/app/actions/attributeActions";
import { getCategoriesCombo } from "@/app/actions/categoryActions";
import { getUnitsCombo } from "@/app/actions/unitActions";
import CreateProductForm from "@/components/Dashboard/Master/Product/CreateProductForm";

export default async function Page() {
  const { data: category } = await getCategoriesCombo();
  const { data: attribute } = await getAttributesCombo();
  const { data: unit } = await getUnitsCombo();

  return (
    <section className="table-wrapper">
      <CreateProductForm
        category={category}
        attribute={attribute}
        unit={unit}
      />
    </section>
  );
}
