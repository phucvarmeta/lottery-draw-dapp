import React, { PropsWithChildren } from 'react';

export const ContainerHeader = ({ children }: PropsWithChildren) => (
  <div className="lg:bg-white/10 bg-primary-foreground backdrop-blur-sm bg-header-texture lg:h-16 flex flex-row items-center px-8 py-2 lg:py-2 rounded-sm justify-between gap-8">
    {children}
  </div>
);
