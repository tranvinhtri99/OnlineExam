
export type PropertyPath<Type extends object> = (x: Type) => any;
type Expression<Type extends object> = (x: Type) => boolean;

export function addItem<T extends object>(data:T[], item:T): T[]{
  data = [...data, item];
  return data
}

export function addItemClone<T extends object>(data:T[], item:T): T[]{
  data = [...data, Object.assign({}, item)];
  return data
}

export  function updateItem<T extends object>(data:T[], item: T, path: PropertyPath<T>) : T[]{
  data = data.map((value) => path(value) == path(item) ? item : value);
  return data;
}

export  function deleteItem<T extends object>(data:T[], expression: Expression<T>) : T[]{
  data = data.filter((value) => !expression(value));
  return data;
}

export function removeLastItem<T extends object>(data:T[]):T[]{
  data.pop();
  return data;
}

export function removeItem<T extends object>(data:T[], index:number):T[]{
  data.splice(index, 1);
  return data;
}
