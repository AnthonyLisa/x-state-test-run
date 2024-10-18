export namespace SingleSelectTemplate {
  export type Value = string | number | readonly string[];

  export type Item<V extends Value> = {
    text: string;
    value: V;
  };

  export interface Props<V extends Value, T extends Item<V> = Item<V>> {
    data: T[];
    onSelect: (value: V) => void;
    selectedItem?: V | null;
  }
}

export const SingleSelectTemplate = <V extends SingleSelectTemplate.Value>({
  onSelect,
  selectedItem,
  data,
}: SingleSelectTemplate.Props<V>) => (
  <div>
    {data.map((item, index) => (
      <label key={index}>
        <input
          type="radio"
          value={item.value}
          checked={item.value === selectedItem}
          onChange={() => onSelect(item.value)}
        />
        {item.text}
      </label>
    ))}
  </div>
);
