import { JSX, ComponentType, ComponentProps } from 'preact'

export type PropsOf<C extends ComponentType<any>> = JSX.LibraryManagedAttributes<C, ComponentProps<C>>
