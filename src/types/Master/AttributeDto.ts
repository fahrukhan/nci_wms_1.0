// attributeDTO.ts

import { Attribute, NewAttribute } from "@/drizzle/schema/MasterData/attributes.schema";


export interface AttributeDTO extends Omit<Attribute, 'list'> {
  list: string;
  listItems: string[];
}

export interface NewAttributeDTO extends Omit<NewAttribute, 'list'> {
  list: string;
  listItems: string[];
}

export function toAttributeDTO(attribute: Attribute): AttributeDTO {
    return {
      ...attribute,
      listItems: attribute.list ? attribute.list.split(',').filter(Boolean) : [],
    };
  }
  
  export function fromAttributeDTO(attributeDTO: AttributeDTO): Attribute {
    const { listItems, ...rest } = attributeDTO;
    return {
      ...rest,
      list: listItems.join(','),
    };
  }
  
  export function toNewAttributeDTO(newAttribute: NewAttribute): NewAttributeDTO {
    return {
      ...newAttribute,
      list: newAttribute.list || '',  // Ensure list is always a string
      listItems: newAttribute.list ? newAttribute.list.split(',').filter(Boolean) : [],
    };
  }
  
  export function fromNewAttributeDTO(newAttributeDTO: NewAttributeDTO): NewAttribute {
    const { listItems, ...rest } = newAttributeDTO;
    return {
      ...rest,
      list: listItems.join(','),
    };
  }