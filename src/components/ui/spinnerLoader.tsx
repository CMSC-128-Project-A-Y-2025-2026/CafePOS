import { Item, ItemContent, ItemMedia, ItemTitle } from "./item";
import { Spinner } from "./spinner";

export function SpinnerDemo({ name }: { name: string }) {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
      <Item variant="muted">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">Loading {name}...</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  );
}
