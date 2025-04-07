import { type ForwardRefExoticComponent, type RefAttributes, type SVGProps } from 'react';
import { Loader2 } from 'lucide-react';

import fileWarning from './svg/file-warning.svg';

const IconList = {
  spinner: Loader2,
  fileWarning,
};

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type ComponentAttributes = RefAttributes<SVGSVGElement> & SVGAttributes;
interface IconProps extends ComponentAttributes {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
}

export type Icon = ForwardRefExoticComponent<IconProps>;

export const Icons = IconList as Record<keyof typeof IconList, Icon>;
