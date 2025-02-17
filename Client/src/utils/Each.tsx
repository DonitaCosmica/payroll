import { Children, JSX, ReactNode } from "react";

interface Props<T> {
  render: (item: T, index: number) => ReactNode,
  of: T[]
}

export const Each = <T,>({ render, of }: Props<T>): JSX.Element =>
  <> { Children.toArray(of.map((item, index) => render(item, index))) } </>