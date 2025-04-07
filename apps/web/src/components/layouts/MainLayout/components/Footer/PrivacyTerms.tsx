import { HStack } from '@/components/ui/Utilities';
import React from 'react';
import { LinkFooter } from './LinkFooter';

export const PrivacyTerms = () => {
  return (
    <HStack spacing={8}>
      <LinkFooter href={'#'}>Lottery Privacy</LinkFooter>
      <LinkFooter href={'#'}>Terms</LinkFooter>
    </HStack>
  );
};
