import React, { PropsWithChildren } from 'react';

export const ContainerFooter = ({ children }: PropsWithChildren) => {
  return (
    <div className="py-4 gap-4 lg:gap-8 flex-wrap container flex flex-col lg:flex-row lg:justify-between items-center">
      {children}
    </div>
  );
};
